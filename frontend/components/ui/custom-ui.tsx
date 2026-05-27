// components/ui/custom-ui.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          // Variants
          variant === 'primary' && 'bg-black text-white hover:bg-neutral-800 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
          variant === 'secondary' && 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 rounded-full',
          variant === 'outline' && 'border-2 border-neutral-200 text-neutral-800 hover:bg-neutral-50 rounded-full',
          variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600 rounded-full shadow-[0_4px_12px_rgba(239,68,68,0.2)]',
          variant === 'ghost' && 'text-neutral-600 hover:bg-neutral-100 rounded-xl',
          // Sizes
          size === 'sm' && 'px-4 py-1.5 text-xs',
          size === 'md' && 'px-6 py-2.5 text-sm',
          size === 'lg' && 'px-8 py-3 text-base',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && <div className="absolute left-4 text-neutral-400 pointer-events-none">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            'w-full bg-white text-neutral-800 placeholder-neutral-400 text-sm rounded-xl border border-neutral-200 py-2.5 px-4 transition-all duration-200 focus:outline-none focus:border-[#FF6A2B] focus:ring-1 focus:ring-[#FF6A2B]',
            icon && 'pl-11',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            'w-full bg-white text-neutral-800 text-sm rounded-xl border border-neutral-200 py-2.5 px-4 pr-10 appearance-none transition-all duration-200 focus:outline-none focus:border-[#FF6A2B] focus:ring-1 focus:ring-[#FF6A2B]',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';
