import React from 'react';

/**
 * Simple dropdown component used throughout the app.
 * Props:
 *  - label: string – optional label displayed above the select.
 *  - options: Array<{ value: string, label: string }> – list of options.
 *  - value: string – currently selected value.
 *  - onChange: (value: string) => void – callback when selection changes.
 */
export default function Dropdown({ label, name, options = [], value, onChange }) {
  const handleChange = (e) => {
    // Forward the full event to support callers that expect an event (e.g. handleChange)
    if (onChange) onChange(e)
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-ink-700 dark:text-ink-100">{label}</label>}
      <select
        className="rounded border border-ink-200 dark:border-ink-600 bg-paper dark:bg-ink-800 px-3 py-2 text-ink-800 dark:text-ink-100"
        name={name}
        value={value}
        onChange={handleChange}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
