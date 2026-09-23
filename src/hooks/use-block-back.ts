import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/** Neutralise le bouton retour Android pendant les phases secrètes (assign, vote, reveal). */
export function useBlockBack() {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);
}
