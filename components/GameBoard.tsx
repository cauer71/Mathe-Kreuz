import React from 'react';
import { CellData } from '../types';

interface GameBoardProps {
  puzzle: CellData[][];
  userInputs: { [key:string]: string };
  onInputChange: (key: string, value: string) => void;
  isGameWon: boolean;
  revealedCells: Set<string>;
}

const GameBoard: React.FC<GameBoardProps> = ({ puzzle, userInputs, onInputChange, isGameWon, revealedCells }) => {

  const getCellClass = (cell: CellData) => {
    if (cell.value === null) return '';

    // Adjusted sizes for the 11x9 layout
    let baseClass = 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center text-base sm:text-lg md:text-xl font-bold rounded-full transition-all duration-300';
    
    if (cell.isInput) {
        baseClass += ' bg-white shadow-inner text-slate-800 border-2';
        if (revealedCells.has(cell.key)) {
            baseClass += ' border-violet-400 bg-violet-100 text-violet-800';
        }
        else if (cell.isCorrect === true) {
            baseClass += ' border-green-500 ring-4 ring-green-200';
        } else if (cell.isCorrect === false) {
            baseClass += ' border-red-500 ring-4 ring-red-200';
        } else {
            baseClass += ' border-gray-400 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-200';
        }
    } else if (typeof cell.value === 'number') {
        baseClass += ' bg-slate-700 text-white shadow-md border-2 border-slate-800';
    } else { // Operator or Equals sign
        baseClass = 'w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-slate-500';
    }
    return baseClass;
  };

  return (
    <div className="relative p-2 md:p-4 bg-stone-200 rounded-2xl shadow-lg border-4 border-stone-300">
        <div className="grid grid-cols-11 gap-1 sm:gap-1.5 items-center justify-items-center">
        {puzzle.flat().map((cell) => (
            <div key={cell.key} className={getCellClass(cell)}>
            {cell.value !== null && (
                cell.isInput ? (
                    <input
                    type="number"
                    value={userInputs[cell.key] || ''}
                    onChange={(e) => onInputChange(cell.key, e.target.value)}
                    className="w-full h-full text-center bg-transparent rounded-full focus:outline-none"
                    disabled={isGameWon || revealedCells.has(cell.key)}
                    />
                ) : (
                    <span>{cell.value}</span>
                )
            )}
            </div>
        ))}
        </div>
    </div>
  );
};

export default GameBoard;