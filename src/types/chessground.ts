import type { Ref } from 'vue'
import type { Key, Piece, PiecesDiff, Role, Color, Elements } from 'chessground/types'
import type { Api } from 'chessground/api'
import type { Config } from 'chessground/config'
import type { DrawShape } from 'chessground/draw'

// Re-export chessground types for convenience
export type {
  Key,
  Piece,
  PiecesDiff,
  Role,
  Color,
  Elements
} from 'chessground/types'

export type { Api } from 'chessground/api'
export type { Config } from 'chessground/config'
export type { DrawShape } from 'chessground/draw'

// Vue-specific prop types
export interface ChessBoardProps {
  // Board state
  fen?: string
  orientation?: Color
  turnColor?: Color
  check?: Color | boolean
  lastMove?: Key[]
  
  // Visual configuration
  coordinates?: boolean
  autoCastle?: boolean
  viewOnly?: boolean
  disableContextMenu?: boolean
  
  // Piece movement
  movable?: Config['movable']
  premovable?: Config['premovable']
  
  // Visual effects
  animation?: Config['animation']
  highlight?: Config['highlight']
  
  // Drawing on board
  drawable?: Config['drawable']
  
  // Selection
  selectable?: Config['selectable']
  
  // Events
  onMove?: (orig: Key, dest: Key, capturedPiece?: Piece) => void
  onDropNewPiece?: (piece: Piece, key: Key) => void
  onSelect?: (key: Key) => void
  onInsert?: (elements: Elements) => void
  onChange?: () => void
}

// Emitted events
export interface ChessBoardEmits {
  move: [orig: Key, dest: Key, capturedPiece?: Piece]
  dropNewPiece: [piece: Piece, key: Key]
  select: [key: Key]
  insert: [elements: Elements]
  change: []
}

// Composable return type
export interface UseChessgroundReturn {
  chessground: Readonly<Ref<Api | undefined>>
  set: (config: Config) => void
  toggleOrientation: () => void
  setPieces: (pieces: PiecesDiff) => void
  selectSquare: (key: Key | null) => void
  move: (orig: Key, dest: Key) => void
  newPiece: (piece: Piece, key: Key) => void
  playPremove: () => boolean
  cancelPremove: () => void
  cancelMove: () => void
  stop: () => void
  explode: (keys: Key[]) => void
  setAutoShapes: (shapes: DrawShape[]) => void
  setShapes: (shapes: DrawShape[]) => void
  getKeyAtDomPos: (pos: [number, number]) => Key | undefined
  redrawAll: () => void
  dragNewPiece: (piece: Piece, event: Event, force?: boolean) => void
}