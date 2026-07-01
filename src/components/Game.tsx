import { useMemo, useState } from 'react';

type Cell = 'X' | 'O' | null;

const LINES: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function calculateWinner(board: Cell[]): { winner: Cell; line: [number, number, number] } | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

export default function Game() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winInfo = useMemo(() => calculateWinner(board), [board]);
  const isDraw = !winInfo && board.every((c) => c !== null);
  const winningLine: number[] = winInfo?.line ? [...winInfo.line] : [];

  const handleClick = (i: number) => {
    if (board[i] || winInfo) return;
    const next = board.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);
    const result = calculateWinner(next);
    if (result) {
      setScores((s) => ({ ...s, [result.winner as 'X' | 'O']: s[result.winner as 'X' | 'O'] + 1 }));
    } else if (next.every((c) => c !== null)) {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
  };

  const resetRound = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const resetAll = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const status = winInfo
    ? `Player ${winInfo.winner} wins! 🎉`
    : isDraw
    ? "It's a draw!"
    : `Player ${xIsNext ? 'X' : 'O'}'s turn`;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-600 tracking-tight">
          Tic <span className="text-pink-400">Tac</span> Toe
        </h1>
        <p className="text-pink-500/80 mt-2 text-sm">A cozy pink two-player game</p>
      </div>

      {/* Status card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-pink-200/60 border border-pink-200 p-4 mb-5 text-center">
        <p className="text-lg font-semibold text-pink-700">{status}</p>
      </div>

      {/* Board */}
      <div className="bg-gradient-to-br from-pink-200 to-pink-300 p-3 rounded-3xl shadow-xl shadow-pink-300/50">
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, i) => {
            const isWinning = winningLine.includes(i);
            const disabled = !!cell || !!winInfo;
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={disabled}
                aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ', empty'}`}
                className={[
                  'aspect-square rounded-2xl flex items-center justify-center',
                  'text-5xl sm:text-6xl font-black select-none transition-all duration-150',
                  isWinning
                    ? 'bg-pink-500 text-white scale-105 shadow-lg shadow-pink-400/60'
                    : 'bg-white text-pink-600 hover:bg-pink-50 active:scale-95',
                  disabled && !isWinning ? 'cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
              >
                {cell}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="bg-white rounded-2xl border border-pink-200 p-3 text-center shadow-sm">
          <div className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Player X</div>
          <div className="text-2xl font-extrabold text-pink-600">{scores.X}</div>
        </div>
        <div className="bg-white rounded-2xl border border-pink-200 p-3 text-center shadow-sm">
          <div className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Draws</div>
          <div className="text-2xl font-extrabold text-pink-400">{scores.draws}</div>
        </div>
        <div className="bg-white rounded-2xl border border-pink-200 p-3 text-center shadow-sm">
          <div className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Player O</div>
          <div className="text-2xl font-extrabold text-pink-600">{scores.O}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={resetRound}
          className="flex-1 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-md shadow-pink-300/60 transition-colors"
        >
          New Round
        </button>
        <button
          onClick={resetAll}
          className="flex-1 bg-white hover:bg-pink-50 text-pink-600 font-semibold py-3 px-4 rounded-2xl border border-pink-300 transition-colors"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
}
