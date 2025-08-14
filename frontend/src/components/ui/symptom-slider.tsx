import { cn, getSymptomSeverityText, getSymptomSeverityColor } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface SymptomSliderProps {
  name: string;
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function SymptomSlider({ name, value, onChange, disabled = false }: SymptomSliderProps) {
  const handleChange = (newValue: number[]) => {
    if (onChange) {
      onChange(newValue[0]);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between mb-1">
        <label className="text-sm">{name}</label>
        <span className={cn("text-sm font-medium", getSymptomSeverityColor(value))}>
          {getSymptomSeverityText(value)}
        </span>
      </div>
      
      <div className="relative">
        <Slider
          defaultValue={[value]}
          max={6}
          step={1}
          disabled={disabled}
          onValueChange={handleChange}
          className={cn(
            "h-2 rounded cursor-pointer appearance-none",
            "bg-gradient-to-r from-status-green via-status-yellow to-status-red",
            disabled && "opacity-70 cursor-not-allowed"
          )}
        />
      </div>
    </div>
  );
}
