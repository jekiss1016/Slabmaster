import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import {
  encodeCode128B,
  Code128Barcode,
  CODE128_PATTERNS,
  START_CODE_B,
  STOP_CODE,
  QUIET_ZONE_MODULES
} from '../components/Code128Barcode';

describe('Code 128 (ISO/IEC 15417) Barcode Generator', () => {
  it('contains valid patterns for all 107 symbols', () => {
    expect(CODE128_PATTERNS.length).toBe(107);
    // Symbols 0-105 are 11 modules
    for (let i = 0; i <= 105; i++) {
      const sum = CODE128_PATTERNS[i].split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
      expect(sum).toBe(11);
    }
    // Stop symbol 106 is 13 modules
    const stopSum = CODE128_PATTERNS[106].split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
    expect(stopSum).toBe(13);
  });

  it('correctly encodes test serial "CG-88201" with verified checksum', () => {
    const encoded = encodeCode128B('CG-88201');
    expect(encoded.symbols[0]).toBe(START_CODE_B); // 104
    expect(encoded.symbols[encoded.symbols.length - 1]).toBe(STOP_CODE); // 106
    expect(encoded.checkDigit).toBe(4); // Verified modulo 103 checksum
    expect(encoded.symbols).toEqual([104, 35, 39, 13, 24, 24, 18, 16, 17, 4, 106]);
  });

  it('correctly encodes remnant serial "REM-CG-88201-A"', () => {
    const encoded = encodeCode128B('REM-CG-88201-A');
    expect(encoded.symbols[0]).toBe(START_CODE_B);
    expect(encoded.symbols[encoded.symbols.length - 1]).toBe(STOP_CODE);
    expect(encoded.bars.length).toBeGreaterThan(20);
    // Quiet zones at both ends (2 * 10 modules = 20 modules)
    expect(encoded.totalModules).toBeGreaterThan(100);
  });

  it('renders a crisp SVG barcode with quiet zones and human-readable text', () => {
    const { container } = render(React.createElement(Code128Barcode, { value: 'CG-88201' }));
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    const rects = container.querySelectorAll('rect');
    // 1 background rect + multiple bar rects
    expect(rects.length).toBeGreaterThan(15);

    const text = container.querySelector('text');
    expect(text).toBeTruthy();
    expect(text?.textContent).toBe('CG-88201');
  });

  it('supports hiding human-readable text when requested', () => {
    const { container } = render(
      React.createElement(Code128Barcode, { value: 'QZ-99402', showText: false })
    );
    const text = container.querySelector('text');
    expect(text).toBeNull();
  });
});
