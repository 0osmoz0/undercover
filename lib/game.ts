export type Role = 'civilian' | 'undercover';

export type WordPair = {
  civilian: string;
  undercover: string;
};

export type Player = {
  id: string;
  name: string;
  role: Role;
  word: string;
  eliminated: boolean;
};

export type Winner = 'civilians' | 'undercover' | null;

export type GamePhase =
  | 'setup'
  | 'assign'
  | 'discuss'
  | 'vote'
  | 'reveal'
  | 'ended';

export type GameState = {
  players: Player[];
  wordPair: WordPair;
  phase: GamePhase;
  assignIndex: number;
  votes: Record<string, string>;
  lastEliminatedId: string | null;
  winner: Winner;
  round: number;
};

export function suggestedUndercoverCount(playerCount: number): number {
  if (playerCount < 3) return 0;
  if (playerCount <= 6) return 1;
  return 2;
}

export function pickWordPair(pairs: WordPair[]): WordPair {
  if (pairs.length === 0) {
    throw new Error('Aucune paire de mots disponible');
  }
  const index = Math.floor(Math.random() * pairs.length);
  return pairs[index];
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createPlayers(
  names: string[],
  undercoverCount: number,
  wordPair: WordPair,
): Player[] {
  if (names.length < 3) {
    throw new Error('Il faut au moins 3 joueurs');
  }
  if (undercoverCount < 1 || undercoverCount >= names.length) {
    throw new Error('Nombre d undercover invalide');
  }

  const trimmed = names.map((name) => name.trim()).filter(Boolean);
  if (trimmed.length !== names.length) {
    throw new Error('Tous les joueurs doivent avoir un nom');
  }

  const unique = new Set(trimmed.map((n) => n.toLowerCase()));
  if (unique.size !== trimmed.length) {
    throw new Error('Les noms doivent etre uniques');
  }

  const roles: Role[] = [
    ...Array(undercoverCount).fill('undercover' as Role),
    ...Array(trimmed.length - undercoverCount).fill('civilian' as Role),
  ];
  const shuffledRoles = shuffle(roles);

  return trimmed.map((name, index) => {
    const role = shuffledRoles[index];
    return {
      id: `player-${index}`,
      name,
      role,
      word: role === 'undercover' ? wordPair.undercover : wordPair.civilian,
      eliminated: false,
    };
  });
}

export function createGame(
  names: string[],
  undercoverCount: number,
  pairs: WordPair[],
): GameState {
  const wordPair = pickWordPair(pairs);
  const players = createPlayers(names, undercoverCount, wordPair);

  return {
    players,
    wordPair,
    phase: 'assign',
    assignIndex: 0,
    votes: {},
    lastEliminatedId: null,
    winner: null,
    round: 1,
  };
}

export function alivePlayers(players: Player[]): Player[] {
  return players.filter((p) => !p.eliminated);
}

export function countAliveByRole(
  players: Player[],
  role: Role,
): number {
  return alivePlayers(players).filter((p) => p.role === role).length;
}

export function checkWinner(players: Player[]): Winner {
  const undercoverAlive = countAliveByRole(players, 'undercover');
  const civiliansAlive = countAliveByRole(players, 'civilian');

  if (undercoverAlive === 0) return 'civilians';
  if (undercoverAlive >= civiliansAlive) return 'undercover';
  return null;
}

export function tallyVotes(
  votes: Record<string, string>,
): { targetId: string | null; tied: boolean } {
  const counts = new Map<string, number>();

  Object.values(votes).forEach((targetId) => {
    counts.set(targetId, (counts.get(targetId) ?? 0) + 1);
  });

  let max = 0;
  let leaders: string[] = [];

  counts.forEach((count, targetId) => {
    if (count > max) {
      max = count;
      leaders = [targetId];
    } else if (count === max) {
      leaders.push(targetId);
    }
  });

  if (leaders.length !== 1 || max === 0) {
    return { targetId: null, tied: leaders.length > 1 };
  }

  return { targetId: leaders[0], tied: false };
}

export function eliminatePlayer(
  state: GameState,
  playerId: string,
): GameState {
  const players = state.players.map((player) =>
    player.id === playerId ? { ...player, eliminated: true } : player,
  );
  const winner = checkWinner(players);

  return {
    ...state,
    players,
    lastEliminatedId: playerId,
    winner,
    phase: winner ? 'ended' : 'reveal',
    votes: {},
  };
}

export function resolveVote(state: GameState): GameState {
  const { targetId, tied } = tallyVotes(state.votes);

  if (tied || !targetId) {
    return {
      ...state,
      phase: 'reveal',
      lastEliminatedId: null,
      votes: {},
    };
  }

  return eliminatePlayer(state, targetId);
}

export function nextRound(state: GameState): GameState {
  if (state.winner) {
    return { ...state, phase: 'ended' };
  }

  return {
    ...state,
    phase: 'discuss',
    round: state.round + 1,
    lastEliminatedId: null,
    votes: {},
  };
}

export function castVote(
  state: GameState,
  voterId: string,
  targetId: string,
): GameState {
  const voter = state.players.find((p) => p.id === voterId);
  const target = state.players.find((p) => p.id === targetId);

  if (!voter || voter.eliminated) {
    throw new Error('Votant invalide');
  }
  if (!target || target.eliminated) {
    throw new Error('Cible invalide');
  }
  if (voterId === targetId) {
    throw new Error('Impossible de voter pour soi-meme');
  }

  return {
    ...state,
    votes: {
      ...state.votes,
      [voterId]: targetId,
    },
  };
}

export function allAliveHaveVoted(state: GameState): boolean {
  const alive = alivePlayers(state.players);
  return alive.every((player) => Boolean(state.votes[player.id]));
}
