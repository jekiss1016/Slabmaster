import React from 'react';

/**
 * ISO/IEC 15417 Code 128 Symbol Patterns (0 - 106)
 * Each pattern represents alternating widths of Bars and Spaces.
 * Symbols 0-105 have 6 elements (3 bars, 3 spaces) summing to 11 modules.
 * Stop symbol 106 has 7 elements (4 bars, 3 spaces) summing to 13 modules.
 */
export const CODE128_PATTERNS: readonly string[] = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112'
];

export const START_CODE_B = 104;
export const STOP_CODE = 106;
export const QUIET_ZONE_MODULES = 10;

export interface EncodedBar {
  x: number;
  width: number;
}

export interface EncodedBarcode {
  symbols: number[];
  checkDigit: number;
  totalModules: number;
  bars: EncodedBar[];
}

/**
 * Encodes an ASCII string into Code 128 (Subset B) bar widths and positions.
 */
export function encodeCode128B(text: string): EncodedBarcode {
  const safeText = text || ' ';
  const symbols: number[] = [START_CODE_B];
  let checkSum = START_CODE_B;

  for (let i = 0; i < safeText.length; i++) {
    const charCode = safeText.charCodeAt(i);
    // Code 128 Subset B covers ASCII 32 (' ') to 126 ('~')
    const symbolCode = (charCode >= 32 && charCode <= 126) ? charCode - 32 : 0;
    symbols.push(symbolCode);
    checkSum += (i + 1) * symbolCode;
  }

  const checkDigit = checkSum % 103;
  symbols.push(checkDigit);
  symbols.push(STOP_CODE);

  // Compute bar coordinates (in module units)
  const bars: EncodedBar[] = [];
  let currentModule = QUIET_ZONE_MODULES;

  for (const sym of symbols) {
    const pattern = CODE128_PATTERNS[sym];
    if (!pattern) continue;

    for (let pIdx = 0; pIdx < pattern.length; pIdx++) {
      const width = parseInt(pattern[pIdx], 10);
      const isBar = pIdx % 2 === 0; // Even indices are bars, odd are spaces

      if (isBar) {
        bars.push({
          x: currentModule,
          width
        });
      }
      currentModule += width;
    }
  }

  currentModule += QUIET_ZONE_MODULES; // Trailing quiet zone

  return {
    symbols,
    checkDigit,
    totalModules: currentModule,
    bars
  };
}

export interface Code128BarcodeProps {
  value: string;
  height?: number;
  moduleWidth?: number;
  showText?: boolean;
  className?: string;
}

/**
 * High-Resolution Vector SVG Code 128 Barcode.
 * Renders 100% optically scannable barcodes with compliant quiet zones,
 * modulo-103 checksum, and maximum contrast for Zebra scanners & thermal label printers.
 */
export const Code128Barcode: React.FC<Code128BarcodeProps> = ({
  value,
  height = 54,
  moduleWidth = 2,
  showText = true,
  className = ''
}) => {
  const encoded = encodeCode128B(value);
  const svgWidth = encoded.totalModules * moduleWidth;
  const barHeight = height;
  const totalSvgHeight = showText ? barHeight + 18 : barHeight;

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={svgWidth}
        height={totalSvgHeight}
        viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className="block bg-white"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Background Quiet Zone (pure white for 100% optical reflectance) */}
        <rect width={svgWidth} height={totalSvgHeight} fill="#FFFFFF" />

        {/* Black Code 128 Bar Modules */}
        {encoded.bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x * moduleWidth}
            y={0}
            width={bar.width * moduleWidth}
            height={barHeight}
            fill="#000000"
          />
        ))}

        {/* Human-Readable Text */}
        {showText && (
          <text
            x={svgWidth / 2}
            y={barHeight + 13}
            textAnchor="middle"
            fill="#000000"
            fontFamily="monospace"
            fontSize="11"
            fontWeight="bold"
            letterSpacing="1px"
          >
            {value}
          </text>
        )}
      </svg>
    </div>
  );
};
