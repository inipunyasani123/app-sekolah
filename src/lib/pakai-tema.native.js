import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { TERANG, GELAP } from './tema';
import { useToko } from './toko';

export function useGelap() {
  const sistem = useColorScheme();
  const { tema } = useToko();
  return tema === 'gelap' || (tema !== 'terang' && sistem === 'dark');
}

export function useWarna() {
  return useGelap() ? GELAP : TERANG;
}

export function buatGaya(fn) {
  const simpan = new Map();
  return function useGaya() {
    const c = useWarna();
    return useMemo(() => {
      if (!simpan.has(c)) simpan.set(c, fn(c));
      return simpan.get(c);
    }, [c]);
  };
}

export function terapkanTema() {}
