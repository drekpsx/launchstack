import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/config/app";

const navigation = [
  { name: "How it works", href: "/#how-it-works" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/pricing" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container-page flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">{APP_NAME}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link to="/onboarding">Build My System</Link>
              </Button>
            </>
          )}

          <button
            type="button"
            className="lg:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in">
          <div className="container-page py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <Button asChild>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                      Build My System
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
