import {
  allAliveHaveVoted,
  castVote,
  checkWinner,
  createGame,
  createPlayers,
  eliminatePlayer,
  resolveMrWhiteGuess,
  resolveVote,
  suggestedMrWhiteCount,
  suggestedUndercoverCount,
  tallyVotes,
  type WordPair,
} from '../lib/game';

const pairs: WordPair[] = [
  { civilian: 'Pizza', undercover: 'Burger' },
  { civilian: 'Pomme', undercover: 'Poire' },
];

describe('suggestedUndercoverCount', () => {
  it('retourne 1 pour 4 a 6 joueurs', () => {
    expect(suggestedUndercoverCount(4)).toBe(1);
    expect(suggestedUndercoverCount(6)).toBe(1);
  });

  it('retourne 2 a partir de 7 joueurs', () => {
    expect(suggestedUndercoverCount(7)).toBe(2);
    expect(suggestedUndercoverCount(10)).toBe(2);
  });
});

describe('suggestedMrWhiteCount', () => {
  it('est 0 en dessous de 5 joueurs', () => {
    expect(suggestedMrWhiteCount(4)).toBe(0);
  });

  it('est 1 a partir de 5 joueurs', () => {
    expect(suggestedMrWhiteCount(5)).toBe(1);
    expect(suggestedMrWhiteCount(8)).toBe(1);
  });
});

describe('createPlayers', () => {
  it('assigne exactement 1 undercover pour 4 joueurs', () => {
    const players = createPlayers(
      ['Alice', 'Bob', 'Claire', 'Diane'],
      1,
      pairs[0],
    );
    const undercover = players.filter((p) => p.role === 'undercover');
    const civilians = players.filter((p) => p.role === 'civilian');

    expect(undercover).toHaveLength(1);
    expect(civilians).toHaveLength(3);
    expect(undercover[0].word).toBe('Burger');
    expect(civilians[0].word).toBe('Pizza');
  });

  it('assigne un Mister White sans mot', () => {
    const players = createPlayers(
      ['Alice', 'Bob', 'Claire', 'Diane', 'Eve'],
      1,
      pairs[0],
      1,
    );
    const white = players.filter((p) => p.role === 'mrWhite');
    expect(white).toHaveLength(1);
    expect(white[0].word).toBe('');
    expect(players.filter((p) => p.role === 'civilian')).toHaveLength(3);
  });

  it('refuse moins de 3 joueurs', () => {
    expect(() => createPlayers(['A', 'B'], 1, pairs[0])).toThrow();
  });
});

describe('createGame', () => {
  it('demarre en phase assign', () => {
    const game = createGame(
      ['Alice', 'Bob', 'Claire', 'Diane'],
      1,
      pairs,
      0,
      { id: 'classique', title: 'Classique' },
    );
    expect(game.phase).toBe('assign');
    expect(game.players).toHaveLength(4);
    expect(game.winner).toBeNull();
    expect(game.themeId).toBe('classique');
    expect(game.themeTitle).toBe('Classique');
  });
});

describe('checkWinner', () => {
  it('civils gagnent si plus d undercover ni Mister White', () => {
    const players = createPlayers(
      ['Alice', 'Bob', 'Claire', 'Diane'],
      1,
      pairs[0],
    );
    const undercover = players.find((p) => p.role === 'undercover')!;
    undercover.eliminated = true;
    expect(checkWinner(players)).toBe('civilians');
  });

  it('undercover gagnent a egalite ou majorite', () => {
    const players = createPlayers(
      ['Alice', 'Bob', 'Claire', 'Diane'],
      1,
      pairs[0],
    );
    const civilians = players.filter((p) => p.role === 'civilian');
    civilians[0].eliminated = true;
    civilians[1].eliminated = true;
    expect(checkWinner(players)).toBe('undercover');
  });

  it('Mister White gagne a 2 joueurs restants', () => {
    const players = createPlayers(
      ['Alice', 'Bob', 'Claire', 'Diane', 'Eve'],
      1,
      pairs[0],
      1,
    );
    players.forEach((p) => {
      if (p.role === 'civilian') p.eliminated = true;
    });
    // Il reste undercover + Mister White = 2
    expect(checkWinner(players)).toBe('mrWhite');
  });
});

describe('Mister White guess', () => {
  it('gagne s il trouve le mot civil', () => {
    let game = createGame(
      ['Alice', 'Bob', 'Claire', 'Diane', 'Eve'],
      1,
      pairs,
      1,
    );
    const white = game.players.find((p) => p.role === 'mrWhite')!;
    game = eliminatePlayer(game, white.id);
    expect(game.phase).toBe('guess');

    game = resolveMrWhiteGuess(game, game.wordPair.civilian);
    expect(game.winner).toBe('mrWhite');
    expect(game.mrWhiteGuessCorrect).toBe(true);
  });

  it('continue si la tentative echoue', () => {
    let game = createGame(
      ['Alice', 'Bob', 'Claire', 'Diane', 'Eve'],
      1,
      pairs,
      1,
    );
    const white = game.players.find((p) => p.role === 'mrWhite')!;
    game = eliminatePlayer(game, white.id);
    game = resolveMrWhiteGuess(game, 'MotInexistant');
    expect(game.mrWhiteGuessCorrect).toBe(false);
    expect(game.winner).toBeNull();
    expect(game.phase).toBe('reveal');
  });
});

describe('votes', () => {
  it('elimine le joueur le plus vote', () => {
    let game = createGame(
      ['Alice', 'Bob', 'Claire', 'Diane'],
      1,
      pairs,
    );
    const [a, b, c, d] = game.players;

    game = castVote(game, a.id, b.id);
    game = castVote(game, c.id, b.id);
    game = castVote(game, d.id, b.id);
    game = castVote(game, b.id, a.id);

    expect(allAliveHaveVoted(game)).toBe(true);

    game = resolveVote(game);
    expect(game.players.find((p) => p.id === b.id)?.eliminated).toBe(true);
    expect(game.lastEliminatedId).toBe(b.id);
  });

  it('gere egalite sans elimination', () => {
    const { targetId, tied } = tallyVotes({
      a: 'x',
      b: 'y',
      c: 'x',
      d: 'y',
    });
    expect(tied).toBe(true);
    expect(targetId).toBeNull();
  });

  it('continue apres elimination si partie non finie', () => {
    let game = createGame(
      ['Alice', 'Bob', 'Claire', 'Diane', 'Eve'],
      1,
      pairs,
    );
    const civilian = game.players.find((p) => p.role === 'civilian')!;
    game = eliminatePlayer(game, civilian.id);

    expect(game.winner).toBeNull();
    expect(game.phase).toBe('reveal');
  });
});
