import React from 'react';
import { cn } from '../lib/utils';

interface ModeChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export const ModeChip: React.FC<ModeChipProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 border-[1.5px] border-primary px-6 py-2 rounded-lg font-mono text-[13px] uppercase transition-all active:scale-95",
        active 
          ? "bg-secondary-fixed font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
          : "bg-surface hover:bg-surface-container"
      )}
    >
      {label}
    </button>
  );
};
