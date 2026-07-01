import { useState } from 'react';

type Cell = 'X' | 'O' | null;

const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(cells: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line };
    }
  }
  return null;
}

export default function Board() {
  const [cells, setCells] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const result = calculateWinner(cells);
  const isDraw = !result && cells.every((c) => c !== null);

  const status = result
    ? `Winner: ${result.winner}`
    : isDraw
    ? "It's a draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  function handleClick(i: number) {
    if (cells[i] || result) return;
    const next = cells.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setCells(next);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setCells(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white/70 backdrop-blur rounded-3xl shadow-2xl shadow-pink-300/40 border border-pink-200">
      <h1 className="text-4xl font-extrabold text-pink-600 tracking-tight">
        Tic Tac Toe
      </h1>

      <div
        className={`text-lg font-semibold px-4 py-2 rounded-full ${
          result
            ? 'bg-pink-500 text-white'
            : isDraw
            ? 'bg-pink-200 text-pink-800'
            : 'bg-pink-100 text-pink-700'
        }`}
      >
        {status}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {cells.map((cell, i) => {
          const isWinning = result?.line.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || !!result}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl text-5xl font-black flex items-center justify-center transition-all duration-150
                ${
                  isWinning
                    ? 'bg-pink-500 text-white scale-105 shadow-lg shadow-pink-400/60'
                    : cell
                    ? 'bg-pink-100 text-pink-600'
                    : 'bg-pink-50 hover:bg-pink-100 text-pink-500 hover:scale-105 active:scale-95'
                }
                border-2 border-pink-200 disabled:cursor-not-allowed`}
              aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ', empty'}`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleReset}
        className="px-6 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-semibold shadow-md shadow-pink-300/50 transition-colors"
      >
        New Game
      </button>
    </div>
  );
}
