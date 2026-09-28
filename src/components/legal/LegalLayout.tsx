import { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AlertTriangle } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  children: ReactNode;
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <MainLayout>
      <div className="container-page max-w-3xl py-16">
        <h1 className="font-display text-3xl font-extrabold tracking-tight mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: placeholder — update before launch.</p>
        <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-4 text-sm mb-10">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
          <span>
            This page is a placeholder structure, not final legal text. Have it reviewed by a lawyer before you rely
            on it.
          </span>
        </div>
        <div className="prose prose-sm max-w-none dark:prose-invert space-y-6">{children}</div>
      </div>
    </MainLayout>
  );
}
