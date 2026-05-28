'use client';

import { Minus, Plus } from 'lucide-react';

interface CounterInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function CounterInput({ value, onChange, min = 1, max = 99 }: CounterInputProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="inline-flex items-center bg-neutral-50 border border-neutral-200 rounded-full p-1 gap-2">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white cursor-pointer active:scale-95 transition-all"
      >
        <Minus size={12} strokeWidth={2.5} />
      </button>
      
      <span className="w-8 text-center text-sm font-semibold text-neutral-800 select-none">
        {value}
      </span>
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white cursor-pointer active:scale-95 transition-all"
      >
        <Plus size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}
