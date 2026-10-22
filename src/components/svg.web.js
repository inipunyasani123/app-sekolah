// Di web, SVG dirender langsung sebagai elemen DOM (tanpa react-native-svg) agar bundle ringan.
import { createElement } from 'react';

const WARNA = ['fill', 'stroke', 'stopColor'];

function rapikan(props) {
  const { style, ...p } = props;
  let gaya = style;
  WARNA.forEach((k) => {
    if (typeof p[k] === 'string' && p[k].startsWith('var(')) {
      gaya = { ...(gaya || {}), [k]: p[k] };
      delete p[k];
    }
  });
  if (p.stopColor) {
    p['stop-color'] = p.stopColor;
    delete p.stopColor;
  }
  return gaya ? { ...p, style: gaya } : p;
}

const buat = (tag) => {
  const El = ({ children, ...p }) => createElement(tag, rapikan(p), children);
  El.displayName = tag;
  return El;
};

export function Svg({ children, accessibilityLabel, style, ...p }) {
  const a11y = accessibilityLabel ? { role: 'img', 'aria-label': accessibilityLabel } : { 'aria-hidden': true, focusable: 'false' };
  return createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', ...a11y, style: { display: 'block', flexShrink: 0, ...(style || {}) }, ...p }, children);
}

export const Path = buat('path');
export const Circle = buat('circle');
export const Rect = buat('rect');
export const G = buat('g');
export const Line = buat('line');
export const Polyline = buat('polyline');
export const Polygon = buat('polygon');
export const Ellipse = buat('ellipse');
export const Defs = buat('defs');
export const ClipPath = buat('clipPath');
export const LinearGradient = buat('linearGradient');
export const Stop = buat('stop');
export const SvgText = buat('text');
