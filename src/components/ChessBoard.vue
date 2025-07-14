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
import type { ChessBoardProps, ChessBoardEmits, Config } from '@/types/chessground'

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
    movable: props.movable || {
      free: false,
      rookCastle: true
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
    selectable: props.selectable || {
      enabled: true
    },
    events: {
      move: (orig, dest, capturedPiece) => {
        props.onMove?.(orig, dest, capturedPiece)
        emit('move', orig, dest, capturedPiece)
      },
      dropNewPiece: (piece, key) => {
        props.onDropNewPiece?.(piece, key)
        emit('dropNewPiece', piece, key)
      },
      select: (key) => {
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

  // Set FEN position if provided
  if (props.fen) {
    // Note: chessground doesn't parse FEN directly, you need to convert FEN to pieces
    // This would typically be done with a chess library like chess.js
    // For now, we'll pass it through and let the parent handle the conversion
    config.fen = props.fen
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

/* Custom coordinate styling */
.cg-coordinates .cg-wrap {
  /* Add padding for coordinates if needed */
}
</style>