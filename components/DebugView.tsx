import React, { useState, useEffect } from 'react';
import { GenerationStep } from '../services/puzzleGenerator';
import { CellValue } from '../types';

interface DebugViewProps {
  steps: GenerationStep[];
  onComplete: () => void;
}

const DebugView: React.FC<DebugViewProps> = ({ steps, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedGrid, setDisplayedGrid] = useState<CellValue[][]>([]);
  const [message, setMessage] = useState('Initialisiere Generator...');
  
  useEffect(() => {
    if (steps.length === 0) {
        setMessage('Warte auf Generierungsschritte...');
        return;
    };

    const interval = setInterval(() => {
      setCurrentStepIndex(prevIndex => {
        if (prevIndex >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 1000); // Wait a bit on the final screen
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 200); // Animation speed

    return () => clearInterval(interval);
  }, [steps, onComplete]);

  useEffect(() => {
    if (steps[currentStepIndex]) {
        setDisplayedGrid(steps[currentStepIndex].grid);
        setMessage(steps[currentStepIndex].message);
    }
  }, [currentStepIndex, steps]);

  const getCellClass = (r: number, c: number) => {
    const cellValue = displayedGrid[r]?.[c];
    if (cellValue === null || cellValue === undefined) return '';

    const isHighlighted = steps[currentStepIndex]?.highlightedCells?.some(cell => cell.r === r && cell.c === c);
    
    // Matched sizes with GameBoard for 11x9
    let baseClass = 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center text-base sm:text-lg md:text-xl font-bold rounded-full transition-all duration-300';

    if (typeof cellValue === 'number') {
        baseClass += ' bg-slate-700 text-white shadow-md';
    } else if (cellValue) { // Operator or equals
        return 'w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-slate-500';
    } else {
        baseClass += ' bg-stone-300';
    }
    
    if(isHighlighted) {
        baseClass += ' animate-pop border-4 border-amber-500';
    }

    return baseClass;
  };

  const ROWS = 9;
  const COLS = 11;

  return (
    <div className="relative p-2 md:p-4 bg-stone-200 rounded-2xl shadow-lg border-4 border-stone-300 flex flex-col items-center">
      <div className="grid grid-cols-11 gap-1 sm:gap-1.5 items-center justify-items-center">
        {Array.from({ length: ROWS * COLS }).map((_, index) => {
          const r = Math.floor(index / COLS);
          const c = index % COLS;
          const cellValue = displayedGrid[r]?.[c];
          return (
            <div key={`${r}-${c}`} className={getCellClass(r, c)}>
              <span>{cellValue}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 h-10 text-center font-semibold text-slate-600 text-lg">
        <p className="animate-fade-in">{message}</p>
      </div>
    </div>
  );
};

export default DebugView;