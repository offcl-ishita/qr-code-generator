// src/utils/qrHelpers.js

export const hexToRgb = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return [r, g, b];
};

export const luminance = (r, g, b) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrastWarning = (fg, bg) => {
  const [fR, fG, fB] = hexToRgb(fg);
  const [bR, bG, bB] = hexToRgb(bg);
  const lumFg = luminance(fR, fG, fB);
  const lumBg = luminance(bR, bG, bB);
  
  const lightest = Math.max(lumFg, lumBg);
  const darkest = Math.min(lumFg, lumBg);
  const contrast = (lightest + 0.05) / (darkest + 0.05);

  if (lumFg > lumBg) {
    return "Inverted colors (light QR on dark background) may not be scannable by all devices.";
  }
  if (contrast < 3.0) {
    return "Low contrast detected. This QR code might be difficult to scan.";
  }
  return null;
};