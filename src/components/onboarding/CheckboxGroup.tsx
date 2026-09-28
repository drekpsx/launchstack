import { Checkbox } from "@/components/ui/checkbox";
import type { Option } from "@/config/questionnaire";

interface CheckboxGroupProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function CheckboxGroup({ options, value, onChange }: CheckboxGroupProps) {
  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
        >
          <Checkbox checked={value.includes(option.value)} onCheckedChange={() => toggle(option.value)} />
          {option.label}
        </label>
      ))}
    </div>
  );
}
