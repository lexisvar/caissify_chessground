<template>
  <div class="test-moves">
    <h2>Test Move Refresh Issue</h2>
    
    <div class="board-container">
      <ChessBoard
        ref="chessboard"
        :fen="currentFen"
        :movable="{ color: 'both', free: false }"
        @move="onMove"
        @change="onChange"
        style="width: 400px; height: 400px;"
      />
    </div>
    
    <div class="controls">
      <button @click="makeTestMove">Make Test Move (e2-e4)</button>
      <button @click="resetBoard">Reset Board</button>
      <button @click="forceRedraw">Force Redraw</button>
    </div>
    
    <div class="debug-info">
      <h3>Debug Information:</h3>
      <p><strong>Current FEN:</strong> {{ currentFen }}</p>
      <p><strong>Move Count:</strong> {{ moveCount }}</p>
      <p><strong>Last Move:</strong> {{ lastMove }}</p>
      <p><strong>Change Events:</strong> {{ changeCount }}</p>
    </div>
    
    <div class="move-history">
      <h3>Move History:</h3>
      <ul>
        <li v-for="(move, index) in moveHistory" :key="index">
          {{ move.from }} → {{ move.to }} {{ move.captured ? `(captured ${move.captured})` : '' }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChessBoard from './src/components/ChessBoard.vue'

// Starting position FEN
const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const currentFen = ref(startingFen)

// Debug tracking
const moveCount = ref(0)
const changeCount = ref(0)
const lastMove = ref('')
const moveHistory = ref<Array<{from: string, to: string, captured?: string}>>([])

// Component ref
const chessboard = ref()

// Event handlers
const onMove = (from: string, to: string, captured?: string) => {
  console.log('🔄 Move event:', { from, to, captured })
  moveCount.value++
  lastMove.value = `${from}-${to}`
  moveHistory.value.push({ from, to, captured })
  
  // Log current board state after move
  setTimeout(() => {
    console.log('📋 Board state after move:', chessboard.value?.chessground?.getFen?.())
  }, 100)
}

const onChange = () => {
  console.log('🔄 Change event triggered')
  changeCount.value++
}

// Test functions
const makeTestMove = () => {
  console.log('🧪 Making test move: e2-e4')
  if (chessboard.value) {
    try {
      // Try to make a programmatic move
      chessboard.value.move('e2', 'e4')
      console.log('✅ Programmatic move executed')
    } catch (error) {
      console.error('❌ Error making programmatic move:', error)
    }
  }
}

const resetBoard = () => {
  console.log('🔄 Resetting board')
  currentFen.value = startingFen
  moveCount.value = 0
  changeCount.value = 0
  lastMove.value = ''
  moveHistory.value = []
}

const forceRedraw = () => {
  console.log('🎨 Forcing redraw')
  if (chessboard.value) {
    chessboard.value.redrawAll()
  }
}

onMounted(() => {
  console.log('🚀 Test component mounted')
  console.log('📋 Initial board state:', chessboard.value)
})
</script>

<style scoped>
.test-moves {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.board-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.controls button {
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #0056b3;
}

.debug-info, .move-history {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.debug-info p {
  margin: 5px 0;
}

.move-history ul {
  list-style-type: none;
  padding: 0;
}

.move-history li {
  padding: 5px 0;
  border-bottom: 1px solid #dee2e6;
}

.move-history li:last-child {
  border-bottom: none;
}
</style>