import {
  allAliveHaveVoted,
  castVote,
  checkWinner,
  createGame,
  createPlayers,
  eliminatePlayer,
  resolveVote,
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
    );
    expect(game.phase).toBe('assign');
    expect(game.players).toHaveLength(4);
    expect(game.winner).toBeNull();
  });
});

describe('checkWinner', () => {
  it('civils gagnent si plus d undercover', () => {
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
