<template>
  <div
    ref="boardElement"
    class="chessground"
    :class="{
      'cg-coordinates': coordinates,
      'coords-outside': coordinates && coordinatesPosition === 'outside'
    }"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useChessground } from '@/composables/useChessground'
import type { ChessBoardProps, ChessBoardEmits, Config, Key } from '@/types/chessground'

// Props
const props = withDefaults(defineProps<ChessBoardProps>(), {
  orientation: 'white',
  coordinates: true,
  coordinatesPosition: 'inside',
  coordinatesOnSquares: false,
  viewOnly: false,
  disableContextMenu: true,
  autoCastle: true
})

// Emits
const emit = defineEmits<ChessBoardEmits>()

// Template refs
const boardElement = ref<HTMLElement>()

// State for click-to-move functionality
const selectedSquare = ref<Key | null>(null)

// Helper function to generate comprehensive destinations for all chess pieces
const getBasicDests = () => {
  const dests = new Map()
  
  // Generate comprehensive destinations for all chess pieces
  
  // Helper function to check if square is valid
  const isValidSquare = (file: number, rank: number) => {
    return file >= 0 && file < 8 && rank >= 1 && rank <= 8
  }
  
  // Helper function to convert file/rank to square notation
  const toSquare = (file: number, rank: number) => {
    return String.fromCharCode(97 + file) + rank
  }
  
  // Pawn moves (starting position)
  // White pawns
  for (let file = 0; file < 8; file++) {
    const square = toSquare(file, 2)
    const moves = [toSquare(file, 3), toSquare(file, 4)]
    dests.set(square, moves)
  }
  
  // Black pawns
  for (let file = 0; file < 8; file++) {
    const square = toSquare(file, 7)
    const moves = [toSquare(file, 6), toSquare(file, 5)]
    dests.set(square, moves)
  }
  
  // Knight moves (all possible L-shaped moves)
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ]
  
  // White knights
  const whiteKnights = [[1, 1], [6, 1]] // b1, g1
  whiteKnights.forEach(([file, rank]) => {
    const square = toSquare(file, rank)
    const moves: string[] = []
    knightMoves.forEach(([df, dr]) => {
      const newFile = file + df
      const newRank = rank + dr
      if (isValidSquare(newFile, newRank)) {
        moves.push(toSquare(newFile, newRank))
      }
    })
    dests.set(square, moves)
  })
  
  // Black knights
  const blackKnights = [[1, 8], [6, 8]] // b8, g8
  blackKnights.forEach(([file, rank]) => {
    const square = toSquare(file, rank)
    const moves: string[] = []
    knightMoves.forEach(([df, dr]) => {
      const newFile = file + df
      const newRank = rank + dr
      if (isValidSquare(newFile, newRank)) {
        moves.push(toSquare(newFile, newRank))
      }
    })
    dests.set(square, moves)
  })
  
  // Rook moves (horizontal and vertical)
  const rookPositions = [
    [0, 1], [7, 1], // a1, h1 (white)
    [0, 8], [7, 8]  // a8, h8 (black)
  ]
  
  rookPositions.forEach(([file, rank]) => {
    const square = toSquare(file, rank)
    const moves: string[] = []
    
    // Horizontal moves
    for (let f = 0; f < 8; f++) {
      if (f !== file) moves.push(toSquare(f, rank))
    }
    
    // Vertical moves
    for (let r = 1; r <= 8; r++) {
      if (r !== rank) moves.push(toSquare(file, r))
    }
    
    dests.set(square, moves)
  })
  
  // Bishop moves (diagonal)
  const bishopPositions = [
    [2, 1], [5, 1], // c1, f1 (white)
    [2, 8], [5, 8]  // c8, f8 (black)
  ]
  
  bishopPositions.forEach(([file, rank]) => {
    const square = toSquare(file, rank)
    const moves: string[] = []
    
    // Diagonal moves in all 4 directions
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    directions.forEach(([df, dr]) => {
      for (let i = 1; i < 8; i++) {
        const newFile = file + (df * i)
        const newRank = rank + (dr * i)
        if (isValidSquare(newFile, newRank)) {
          moves.push(toSquare(newFile, newRank))
        } else {
          break
        }
      }
    })
    
    dests.set(square, moves)
  })
  
  // Queen moves (combination of rook and bishop)
  const queenPositions = [
    [3, 1], // d1 (white)
    [3, 8]  // d8 (black)
  ]
  
  queenPositions.forEach(([file, rank]) => {
    const square = toSquare(file, rank)
    const moves: string[] = []
    
    // Horizontal and vertical (like rook)
    for (let f = 0; f < 8; f++) {
      if (f !== file) moves.push(toSquare(f, rank))
    }
    for (let r = 1; r <= 8; r++) {
      if (r !== rank) moves.push(toSquare(file, r))
    }
    
    // Diagonal (like bishop)
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    directions.forEach(([df, dr]) => {
      for (let i = 1; i < 8; i++) {
        const newFile = file + (df * i)
        const newRank = rank + (dr * i)
        if (isValidSquare(newFile, newRank)) {
          moves.push(toSquare(newFile, newRank))
        } else {
          break
        }
      }
    })
    
    dests.set(square, moves)
  })
  
  // King moves (one square in any direction)
  const kingPositions = [
    [4, 1], // e1 (white)
    [4, 8]  // e8 (black)
  ]
  
  kingPositions.forEach(([file, rank]) => {
    const square = toSquare(file, rank)
    const moves: string[] = []
    
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ]
    
    directions.forEach(([df, dr]) => {
      const newFile = file + df
      const newRank = rank + dr
      if (isValidSquare(newFile, newRank)) {
        moves.push(toSquare(newFile, newRank))
      }
    })
    
    dests.set(square, moves)
  })
  
  // Comprehensive destinations generated for all piece types
  
  return dests
}

// Build chessground configuration from props
const chessgroundConfig = computed<Config>(() => {
  const config: Config = {
    orientation: props.orientation,
    turnColor: props.turnColor,
    check: props.check,
    lastMove: props.lastMove,
    coordinates: props.coordinates,
    coordinatesOnSquares: props.coordinatesOnSquares,
    autoCastle: props.autoCastle,
    viewOnly: props.viewOnly,
    disableContextMenu: props.disableContextMenu,
    movable: {
      free: props.movable?.free || false,
      color: props.movable?.color || 'white',
      rookCastle: props.movable?.rookCastle !== false,
      showDests: props.movable?.showDests !== false,
      // Add basic destinations for all pieces if not in free mode
      dests: props.movable?.free ? undefined : getBasicDests(),
      events: {
        after: (orig, dest, metadata) => {
          // This ensures the move is properly committed
          props.onMove?.(orig, dest, metadata.captured)
          emit('move', orig, dest, metadata.captured)
        }
      }
    },
    draggable: {
      enabled: true,
      showGhost: true
    },
    premovable: props.premovable || {
      enabled: true
    },
    animation: props.animation || {
      enabled: true,
      duration: 200
    },
    highlight: props.highlight || {
      lastMove: true,
      check: true
    },
    drawable: props.drawable || {
      enabled: false,
      visible: true
    },
    selectable: {
      enabled: !props.viewOnly && (props.selectable?.enabled !== false)
    },
    events: {
      select: (key) => {
        // Implement click-to-move logic
        if (selectedSquare.value && selectedSquare.value !== key) {
          // Check if this is a valid move
          const dests = chessgroundConfig.value.movable?.dests
          const validMoves = dests?.get(selectedSquare.value as Key)
          
          if (validMoves && validMoves.includes(key)) {
            // Execute the move programmatically
            if (chessground.value) {
              chessground.value.move(selectedSquare.value as Key, key)
              // Note: chessground.move() should trigger the 'after' event automatically
            }
            selectedSquare.value = null
            return
          }
        }
        
        selectedSquare.value = key
        props.onSelect?.(key)
        emit('select', key)
      },
      insert: (elements) => {
        props.onInsert?.(elements)
        emit('insert', elements)
      },
      change: () => {
        props.onChange?.()
        emit('change')
      }
    }
  }

  return config
})

// Initialize chessground
const {
  chessground,
  set,
  toggleOrientation,
  setPieces,
  selectSquare,
  move,
  newPiece,
  playPremove,
  cancelPremove,
  cancelMove,
  stop,
  explode,
  setAutoShapes,
  setShapes,
  getKeyAtDomPos,
  redrawAll,
  dragNewPiece
} = useChessground(boardElement, chessgroundConfig)

// Watch for FEN changes and update pieces
watch(
  () => props.fen,
  (newFen) => {
    if (newFen && chessground.value) {
      // Note: In a real implementation, you'd convert FEN to pieces here
      // For now, we emit an event so the parent can handle it
      emit('change')
    }
  }
)

// Expose methods to parent component
defineExpose({
  // Chessground API methods
  set,
  toggleOrientation,
  setPieces,
  selectSquare,
  move,
  newPiece,
  playPremove,
  cancelPremove,
  cancelMove,
  stop,
  explode,
  setAutoShapes,
  setShapes,
  getKeyAtDomPos,
  redrawAll,
  dragNewPiece,
  
  // Direct access to chessground instance (advanced usage)
  chessground: chessground.value
})
</script>

<!--
  NOTE: This component has NO CSS to prevent conflicts with user applications.
  
  Users must import the required chessground CSS files in their main application:
  
  @import 'chessground/assets/chessground.base.css';
  @import 'chessground/assets/chessground.brown.css';
  @import 'chessground/assets/chessground.cburnett.css';
  
  For responsive board sizing and coordinate scaling, users can add:
  
  .chessground {
    width: 100%;
    height: 100%;
    min-width: 400px;
    min-height: 400px;
  }
  
  .chessground cg-board {
    background-color: #bfcfdd;
  }
-->