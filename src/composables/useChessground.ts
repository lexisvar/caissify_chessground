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
    console.log('[DEBUG] Converting FEN to pieces:', fen)
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
    console.log('[DEBUG] Converted pieces Map:', pieces)
    console.log('[DEBUG] Pieces Map size:', pieces.size)
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
        // Clear the board first, then set pieces to avoid duplicates
        chessground.value.set({ ...configWithoutFen, fen: undefined })
        chessground.value.setPieces(new Map()) // Clear all pieces first
        chessground.value.setPieces(pieces)
      } else {
        chessground.value.set(newConfig)
      }
    }
    // Don't mutate the reactive config - let the watcher handle updates
  }

  const toggleOrientation = () => {
    if (chessground.value) {
      chessground.value.toggleOrientation()
    }
  }

  const setPieces = (pieces: any) => {
    if (chessground.value) {
      console.log('[DEBUG] setPieces called with:', pieces)
      console.log('[DEBUG] pieces type:', typeof pieces)
      console.log('[DEBUG] pieces instanceof Map:', pieces instanceof Map)
      
      // Convert pieces format if needed
      let piecesMap = pieces
      if (!(pieces instanceof Map)) {
        console.log('[DEBUG] Converting object to Map')
        piecesMap = new Map()
        if (pieces && typeof pieces === 'object') {
          Object.entries(pieces).forEach(([key, value]) => {
            piecesMap.set(key, value)
          })
        }
      }
      
      console.log('[DEBUG] Final pieces Map:', piecesMap)
      console.log('[DEBUG] Final pieces Map size:', piecesMap.size)
      
      // Clear the board completely first to ensure clean state
      chessground.value.setPieces(new Map())
      
      // Small delay to ensure clearing is processed
      setTimeout(() => {
        if (chessground.value) {
          chessground.value.setPieces(piecesMap)
          chessground.value.redrawAll()
          console.log('[DEBUG] Pieces set and board redrawn')
        }
      }, 10)
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