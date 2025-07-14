import { createApp } from 'vue'
import { ChessBoard } from '../src/index'

// Demo application
const app = createApp({
  components: {
    ChessBoard
  },
  template: `
    <div>
      <!-- Basic Board Demo -->
      <chess-board
        ref="basicBoard"
        :coordinates="true"
        :movable="{ free: true }"
        @move="onMove"
      />
      
      <!-- Interactive Board Demo -->
      <chess-board
        ref="interactiveBoard"
        :coordinates="true"
        :drawable="{ enabled: true }"
        :highlight="{ lastMove: true, check: true }"
      />
      
      <!-- Analysis Board Demo -->
      <chess-board
        ref="analysisBoard"
        :view-only="viewOnly"
        :coordinates="true"
      />
      
      <!-- Tracking Board Demo -->
      <chess-board
        ref="trackingBoard"
        :coordinates="true"
        @move="onMoveTracked"
      />
    </div>
  `,
  data() {
    return {
      viewOnly: false,
      moveHistory: [] as string[]
    }
  },
  methods: {
    onMove(orig: string, dest: string) {
      console.log('Move:', orig, '->', dest)
    },
    
    onMoveTracked(orig: string, dest: string) {
      const move = `${orig}-${dest}`
      this.moveHistory.push(move)
      this.updateMoveHistory()
    },
    
    updateMoveHistory() {
      const historyEl = document.getElementById('move-history')
      if (historyEl) {
        historyEl.innerHTML = this.moveHistory.join('<br>')
      }
    }
  }
})

// Mount the app (this won't work until we have Vue installed)
// app.mount('#app')

// Demo functions for HTML buttons
declare global {
  interface Window {
    flipBoard: () => void
    resetBoard: () => void
    highlightSquares: () => void
    showArrows: () => void
    clearShapes: () => void
    loadPosition: () => void
    toggleViewOnly: () => void
    clearHistory: () => void
  }
}

// Global demo functions
window.flipBoard = () => {
  console.log('Flip board functionality - will be implemented after dependencies are installed')
}

window.resetBoard = () => {
  console.log('Reset board functionality - will be implemented after dependencies are installed')
}

window.highlightSquares = () => {
  console.log('Highlight squares functionality - will be implemented after dependencies are installed')
}

window.showArrows = () => {
  console.log('Show arrows functionality - will be implemented after dependencies are installed')
}

window.clearShapes = () => {
  console.log('Clear shapes functionality - will be implemented after dependencies are installed')
}

window.loadPosition = () => {
  console.log('Load position functionality - will be implemented after dependencies are installed')
}

window.toggleViewOnly = () => {
  console.log('Toggle view only functionality - will be implemented after dependencies are installed')
}

window.clearHistory = () => {
  const historyEl = document.getElementById('move-history')
  if (historyEl) {
    historyEl.innerHTML = 'Move history cleared...'
  }
}

// Export for potential use
export default app