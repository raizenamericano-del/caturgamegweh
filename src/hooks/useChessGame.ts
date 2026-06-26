import { useState, useCallback } from 'react';

export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface Move {
  from: string;
  to: string;
  piece: ChessPiece;
  captured?: ChessPiece;
  san: string;
}

export type BoardTheme = 'classic' | 'sage' | 'slate' | 'rose';

const INITIAL_BOARD: (ChessPiece | null)[][] = [
  [
    { type: 'r', color: 'b' },
    { type: 'n', color: 'b' },
    { type: 'b', color: 'b' },
    { type: 'q', color: 'b' },
    { type: 'k', color: 'b' },
    { type: 'b', color: 'b' },
    { type: 'n', color: 'b' },
    { type: 'r', color: 'b' },
  ],
  [
    { type: 'p', color: 'b' },
    { type: 'p', color: 'b' },
    { type: 'p', color: 'b' },
    { type: 'p', color: 'b' },
    { type: 'p', color: 'b' },
    { type: 'p', color: 'b' },
    { type: 'p', color: 'b' },
    { type: 'p', color: 'b' },
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: 'p', color: 'w' },
    { type: 'p', color: 'w' },
    { type: 'p', color: 'w' },
    { type: 'p', color: 'w' },
    { type: 'p', color: 'w' },
    { type: 'p', color: 'w' },
    { type: 'p', color: 'w' },
    { type: 'p', color: 'w' },
  ],
  [
    { type: 'r', color: 'w' },
    { type: 'n', color: 'w' },
    { type: 'b', color: 'w' },
    { type: 'q', color: 'w' },
    { type: 'k', color: 'w' },
    { type: 'b', color: 'w' },
    { type: 'n', color: 'w' },
    { type: 'r', color: 'w' },
  ],
];

const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  w: { k: '\u2654', q: '\u2655', r: '\u2656', b: '\u2657', n: '\u2658', p: '\u2659' },
  b: { k: '\u265A', q: '\u265B', r: '\u265C', b: '\u265D', n: '\u265E', p: '\u265F' },
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export function useChessGame() {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(
    INITIAL_BOARD.map((row) => [...row])
  );
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ w: ChessPiece[]; b: ChessPiece[] }>({
    w: [],
    b: [],
  });
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('w');
  const [isFlipped, setIsFlipped] = useState(false);

  const getPieceAt = useCallback(
    (square: string): ChessPiece | null => {
      const file = FILES.indexOf(square[0]);
      const rank = RANKS.indexOf(square[1]);
      if (file === -1 || rank === -1) return null;
      return board[rank][file];
    },
    [board]
  );

  const getLegalMoves = useCallback(
    (square: string): string[] => {
      const piece = getPieceAt(square);
      if (!piece) return [];

      const file = FILES.indexOf(square[0]);
      const rank = RANKS.indexOf(square[1]);
      const moves: string[] = [];

      const addIfValid = (f: number, r: number) => {
        if (f >= 0 && f < 8 && r >= 0 && r < 8) {
          const sq = FILES[f] + RANKS[r];
          const target = board[r][f];
          if (!target || target.color !== piece.color) {
            moves.push(sq);
          }
        }
      };

      const addLine = (df: number, dr: number) => {
        for (let i = 1; i < 8; i++) {
          const f = file + df * i;
          const r = rank + dr * i;
          if (f < 0 || f >= 8 || r < 0 || r >= 8) break;
          const target = board[r][f];
          if (!target) {
            moves.push(FILES[f] + RANKS[r]);
          } else {
            if (target.color !== piece.color) {
              moves.push(FILES[f] + RANKS[r]);
            }
            break;
          }
        }
      };

      switch (piece.type) {
        case 'p': {
          const dir = piece.color === 'w' ? -1 : 1;
          const startRank = piece.color === 'w' ? 6 : 1;

          // Forward move
          const fr = rank + dir;
          if (fr >= 0 && fr < 8 && !board[fr][file]) {
            moves.push(FILES[file] + RANKS[fr]);
            // Double move from start
            if (rank === startRank) {
              const fr2 = rank + 2 * dir;
              if (!board[fr2][file]) {
                moves.push(FILES[file] + RANKS[fr2]);
              }
            }
          }

          // Captures
          for (const df of [-1, 1]) {
            const ff = file + df;
            const rf = rank + dir;
            if (ff >= 0 && ff < 8 && rf >= 0 && rf < 8) {
              const target = board[rf][ff];
              if (target && target.color !== piece.color) {
                moves.push(FILES[ff] + RANKS[rf]);
              }
            }
          }
          break;
        }
        case 'n': {
          const offsets = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1],
          ];
          for (const [dr, df] of offsets) {
            addIfValid(file + df, rank + dr);
          }
          break;
        }
        case 'b': {
          addLine(1, 1);
          addLine(1, -1);
          addLine(-1, 1);
          addLine(-1, -1);
          break;
        }
        case 'r': {
          addLine(0, 1);
          addLine(0, -1);
          addLine(1, 0);
          addLine(-1, 0);
          break;
        }
        case 'q': {
          addLine(1, 1);
          addLine(1, -1);
          addLine(-1, 1);
          addLine(-1, -1);
          addLine(0, 1);
          addLine(0, -1);
          addLine(1, 0);
          addLine(-1, 0);
          break;
        }
        case 'k': {
          const offsets = [
            [-1, -1], [-1, 0], [-1, 1], [0, -1],
            [0, 1], [1, -1], [1, 0], [1, 1],
          ];
          for (const [dr, df] of offsets) {
            addIfValid(file + df, rank + dr);
          }
          break;
        }
      }

      return moves;
    },
    [board, getPieceAt]
  );

  const handleSquareClick = useCallback(
    (square: string) => {
      const piece = getPieceAt(square);

      // If a square is already selected
      if (selectedSquare) {
        // If clicking the same square, deselect
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }

        // If clicking a legal move square, make the move
        if (legalMoves.includes(square)) {
          const fromFile = FILES.indexOf(selectedSquare[0]);
          const fromRank = RANKS.indexOf(selectedSquare[1]);
          const toFile = FILES.indexOf(square[0]);
          const toRank = RANKS.indexOf(square[1]);

          const movingPiece = board[fromRank][fromFile];
          const capturedPiece = board[toRank][toFile];

          if (!movingPiece) return;

          const newBoard = board.map((row) => [...row]);
          newBoard[toRank][toFile] = movingPiece;
          newBoard[fromRank][fromFile] = null;

          // Handle pawn promotion
          if (movingPiece.type === 'p') {
            if (movingPiece.color === 'w' && toRank === 0) {
              newBoard[toRank][toFile] = { type: 'q', color: 'w' };
            } else if (movingPiece.color === 'b' && toRank === 7) {
              newBoard[toRank][toFile] = { type: 'q', color: 'b' };
            }
          }

          const pieceName =
            movingPiece.type === 'p' ? '' : movingPiece.type.toUpperCase();
          const captureNotation = capturedPiece ? 'x' : '';
          const san = pieceName + captureNotation + square;

          const move: Move = {
            from: selectedSquare,
            to: square,
            piece: movingPiece,
            captured: capturedPiece || undefined,
            san,
          };

          setBoard(newBoard);
          setMoveHistory((prev) => [...prev, move]);
          setLastMove({ from: selectedSquare, to: square });
          setSelectedSquare(null);
          setLegalMoves([]);
          setCurrentTurn((prev) => (prev === 'w' ? 'b' : 'w'));

          if (capturedPiece) {
            setCapturedPieces((prev) => ({
              ...prev,
              [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece],
            }));
          }

          return;
        }

        // If clicking own piece, select it instead
        if (piece && piece.color === currentTurn) {
          setSelectedSquare(square);
          setLegalMoves(getLegalMoves(square));
          return;
        }

        // Otherwise deselect
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Select piece if it belongs to current player
      if (piece && piece.color === currentTurn) {
        setSelectedSquare(square);
        setLegalMoves(getLegalMoves(square));
      }
    },
    [board, selectedSquare, legalMoves, getPieceAt, getLegalMoves, currentTurn]
  );

  const undoMove = useCallback(() => {
    if (moveHistory.length === 0) return;

    const lastMoveEntry = moveHistory[moveHistory.length - 1];
    const fromFile = FILES.indexOf(lastMoveEntry.from[0]);
    const fromRank = RANKS.indexOf(lastMoveEntry.from[1]);
    const toFile = FILES.indexOf(lastMoveEntry.to[0]);
    const toRank = RANKS.indexOf(lastMoveEntry.to[1]);

    const newBoard = board.map((row) => [...row]);
    newBoard[fromRank][fromFile] = lastMoveEntry.piece;
    newBoard[toRank][toFile] = lastMoveEntry.captured || null;

    setBoard(newBoard);
    setMoveHistory((prev) => prev.slice(0, -1));
    setCurrentTurn((prev) => (prev === 'w' ? 'b' : 'w'));
    setSelectedSquare(null);
    setLegalMoves([]);

    if (lastMoveEntry.captured) {
      setCapturedPieces((prev) => {
        const colorPieces = [...prev[lastMoveEntry.captured!.color]];
        colorPieces.pop();
        return { ...prev, [lastMoveEntry.captured!.color]: colorPieces };
      });
    }

    if (moveHistory.length > 1) {
      const prevMove = moveHistory[moveHistory.length - 2];
      setLastMove({ from: prevMove.from, to: prevMove.to });
    } else {
      setLastMove(null);
    }
  }, [board, moveHistory]);

  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD.map((row) => [...row]));
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setMoveHistory([]);
    setCapturedPieces({ w: [], b: [] });
    setCurrentTurn('w');
  }, []);

  const flipBoard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const getPieceSymbol = (piece: ChessPiece): string => {
    return PIECE_SYMBOLS[piece.color][piece.type];
  };

  return {
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
    getPieceAt,
    getPieceSymbol,
  };
}
