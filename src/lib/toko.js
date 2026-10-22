// Penyimpanan di perangkat (AsyncStorage; di web = localStorage). Tanpa server.
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const KUNCI = 'kapur:v1';

const AWAL = {
  anak: 'nayla',
  tema: 'otomatis',
  izin: [],
  tugasCek: {},
  bayar: {},
  pesan: {},
  dibaca: {},
  paraf: {},
  rsvp: {},
};

let state = AWAL;
let siap = false;
let mulai = false;
const pendengar = new Set();

function kabari() {
  pendengar.forEach((f) => f());
}

function langganan(f) {
  pendengar.add(f);
  return () => pendengar.delete(f);
}

export function muatToko() {
  if (mulai) return;
  mulai = true;
  Promise.resolve()
    .then(() => AsyncStorage.getItem(KUNCI))
    .then((v) => {
      if (v) {
        const data = JSON.parse(v);
        if (data && typeof data === 'object') state = { ...AWAL, ...data };
      }
    })
    .catch(() => {})
    .finally(() => {
      siap = true;
      kabari();
    });
}

export function ubah(fn) {
  state = fn(state);
  kabari();
  try {
    AsyncStorage.setItem(KUNCI, JSON.stringify(state)).catch(() => {});
  } catch {
    // Penyimpanan diblokir (mode privat): data tetap jalan di memori.
  }
}

export function aturUlang() {
  ubah(() => ({ ...AWAL, tema: state.tema }));
}

export function useToko() {
  return useSyncExternalStore(langganan, () => state, () => AWAL);
}

export function useSiap() {
  return useSyncExternalStore(langganan, () => siap, () => false);
}

// Jam bersama: berdetak tiap 30 detik setelah data siap.
let kini = 0;
let detak = null;
const pendengarJam = new Set();

function langgananJam(f) {
  pendengarJam.add(f);
  if (!detak) {
    detak = setInterval(() => {
      kini = Date.now();
      pendengarJam.forEach((g) => g());
    }, 30000);
  }
  return () => {
    pendengarJam.delete(f);
    if (!pendengarJam.size && detak) {
      clearInterval(detak);
      detak = null;
    }
  };
}

function ambilJam() {
  if (!kini) kini = Date.now();
  return kini;
}

/** Waktu sekarang (ms) atau null sebelum perangkat siap — data relatif hanya dirender di klien. */
export function useSekarang() {
  const s = useSiap();
  const ms = useSyncExternalStore(langgananJam, ambilJam, () => 0);
  return s ? ms : null;
}
