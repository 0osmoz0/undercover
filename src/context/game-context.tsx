import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  createGame,
  eliminatePlayer,
  nextRound,
  resolveMrWhiteGuess,
  suggestedMrWhiteCount,
  suggestedUndercoverCount,
  type GamePhase,
  type GameState,
  type Player,
  type Winner,
} from '../../lib/game';
import { getThemeById, THEMES, type ThemeDef } from '../../lib/themes';

type GameContextValue = {
  game: GameState | null;
  phase: GamePhase;
  players: Player[];
  winner: Winner;
  selectedThemeId: string | null;
  selectedTheme: ThemeDef | null;
  themes: ThemeDef[];
  setSelectedThemeId: (id: string) => void;
  startGame: (
    names: string[],
    undercoverCount?: number,
    mrWhiteCount?: number,
  ) => void;
  revealWordForCurrent: () => void;
  hideWordAndAdvance: () => void;
  startDiscussion: () => void;
  startEliminate: () => void;
  eliminatePlayerById: (playerId: string) => GameState | null;
  submitMrWhiteGuess: (guess: string) => void;
  continueAfterReveal: () => void;
  resetGame: () => void;
  suggestedUndercoverCount: (count: number) => number;
  suggestedMrWhiteCount: (count: number) => number;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameState | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const selectedTheme = useMemo(
    () => (selectedThemeId ? getThemeById(selectedThemeId) ?? null : null),
    [selectedThemeId],
  );

  const startGame = useCallback(
    (names: string[], undercoverCount?: number, mrWhiteCount?: number) => {
      const theme = selectedThemeId ? getThemeById(selectedThemeId) : undefined;
      if (!theme || theme.pairs.length === 0) {
        throw new Error('Choisis un theme avant de lancer la partie');
      }
      const uc =
        undercoverCount ?? suggestedUndercoverCount(names.length);
      const mw = mrWhiteCount ?? suggestedMrWhiteCount(names.length);
      const next = createGame(names, uc, theme.pairs, mw, {
        id: theme.id,
        title: theme.title,
      });
      setGame(next);
    },
    [selectedThemeId],
  );

  const revealWordForCurrent = useCallback(() => {
    setGame((prev) => (prev ? { ...prev, phase: 'assign' } : prev));
  }, []);

  const hideWordAndAdvance = useCallback(() => {
    setGame((prev) => {
      if (!prev) return prev;
      const nextIndex = prev.assignIndex + 1;
      if (nextIndex >= prev.players.length) {
        return { ...prev, assignIndex: nextIndex, phase: 'discuss' };
      }
      return { ...prev, assignIndex: nextIndex };
    });
  }, []);

  const startDiscussion = useCallback(() => {
    setGame((prev) => (prev ? { ...prev, phase: 'discuss' } : prev));
  }, []);

  const startEliminate = useCallback(() => {
    setGame((prev) =>
      prev ? { ...prev, phase: 'vote', votes: {} } : prev,
    );
  }, []);

  const eliminatePlayerById = useCallback((playerId: string) => {
    let next: GameState | null = null;
    setGame((prev) => {
      if (!prev) return prev;
      if (prev.phase !== 'vote' && prev.phase !== 'discuss') return prev;
      next = eliminatePlayer(prev, playerId);
      return next;
    });
    return next;
  }, []);

  const submitMrWhiteGuess = useCallback((guess: string) => {
    setGame((prev) => {
      if (!prev || prev.phase !== 'guess') return prev;
      return resolveMrWhiteGuess(prev, guess);
    });
  }, []);

  const continueAfterReveal = useCallback(() => {
    setGame((prev) => {
      if (!prev) return prev;
      if (prev.winner) {
        return { ...prev, phase: 'ended' };
      }
      return nextRound(prev);
    });
  }, []);

  const resetGame = useCallback(() => {
    setGame(null);
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      game,
      phase: game?.phase ?? 'setup',
      players: game?.players ?? [],
      winner: game?.winner ?? null,
      selectedThemeId,
      selectedTheme,
      themes: THEMES,
      setSelectedThemeId,
      startGame,
      revealWordForCurrent,
      hideWordAndAdvance,
      startDiscussion,
      startEliminate,
      eliminatePlayerById,
      submitMrWhiteGuess,
      continueAfterReveal,
      resetGame,
      suggestedUndercoverCount,
      suggestedMrWhiteCount,
    }),
    [
      game,
      selectedThemeId,
      selectedTheme,
      startGame,
      revealWordForCurrent,
      hideWordAndAdvance,
      startDiscussion,
      startEliminate,
      eliminatePlayerById,
      submitMrWhiteGuess,
      continueAfterReveal,
      resetGame,
    ],
  );

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame doit etre utilise dans GameProvider');
  }
  return ctx;
}
