<template>
  <div
    ref="boardElement"
    class="cg-wrap"
    :class="{ 'cg-coordinates': coordinates }"
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

// Helper function to generate basic destinations for standard chess moves
const getBasicDests = () => {
  const dests = new Map()
  
  // Basic pawn moves for starting position
  // White pawns
  for (let file = 0; file < 8; file++) {
    const square = String.fromCharCode(97 + file) + '2'
    const oneStep = String.fromCharCode(97 + file) + '3'
    const twoStep = String.fromCharCode(97 + file) + '4'
    dests.set(square, [oneStep, twoStep])
  }
  
  // Black pawns
  for (let file = 0; file < 8; file++) {
    const square = String.fromCharCode(97 + file) + '7'
    const oneStep = String.fromCharCode(97 + file) + '6'
    const twoStep = String.fromCharCode(97 + file) + '5'
    dests.set(square, [oneStep, twoStep])
  }
  
  // Basic knight moves from starting positions
  dests.set('b1', ['a3', 'c3'])
  dests.set('g1', ['f3', 'h3'])
  dests.set('b8', ['a6', 'c6'])
  dests.set('g8', ['f6', 'h6'])
  
  console.log('[DEBUG] Generated basic dests:', dests)
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
          console.log('[DEBUG] Move event fired:', { orig, dest, metadata })
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
        console.log('[DEBUG] Select event fired:', key)
        
        // Implement click-to-move logic
        if (selectedSquare.value && selectedSquare.value !== key) {
          // Check if this is a valid move
          const dests = chessgroundConfig.value.movable?.dests
          const validMoves = dests?.get(selectedSquare.value as Key)
          
          if (validMoves && validMoves.includes(key)) {
            console.log('[DEBUG] Executing move:', selectedSquare.value, '→', key)
            // Execute the move programmatically
            if (chessground.value) {
              chessground.value.move(selectedSquare.value as Key, key)
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
        console.log('[DEBUG] Insert event fired:', elements)
        props.onInsert?.(elements)
        emit('insert', elements)
      },
      change: () => {
        console.log('[DEBUG] Change event fired')
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

<style>
/* Import chessground CSS */
@import 'chessground/assets/chessground.base.css';
@import 'chessground/assets/chessground.brown.css';
@import 'chessground/assets/chessground.cburnett.css';

/* Additional styling */
.cg-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  display: block;
}

/* Ensure the board is square */
.cg-wrap::before {
  content: '';
  display: block;
  padding-bottom: 100%;
}

.cg-wrap > .cg-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .cg-wrap {
    max-width: 100vw;
    max-height: 100vw;
  }
}

/* Let chessground handle coordinates naturally */
.cg-coordinates {
  /* Chessground will handle coordinate positioning automatically */
}
</style>