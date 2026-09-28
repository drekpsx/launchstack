import {
  Search,
  CircleCheck,
  FileText,
  Gift,
  Megaphone,
  Video,
  CalendarDays,
  Globe,
  Mail,
  Gauge,
  UsersRound,
  UserSearch,
} from "lucide-react";

const features = [
  { icon: Search, name: "Product Research", description: "Find and analyze winning product ideas." },
  { icon: CircleCheck, name: "Product Validation", description: "Stress-test an idea before you commit." },
  { icon: FileText, name: "Product Page", description: "Titles, descriptions, FAQ, CTAs — all of it." },
  { icon: Gift, name: "Offer", description: "Bundles, bonuses and guarantees that convert." },
  { icon: Megaphone, name: "Meta Ads", description: "Angles, copy, hooks and creative testing." },
  { icon: Video, name: "TikTok", description: "Video ideas, hooks, scripts and UGC briefs." },
  { icon: CalendarDays, name: "Content", description: "A full content calendar, never a blank page." },
  { icon: Globe, name: "SEO", description: "Keywords, articles and product-page SEO." },
  { icon: Mail, name: "Email", description: "Welcome, cart recovery and lifecycle flows." },
  { icon: Gauge, name: "Store Optimization", description: "Audit and improve UX and conversion." },
  { icon: UsersRound, name: "Competitor Analysis", description: "Understand the gap you can win in." },
  { icon: UserSearch, name: "Customer Research", description: "Pains, desires and your customer's language." },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Every workflow your e-commerce business needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            Twelve modules, personalized to your product, your customer and your channels.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.name} className="rounded-xl border border-border p-5 hover:border-primary/40 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-3">
                <f.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-1">{f.name}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
