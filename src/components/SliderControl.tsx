import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  badge?: string;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  badge,
  onChange,
  minLabel,
  maxLabel
}) => {
  return (
    <div className="border-[1.5px] border-primary p-6 rounded-lg bg-surface flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-mono text-[10px] font-bold text-on-surface-variant tracking-[2px] uppercase">■ {label}</h2>
        {badge && (
          <span className="bg-secondary-fixed text-primary font-mono text-[10px] px-2 py-0.5 rounded-full border-[1px] border-primary font-extrabold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {badge}
          </span>
        )}
      </div>
      
      <div className="relative h-6 flex items-center group cursor-pointer">
        {/* Track */}
        <div className="absolute w-full h-[2px] bg-primary opacity-20" />
        <div 
          className="absolute h-[2px] bg-primary" 
          style={{ width: `${((value - min) / (max - min)) * 100}%` }} 
        />
        
        {/* Simple range input styled to be invisible but functional */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {/* Custom Thumb */}
        <div 
          className="absolute w-4 h-4 bg-primary pointer-events-none transition-transform group-active:scale-125"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}
        />
      </div>

      {(minLabel || maxLabel) && (
        <div className="flex justify-between font-mono text-[10px] opacity-50 uppercase font-bold">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
};
