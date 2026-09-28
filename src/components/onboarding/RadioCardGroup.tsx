import { cn } from "@/lib/utils";
import type { Option } from "@/config/questionnaire";

interface RadioCardGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3;
}

export function RadioCardGroup({ options, value, onChange, columns = 2 }: RadioCardGroupProps) {
  return (
    <div className={cn("grid gap-3", columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2")}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-lg border px-4 py-3 text-sm text-left font-medium transition-colors",
            value === option.value
              ? "border-primary bg-accent text-accent-foreground"
              : "border-border hover:bg-muted/50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
