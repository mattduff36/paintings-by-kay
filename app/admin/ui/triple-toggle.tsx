"use client";
import React from 'react';

export type StatusValue = 'unlisted' | 'for_sale' | 'sold';

interface TripleToggleProps {
  value: StatusValue;
  onChange: (next: StatusValue) => void;
  disabled?: boolean;
}

export function TripleToggle({ value, onChange, disabled }: TripleToggleProps) {
  function handleClick(next: StatusValue) {
    if (disabled) return;
    onChange(next);
  }

  return (
    <div className={`triple-toggle ${disabled ? 'is-disabled' : ''}`} role="tablist" aria-label="Status">
      <button
        type="button"
        className={`triple-segment seg-unlisted ${value === 'unlisted' ? 'is-active' : ''}`}
        onClick={() => handleClick('unlisted')}
        aria-pressed={value === 'unlisted'}
      >
        Unlisted
      </button>
      <button
        type="button"
        className={`triple-segment seg-for-sale ${value === 'for_sale' ? 'is-active' : ''}`}
        onClick={() => handleClick('for_sale')}
        aria-pressed={value === 'for_sale'}
      >
        For sale
      </button>
      <button
        type="button"
        className={`triple-segment seg-sold ${value === 'sold' ? 'is-active' : ''}`}
        onClick={() => handleClick('sold')}
        aria-pressed={value === 'sold'}
      >
        Sold
      </button>
    </div>
  );
}


