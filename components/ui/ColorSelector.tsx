// components/ui/ColorSelector.tsx

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colorOptions, STYLES } from "@/constants/assetTypeConstants";

interface ColorSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function ColorSelector({ value, onValueChange, placeholder = "请选择", className }: ColorSelectorProps) {
  const selectedOption = colorOptions.find(opt => opt.value === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className || STYLES.select}>
        <SelectValue placeholder={placeholder}>
          <div className="flex items-center gap-3">
            <div
              className={`h-5 w-5 rounded-full bg-gradient-to-br ${value} shadow-md`}
            />
            <span className="text-sm text-gray-600">
              {selectedOption?.label || placeholder}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-white/30 bg-white/95 backdrop-blur-xl">
        {colorOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="p-3 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-5 w-5 rounded-full bg-gradient-to-br ${option.value} shadow-md`}
              />
              <span className="font-medium">{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { ColorSelector };
