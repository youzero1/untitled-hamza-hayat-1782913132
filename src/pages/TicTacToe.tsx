import { useMemo, useState } from 'react';

type Cell = 'X' | 'O' | null;

const WINNING_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: Cell[]): { winner: Cell; line: number[] | null } {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [scores, setScores] = useState<{ X: number; O: number; draws: number }>({
    X: 0,
    O: 0,
    draws: 0,
  });
  const [scoredThisRound, setScoredThisRound] = useState<boolean>(false);

  const { winner, line: winningLine } = useMemo(() => calculateWinner(board), [board]);
  const isDraw = !winner && board.every((c) => c !== null);

  // Update scoreboard once per completed round.
  if ((winner || isDraw) && !scoredThisRound) {
    setScoredThisRound(true);
    if (winner === 'X') setScores((s) => ({ ...s, X: s.X + 1 }));
    else if (winner === 'O') setScores((s) => ({ ...s, O: s.O + 1 }));
    else setScores((s) => ({ ...s, draws: s.draws + 1 }));
  }

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;
    const next = board.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setScoredThisRound(false);
  };

  const resetAll = () => {
    resetBoard();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  let status: string;
  if (winner) status = `Player ${winner} wins! 🎉`;
  else if (isDraw) status = "It's a draw!";
  else status = `Player ${xIsNext ? 'X' : 'O'}'s turn`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-300/40 border border-pink-200 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-600 tracking-tight">
              Tic Tac Toe
            </h1>
            <p className="text-pink-500/80 mt-2 text-sm">A pink little classic 💗</p>
          </div>

          {/* Scoreboard */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="rounded-xl bg-pink-500 text-white py-3 text-center shadow-md shadow-pink-400/40">
              <div className="text-xs font-medium opacity-90">Player X</div>
              <div className="text-2xl font-bold">{scores.X}</div>
            </div>
            <div className="rounded-xl bg-pink-200 text-pink-700 py-3 text-center border border-pink-300">
              <div className="text-xs font-medium">Draws</div>
              <div className="text-2xl font-bold">{scores.draws}</div>
            </div>
            <div className="rounded-xl bg-pink-400 text-white py-3 text-center shadow-md shadow-pink-300/40">
              <div className="text-xs font-medium opacity-90">Player O</div>
              <div className="text-2xl font-bold">{scores.O}</div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-5">
            <div className="inline-block px-5 py-2 rounded-full bg-pink-100 border border-pink-300 text-pink-700 font-semibold">
              {status}
            </div>
          </div>

          {/* Board */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {board.map((cell, i) => {
              const isWinning = winningLine?.includes(i);
              const disabled = Boolean(cell) || Boolean(winner);
              return (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={disabled}
                  aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ', empty'}`}
                  className={[
                    'aspect-square rounded-2xl flex items-center justify-center',
                    'text-5xl sm:text-6xl font-extrabold',
                    'transition-all duration-150',
                    'border-2',
                    isWinning
                      ? 'bg-pink-500 border-pink-600 text-white scale-105 shadow-lg shadow-pink-400/60'
                      : cell
                      ? 'bg-white border-pink-200 text-pink-600'
                      : 'bg-white/80 border-pink-200 text-pink-500 hover:bg-pink-50 hover:border-pink-400 active:scale-95 cursor-pointer',
                    disabled && !isWinning ? 'cursor-not-allowed' : '',
                  ].join(' ')}
                >
                  {cell}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetBoard}
              className="flex-1 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-semibold shadow-md shadow-pink-400/40 transition-colors cursor-pointer"
            >
              New Round
            </button>
            <button
              onClick={resetAll}
              className="flex-1 py-3 rounded-xl bg-white hover:bg-pink-50 text-pink-600 font-semibold border-2 border-pink-300 hover:border-pink-400 transition-colors cursor-pointer"
            >
              Reset Scores
            </button>
          </div>
        </div>

        <p className="text-center text-pink-500/70 text-xs mt-4">
          Take turns tapping a square to place your mark.
        </p>
      </div>
    </div>
  );
}
