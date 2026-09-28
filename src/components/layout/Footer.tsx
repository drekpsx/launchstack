import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/config/app";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">{APP_NAME}</span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed max-w-xs">
              Your personalized system for using AI to grow your e-commerce business — built around your workflows,
              used with the AI tools you already have.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-background/90">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/#how-it-works" className="text-sm text-background/70 hover:text-background transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-sm text-background/70 hover:text-background transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-background/70 hover:text-background transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-background/90">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-background/70 hover:text-background transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-background/70 hover:text-background transition-colors">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-background/90">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/legal/privacy" className="text-sm text-background/70 hover:text-background transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="text-sm text-background/70 hover:text-background transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/refund" className="text-sm text-background/70 hover:text-background transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-background/40 max-w-md text-center sm:text-right">
            We don't call any AI API. We personalize workflows and prompts for you to use with your own ChatGPT or
            Claude.
          </p>
        </div>
      </div>
    </footer>
  );
}
