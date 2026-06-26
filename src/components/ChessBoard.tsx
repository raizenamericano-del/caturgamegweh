import { useState, useEffect, useRef } from 'react';
import {
  Undo2,
  RotateCcw,
  Flag,
  FlipVertical,
} from 'lucide-react';
import { useChessGame, type BoardTheme } from '@/hooks/useChessGame';

interface ChessBoardProps {
  boardTheme: BoardTheme;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const THEME_COLORS: Record<BoardTheme, { dark: string; light: string }> = {
  classic: { dark: '#b58863', light: '#f0d9b5' },
  sage: { dark: '#90ac78', light: '#cdd7c0' },
  slate: { dark: '#6582a4', light: '#b9c6d7' },
  rose: { dark: '#ce7c7c', light: '#e8c8c8' },
};

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export default function ChessBoard({ boardTheme }: ChessBoardProps) {
  const {
    board,
    selectedSquare,
    legalMoves,
    lastMove,
    moveHistory,
    capturedPieces,
    currentTurn,
    isFlipped,
    handleSquareClick,
    undoMove,
    resetGame,
    flipBoard,
    getPieceSymbol,
  } = useChessGame();

  const [animatePiece, setAnimatePiece] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const theme = THEME_COLORS[boardTheme];

  // Auto-scroll move history
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [moveHistory]);

  // Animate last moved piece
  useEffect(() => {
    if (lastMove) {
      setAnimatePiece(lastMove.to);
      const timer = setTimeout(() => setAnimatePiece(null), 200);
      return () => clearTimeout(timer);
    }
  }, [lastMove]);

  // Calculate material advantage
  const getMaterialScore = (color: 'w' | 'b') => {
    return capturedPieces[color === 'w' ? 'b' : 'w'].reduce(
      (sum, p) => sum + (PIECE_VALUES[p.type] || 0),
      0
    );
  };

  const whiteMaterial = getMaterialScore('w');
  const blackMaterial = getMaterialScore('b');

  const renderSquare = (fileIdx: number, rankIdx: number) => {
    const file = FILES[fileIdx];
    const rank = RANKS[rankIdx];
    const square = file + rank;

    const displayFileIdx = isFlipped ? 7 - fileIdx : fileIdx;
    const displayRankIdx = isFlipped ? 7 - rankIdx : rankIdx;
    const piece = board[displayRankIdx][displayFileIdx];

    const isSelected = selectedSquare === square;
    const isLegalMove = legalMoves.includes(square);
    const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
    const isAnimating = animatePiece === square;

    const isDark = (fileIdx + rankIdx) % 2 === 1;
    const bgColor = isDark ? theme.dark : theme.light;

    return (
      <div
        key={square}
        className="relative flex items-center justify-center cursor-pointer select-none"
        style={{
          backgroundColor: bgColor,
          width: '100%',
          aspectRatio: '1',
        }}
        onClick={() => handleSquareClick(square)}
        role="button"
        aria-label={`Square ${square}${piece ? `, ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
      >
        {/* Last move highlight */}
        {isLastMove && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(144, 172, 120, 0.4)' }}
          />
        )}

        {/* Selected square highlight */}
        {isSelected && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(246, 184, 70, 0.5)' }}
          />
        )}

        {/* Legal move indicators */}
        {isLegalMove && !piece && (
          <div
            className="absolute rounded-full"
            style={{
              width: '33%',
              height: '33%',
              backgroundColor: 'rgba(246, 184, 70, 0.5)',
            }}
          />
        )}

        {/* Legal capture indicator */}
        {isLegalMove && piece && (
          <div
            className="absolute inset-0 rounded-full border-[3px]"
            style={{ borderColor: 'rgba(246, 184, 70, 0.6)' }}
          />
        )}

        {/* Piece */}
        {piece && (
          <span
            className={`text-[clamp(1.5rem,5vw,2.5rem)] leading-none transition-transform duration-200 z-10 ${
              isAnimating ? 'scale-110' : 'scale-100'
            } ${piece.color === 'w' ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]' : 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.1)]'}`}
            style={{
              color: piece.color === 'w' ? '#f6b846' : '#8a8a8a',
              fontFamily: 'serif',
            }}
          >
            {getPieceSymbol(piece)}
          </span>
        )}

        {/* Coordinate labels */}
        {rankIdx === 7 && (
          <span
            className="absolute bottom-0.5 left-1 text-[10px] font-outfit font-medium"
            style={{ color: isDark ? theme.light : theme.dark }}
          >
            {file}
          </span>
        )}
        {fileIdx === 0 && (
          <span
            className="absolute top-0.5 right-1 text-[10px] font-outfit font-medium"
            style={{ color: isDark ? theme.light : theme.dark }}
          >
            {rank}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center gap-4 lg:gap-6 w-full max-w-[1000px] mx-auto">
      {/* Left panel - Player info */}
      <div className="hidden lg:flex flex-col gap-3 w-48">
        {/* Black player */}
        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            currentTurn === 'b'
              ? 'bg-white/10 border-[#f6b846]/50'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <span className="text-xs font-outfit font-bold text-black">B</span>
            </div>
            <div>
              <p className="text-sm font-outfit font-medium text-white">Hitam (AI)</p>
              <p className="text-xs text-white/50 font-outfit">
                {blackMaterial > 0 && `+${blackMaterial}`}
              </p>
            </div>
          </div>
          {capturedPieces.b.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-0.5">
              {capturedPieces.b.map((p, i) => (
                <span key={i} className="text-xs text-[#f6b846]">
                  {getPieceSymbol(p)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* White player */}
        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            currentTurn === 'w'
              ? 'bg-white/10 border-[#f6b846]/50'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f6b846] to-[#d4a035] flex items-center justify-center">
              <span className="text-xs font-outfit font-bold text-black">W</span>
            </div>
            <div>
              <p className="text-sm font-outfit font-medium text-white">Putih (Anda)</p>
              <p className="text-xs text-white/50 font-outfit">
                {whiteMaterial > 0 && `+${whiteMaterial}`}
              </p>
            </div>
          </div>
          {capturedPieces.w.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-0.5">
              {capturedPieces.w.map((p, i) => (
                <span key={i} className="text-xs text-white/60">
                  {getPieceSymbol(p)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chess Board */}
      <div className="flex flex-col items-center">
        {/* Mobile player indicators */}
        <div className="lg:hidden w-full flex justify-between items-center mb-2 px-1">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentTurn === 'b' ? 'bg-white/10 border border-[#f6b846]/30' : 'bg-white/5'}`}>
            <span className="text-xs text-white/60 font-outfit">Hitam (AI)</span>
            {capturedPieces.b.length > 0 && (
              <span className="text-xs text-[#f6b846]">
                +{blackMaterial}
              </span>
            )}
          </div>
          <div className="text-xs text-white/40 font-outfit">
            {currentTurn === 'w' ? 'Giliran Anda' : 'Giliran AI'}
          </div>
        </div>

        {/* Board */}
        <div
          ref={boardRef}
          className="rounded-lg overflow-hidden gold-glow-strong border-4 border-[rgba(246,184,70,0.3)]"
          style={{
            width: 'clamp(320px, 80vw, 560px)',
            aspectRatio: '1',
          }}
        >
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {RANKS.map((_, rankIdx) =>
              FILES.map((_, fileIdx) => renderSquare(fileIdx, rankIdx))
            )}
          </div>
        </div>

        {/* Mobile white indicator */}
        <div className="lg:hidden w-full flex justify-between items-center mt-2 px-1">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentTurn === 'w' ? 'bg-white/10 border border-[#f6b846]/30' : 'bg-white/5'}`}>
            <span className="text-xs text-white/60 font-outfit">Putih (Anda)</span>
            {capturedPieces.w.length > 0 && (
              <span className="text-xs text-white/60">
                +{whiteMaterial}
              </span>
            )}
          </div>
        </div>

        {/* Board controls */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={undoMove}
            disabled={moveHistory.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm font-outfit"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Undo</span>
          </button>
          <button
            onClick={flipBoard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-outfit"
          >
            <FlipVertical className="w-4 h-4" />
            <span className="hidden sm:inline">Flip</span>
          </button>
          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-outfit"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-200 text-sm font-outfit"
          >
            <Flag className="w-4 h-4" />
            <span className="hidden sm:inline">Resign</span>
          </button>
        </div>
      </div>

      {/* Right panel - Move history */}
      <div className="hidden lg:flex flex-col w-48">
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-xs font-outfit font-medium text-white/60 uppercase tracking-wider">
              Riwayat Gerakan
            </p>
          </div>
          <div
            ref={historyRef}
            className="h-80 overflow-y-auto p-2"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
          >
            {moveHistory.length === 0 ? (
              <p className="text-xs text-white/30 font-outfit text-center py-4">
                Belum ada gerakan
              </p>
            ) : (
              <div className="space-y-0.5">
                {moveHistory.map((move, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-outfit ${
                      i === moveHistory.length - 1 ? 'bg-[#f6b846]/10 text-[#f6b846]' : 'text-white/60'
                    }`}
                  >
                    <span className="w-6 text-right text-white/30">{Math.floor(i / 2) + 1}{i % 2 === 0 ? '.' : '...'}</span>
                    <span>{move.san}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Game status */}
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-xs font-outfit text-white/40 mb-1">Status</p>
          <p className="text-sm font-outfit text-white">
            {currentTurn === 'w' ? 'Giliran Putih' : 'Giliran Hitam'}
          </p>
          <p className="text-xs font-outfit text-white/40 mt-1">
            {moveHistory.length} gerakan
          </p>
        </div>
      </div>
    </div>
  );
}
