import React from 'react';
import { cn } from '../lib/utils';

interface DurationPickerProps {
  options: { label: string; value: number }[];
  selectedValue: number;
  onSelect: (value: number) => void;
}

export const DurationPicker: React.FC<DurationPickerProps> = ({ options, selectedValue, onSelect }) => {
  return (
    <div className="flex border-[1.5px] border-primary w-full divide-x-[1.5px] divide-primary overflow-hidden">
      {options.map((option) => (
        <button
          key={option.label}
          onClick={() => onSelect(option.value)}
          className={cn(
            "flex-1 py-4 font-mono text-[13px] uppercase transition-colors",
            selectedValue === option.value
              ? "bg-primary text-surface"
              : "bg-surface text-primary active:bg-primary active:text-surface"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
