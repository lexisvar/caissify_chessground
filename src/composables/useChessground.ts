import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { Chessground } from 'chessground'
import type { Api, Config, UseChessgroundReturn, Key, DrawShape } from '@/types/chessground'

export function useChessground(
  element: Ref<HTMLElement | undefined>,
  config: Ref<Config>
): UseChessgroundReturn {
  const chessground = ref<Api>()

  // Initialize chessground instance
  const initChessground = () => {
    if (!element.value) return
    
    try {
      chessground.value = Chessground(element.value, config.value)
    } catch (error) {
      console.error('Failed to initialize chessground:', error)
    }
  }

  // Destroy chessground instance
  const destroyChessground = () => {
    if (chessground.value) {
      chessground.value.destroy()
      chessground.value = undefined
    }
  }

  // Update configuration reactively
  const updateConfig = (newConfig: Config) => {
    if (chessground.value) {
      chessground.value.set(newConfig)
    }
  }

  // Watch for config changes
  watch(
    config,
    (newConfig) => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  // Watch for element changes
  watch(
    element,
    (newElement) => {
      if (newElement) {
        destroyChessground()
        initChessground()
      }
    }
  )

  // Lifecycle hooks
  onMounted(() => {
    initChessground()
  })

  onUnmounted(() => {
    destroyChessground()
  })

  // Helper function to convert FEN to pieces format
  const fenToPieces = (fen: string) => {
    const pieces = new Map()
    const rows = fen.split(' ')[0].split('/')
    
    for (let rank = 0; rank < 8; rank++) {
      let file = 0
      for (const char of rows[rank]) {
        if (char >= '1' && char <= '8') {
          file += parseInt(char)
        } else {
          const color = char === char.toUpperCase() ? 'white' : 'black'
          const role = char.toLowerCase()
          const roleMap: Record<string, string> = {
            'p': 'pawn', 'r': 'rook', 'n': 'knight',
            'b': 'bishop', 'q': 'queen', 'k': 'king'
          }
          const square = String.fromCharCode(97 + file) + (8 - rank)
          pieces.set(square, { role: roleMap[role], color })
          file++
        }
      }
    }
    return pieces
  }

  // API methods
  const set = (newConfig: Config) => {
    if (chessground.value) {
      // Handle FEN conversion if provided
      if ((newConfig as any).fen) {
        const pieces = fenToPieces((newConfig as any).fen)
        const configWithoutFen = { ...newConfig }
        delete (configWithoutFen as any).fen
        
        // For FEN-based resets, destroy and recreate the chessground instance
        // This ensures complete visual state clearing
        if (element.value) {
          chessground.value.destroy()
          
          // Recreate with clean configuration - explicitly clear pieces to avoid conflicts
          const cleanConfig = {
            ...config.value,
            ...configWithoutFen,
            lastMove: undefined,
            selected: undefined,
            check: undefined,
            // Ensure no pieces are set during recreation
            pieces: new Map()
          }
          
          chessground.value = Chessground(element.value, cleanConfig)
          
          // Set FEN pieces immediately after recreation (no setTimeout needed)
          chessground.value.setPieces(pieces)
          chessground.value.redrawAll()
        }
      } else {
        chessground.value.set(newConfig)
      }
    }
  }

  const toggleOrientation = () => {
    if (chessground.value) {
      chessground.value.toggleOrientation()
    }
  }

  const setPieces = (pieces: any) => {
    if (chessground.value) {
      // Convert pieces format if needed
      let piecesMap = pieces
      if (!(pieces instanceof Map)) {
        piecesMap = new Map()
        if (pieces && typeof pieces === 'object') {
          Object.entries(pieces).forEach(([key, value]) => {
            piecesMap.set(key, value)
          })
        }
      }
      
      // Set pieces directly and force redraw
      chessground.value.setPieces(piecesMap)
      chessground.value.redrawAll()
    }
  }

  const selectSquare = (key: Key | null) => {
    if (chessground.value) {
      chessground.value.selectSquare(key)
    }
  }

  const move = (orig: Key, dest: Key) => {
    if (chessground.value) {
      chessground.value.move(orig, dest)
    }
  }

  const newPiece = (piece: any, key: Key) => {
    if (chessground.value) {
      chessground.value.newPiece(piece, key)
    }
  }

  const playPremove = (): boolean => {
    return chessground.value?.playPremove() ?? false
  }

  const cancelPremove = () => {
    if (chessground.value) {
      chessground.value.cancelPremove()
    }
  }

  const cancelMove = () => {
    if (chessground.value) {
      chessground.value.cancelMove()
    }
  }

  const stop = () => {
    if (chessground.value) {
      chessground.value.stop()
    }
  }

  const explode = (keys: Key[]) => {
    if (chessground.value) {
      chessground.value.explode(keys)
    }
  }

  const setAutoShapes = (shapes: DrawShape[]) => {
    if (chessground.value) {
      chessground.value.setAutoShapes(shapes)
    }
  }

  const setShapes = (shapes: DrawShape[]) => {
    if (chessground.value) {
      chessground.value.setShapes(shapes)
    }
  }

  const getKeyAtDomPos = (pos: [number, number]): Key | undefined => {
    return chessground.value?.getKeyAtDomPos(pos)
  }

  const redrawAll = () => {
    if (chessground.value) {
      chessground.value.redrawAll()
    }
  }

  const dragNewPiece = (piece: any, event: Event, force?: boolean) => {
    if (chessground.value) {
      chessground.value.dragNewPiece(piece, event, force)
    }
  }

  return {
    chessground: chessground as Readonly<Ref<Api | undefined>>,
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
  }
}