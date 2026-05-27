// components/assignments/QuestionTypeRow.tsx
'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { QuestionTypeRowConfig, QuestionTypeSelection } from '@/types';
import { CounterInput } from '../ui/CounterInput';
import { Input } from '../ui/custom-ui';

interface QuestionTypeRowProps {
  row: QuestionTypeRowConfig;
  onChange: (id: string, updatedFields: Partial<QuestionTypeRowConfig>) => void;
  onRemove: (id: string) => void;
}

export function QuestionTypeRow({ row, onChange, onRemove }: QuestionTypeRowProps) {
  return (
    <div className="relative w-full bg-white lg:bg-transparent rounded-2xl lg:rounded-none border border-neutral-200/50 lg:border-0 p-4 lg:p-0 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-3 select-none">
      
      {/* 1. Category Input field (Desktop & Mobile) */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="e.g. Multiple Choice Questions"
            value={row.type}
            onChange={(e) => onChange(row.id, { type: e.target.value })}
            className="w-full text-xs font-semibold text-neutral-700 bg-neutral-50/50 border-neutral-200 h-10 rounded-xl shadow-none"
            required
          />
        </div>

        {/* Remove Button for Mobile View (Placed next to dropdown) */}
        <button
          type="button"
          onClick={() => onRemove(row.id)}
          className="lg:hidden w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all cursor-pointer shrink-0"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Remove Button for Desktop View (Hidden on mobile) */}
      <button
        type="button"
        onClick={() => onRemove(row.id)}
        className="hidden lg:flex w-8 h-8 rounded-full border border-neutral-200 items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all cursor-pointer shrink-0"
      >
        <X size={14} strokeWidth={2.5} />
      </button>

      {/* 2. Counter Steppers Container */}
      <div className="flex items-center justify-between gap-4 lg:gap-6 pt-3 lg:pt-0 border-t border-neutral-100 lg:border-0">
        
        {/* No. of Questions Stepper */}
        <div className="flex flex-1 lg:flex-none flex-col lg:flex-row items-start lg:items-center gap-1.5 lg:gap-3">
          <span className="text-[10px] lg:hidden font-bold text-neutral-400 uppercase tracking-wide">
            No. of Questions
          </span>
          <CounterInput
            value={row.noOfQuestions}
            onChange={(val) => onChange(row.id, { noOfQuestions: val })}
            min={1}
            max={50}
          />
        </div>

        {/* Marks Stepper */}
        <div className="flex flex-1 lg:flex-none flex-col lg:flex-row items-start lg:items-center gap-1.5 lg:gap-3">
          <span className="text-[10px] lg:hidden font-bold text-neutral-400 uppercase tracking-wide">
            Marks
          </span>
          <CounterInput
            value={row.marks}
            onChange={(val) => onChange(row.id, { marks: val })}
            min={1}
            max={100}
          />
        </div>
        
      </div>
    </div>
  );
}
export default QuestionTypeRow;
