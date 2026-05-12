import React from 'react';
import { cn } from '../lib/utils';

interface ToggleRowProps {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({ label, description, active, onToggle }) => {
  return (
    <div 
      className="p-6 flex justify-between items-center cursor-pointer select-none active:bg-surface-container transition-colors"
      onClick={onToggle}
    >
      <div className="space-y-1">
        <h3 className="font-body font-bold text-[18px] leading-tight">{label}</h3>
        <p className="font-body text-[14px] text-on-surface-variant opacity-70">{description}</p>
      </div>
      
      <div className={cn(
        "w-12 h-6 rounded-full relative p-1 transition-colors border-[1.5px] border-primary",
        active ? "bg-primary" : "bg-surface"
      )}>
        <div className={cn(
          "absolute top-1 w-3.5 h-3.5 rounded-full transition-all",
          active ? "right-1 bg-surface" : "left-1 bg-primary"
        )} />
      </div>
    </div>
  );
};
