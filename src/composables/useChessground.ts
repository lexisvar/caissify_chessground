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

  // API methods
  const set = (newConfig: Config) => {
    config.value = { ...config.value, ...newConfig }
  }

  const toggleOrientation = () => {
    if (chessground.value) {
      chessground.value.toggleOrientation()
    }
  }

  const setPieces = (pieces: any) => {
    if (chessground.value) {
      chessground.value.setPieces(pieces)
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