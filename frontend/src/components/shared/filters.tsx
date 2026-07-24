'use client';

import { useCallback, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { indianCities } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export interface FilterValues {
  cities: string[];
  remote: boolean;
  experience: string[];
}

interface FilterSidebarProps {
  values?: Partial<FilterValues>;
  onChange?: (values: FilterValues) => void;
  className?: string;
  showMobileToggle?: boolean;
}

const experienceOptions = [
  { value: 'fresher', label: 'Fresher (0 yrs)' },
  { value: '0-1', label: '0–1 years' },
  { value: '1-3', label: '1–3 years' },
  { value: '3+', label: '3+ years' },
];

const defaultValues: FilterValues = {
  cities: [],
  remote: false,
  experience: [],
};

function CheckboxItem({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
      <Label htmlFor={id} className="cursor-pointer font-normal text-foreground">
        {label}
      </Label>
    </div>
  );
}

export function FilterSidebar({
  values: controlledValues,
  onChange,
  className,
  showMobileToggle = true,
}: FilterSidebarProps) {
  const [internal, setInternal] = useState<FilterValues>({
    ...defaultValues,
    ...controlledValues,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const values = controlledValues
    ? { ...defaultValues, ...controlledValues }
    : internal;

  const update = useCallback(
    (next: FilterValues) => {
      if (!controlledValues) setInternal(next);
      onChange?.(next);
    },
    [controlledValues, onChange]
  );

  function toggleCity(city: string, checked: boolean) {
    const cities = checked
      ? [...values.cities, city]
      : values.cities.filter((c) => c !== city);
    update({ ...values, cities });
  }

  function toggleExperience(exp: string, checked: boolean) {
    const experience = checked
      ? [...values.experience, exp]
      : values.experience.filter((e) => e !== exp);
    update({ ...values, experience });
  }

  function clearAll() {
    update(defaultValues);
  }

  const activeCount =
    values.cities.length +
    values.experience.length +
    (values.remote ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-xs">
            Clear all
          </Button>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Work mode</h3>
        <CheckboxItem
          id="filter-remote"
          label="Remote only"
          checked={values.remote}
          onChange={(checked) => update({ ...values, remote: checked })}
        />
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium">Experience</h3>
        <div className="space-y-2.5">
          {experienceOptions.map((opt) => (
            <CheckboxItem
              key={opt.value}
              id={`exp-${opt.value}`}
              label={opt.label}
              checked={values.experience.includes(opt.value)}
              onChange={(checked) => toggleExperience(opt.value, checked)}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium">City</h3>
        <div className="max-h-48 space-y-2.5 overflow-y-auto pr-1">
          {indianCities.map((city) => (
            <CheckboxItem
              key={city}
              id={`city-${city}`}
              label={city}
              checked={values.cities.includes(city)}
              onChange={(checked) => toggleCity(city, checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showMobileToggle && (
        <div className="mb-4 lg:hidden">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </span>
            {mobileOpen ? <X className="h-4 w-4" /> : null}
          </Button>
          {mobileOpen && (
            <div className="mt-3 rounded-lg border bg-card p-4 shadow-sm">
              {filterContent}
            </div>
          )}
        </div>
      )}

      <aside
        className={cn(
          'hidden w-full shrink-0 rounded-lg border bg-card p-5 shadow-sm lg:block lg:w-64',
          className
        )}
      >
        {filterContent}
      </aside>
    </>
  );
}
