// Status antarmuka sementara (tidak disimpan): lembar pengalih anak.
import { useSyncExternalStore } from 'react';

let terbuka = false;
const pendengar = new Set();
const langganan = (f) => {
  pendengar.add(f);
  return () => pendengar.delete(f);
};

export function aturPengalih(v) {
  terbuka = v;
  pendengar.forEach((f) => f());
}

export function usePengalih() {
  return useSyncExternalStore(langganan, () => terbuka, () => false);
}
