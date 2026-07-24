'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        ref={ref}
        checked={checked}
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.target.checked);
        }}
        {...props}
      />
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input bg-background ring-offset-background transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          checked && 'border-primary bg-primary text-primary-foreground',
          className
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
    </label>
  )
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
