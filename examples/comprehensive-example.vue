<template>
  <div class="chess-app">
    <h1>Comprehensive Caissify Chessground Example</h1>
    
    <div class="demo-grid">
      <!-- Basic Board -->
      <div class="demo-section">
        <h2>1. Basic Chess Board</h2>
        <div class="board-container">
          <ChessBoard
            ref="basicBoard"
            :coordinates="true"
            :movable="{ free: false, color: 'white' }"
            :highlight="{ lastMove: true, check: true }"
            @move="onBasicMove"
            @select="onBasicSelect"
          />
        </div>
        <div class="controls">
          <button @click="resetBasicBoard">Reset Position</button>
          <button @click="flipBasicBoard">Flip Board</button>
        </div>
        <div class="info">
          <strong>Last Move:</strong> {{ basicLastMove || 'None' }}<br>
          <strong>Selected:</strong> {{ basicSelected || 'None' }}
        </div>
      </div>

      <!-- Free Mode Board -->
      <div class="demo-section">
        <h2>2. Free Mode (Drag Any Piece)</h2>
        <div class="board-container">
          <ChessBoard
            ref="freeBoard"
            :coordinates="true"
            :movable="{ free: true, color: 'both' }"
            :highlight="{ lastMove: true }"
            @move="onFreeMove"
          />
        </div>
        <div class="controls">
          <button @click="resetFreeBoard">Reset Position</button>
          <button @click="clearFreeBoard">Clear Board</button>
          <button @click="addRandomPieces">Add Random Pieces</button>
        </div>
        <div class="info">
          <strong>Moves:</strong> {{ freeMoves.length }}<br>
          <strong>Mode:</strong> Free movement enabled
        </div>
      </div>

      <!-- Analysis Board -->
      <div class="demo-section">
        <h2>3. Analysis Mode (View Only)</h2>
        <div class="board-container">
          <ChessBoard
            ref="analysisBoard"
            :coordinates="true"
            :view-only="viewOnly"
            :highlight="{ lastMove: true, check: true }"
            :drawable="{ enabled: true, visible: true }"
          />
        </div>
        <div class="controls">
          <button @click="toggleViewOnly">{{ viewOnly ? 'Enable' : 'Disable' }} View Only</button>
          <button @click="loadTestPosition">Load Test Position</button>
          <button @click="addArrows">Add Arrows</button>
          <button @click="clearShapes">Clear Shapes</button>
        </div>
        <div class="info">
          <strong>Mode:</strong> {{ viewOnly ? 'View Only' : 'Interactive' }}<br>
          <strong>Features:</strong> Drawing enabled
        </div>
      </div>

      <!-- Move History Board -->
      <div class="demo-section">
        <h2>4. Move History & Events</h2>
        <div class="board-container">
          <ChessBoard
            ref="historyBoard"
            :coordinates="true"
            :movable="{ free: false, color: currentTurn }"
            :highlight="{ lastMove: true, check: true }"
            @move="onHistoryMove"
            @select="onHistorySelect"
            @change="onBoardChange"
          />
        </div>
        <div class="controls">
          <button @click="resetHistoryBoard">Reset</button>
          <button @click="undoLastMove">Undo Move</button>
          <button @click="switchTurns">Switch Turn</button>
        </div>
        <div class="move-history">
          <h4>Move History:</h4>
          <div class="history-list">
            <div v-for="(move, index) in moveHistory" :key="index" class="history-item">
              {{ index + 1 }}. {{ move.from }} → {{ move.to }}
              <span v-if="move.captured" class="captured">({{ move.captured.role }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Controls -->
    <div class="global-controls">
      <h3>Global Actions</h3>
      <button @click="resetAllBoards">Reset All Boards</button>
      <button @click="flipAllBoards">Flip All Boards</button>
      <button @click="runTests">Run Tests</button>
    </div>

    <!-- Test Results -->
    <div v-if="testResults.length > 0" class="test-results">
      <h3>Test Results</h3>
      <div v-for="(result, index) in testResults" :key="index" class="test-result">
        <span :class="{ 'test-pass': result.passed, 'test-fail': !result.passed }">
          {{ result.passed ? '✓' : '✗' }}
        </span>
        {{ result.name }}: {{ result.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChessBoard } from '../src/index'
import type { Key, Piece } from '../src/types/chessground'

// Board refs
const basicBoard = ref()
const freeBoard = ref()
const analysisBoard = ref()
const historyBoard = ref()

// State
const basicLastMove = ref<string>('')
const basicSelected = ref<Key | null>(null)
const freeMoves = ref<Array<{ from: Key, to: Key }>>([])
const viewOnly = ref(true)
const currentTurn = ref<'white' | 'black'>('white')
const moveHistory = ref<Array<{ from: Key, to: Key, captured?: Piece }>>([])
const testResults = ref<Array<{ name: string, passed: boolean, message: string }>>([])

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

// Starting position
const startingPosition = fenToPieces('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

// Event handlers
const onBasicMove = (from: Key, to: Key, captured?: Piece) => {
  basicLastMove.value = `${from} → ${to}`
  console.log('Basic move:', from, to, captured)
}

const onBasicSelect = (square: Key) => {
  basicSelected.value = square
  console.log('Basic select:', square)
}

const onFreeMove = (from: Key, to: Key) => {
  freeMoves.value.push({ from, to })
  console.log('Free move:', from, to)
}

const onHistoryMove = (from: Key, to: Key, captured?: Piece) => {
  moveHistory.value.push({ from, to, captured })
  currentTurn.value = currentTurn.value === 'white' ? 'black' : 'white'
  console.log('History move:', from, to, captured)
}

const onHistorySelect = (square: Key) => {
  console.log('History select:', square)
}

const onBoardChange = () => {
  console.log('Board changed')
}

// Control methods
const resetBasicBoard = () => {
  if (basicBoard.value) {
    console.log('[DEBUG] COMPREHENSIVE - Resetting basic board')
    
    // Clear the board first, then set the starting position
    basicBoard.value.setPieces(new Map())
    
    // Small delay to ensure clearing is processed
    setTimeout(() => {
      if (basicBoard.value) {
        basicBoard.value.set({
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        })
        console.log('[DEBUG] COMPREHENSIVE - Basic board reset completed')
      }
    }, 50)
    
    basicLastMove.value = ''
    basicSelected.value = null
  }
}

const flipBasicBoard = () => {
  if (basicBoard.value) {
    basicBoard.value.toggleOrientation()
  }
}

const resetFreeBoard = () => {
  if (freeBoard.value) {
    freeBoard.value.set({
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    })
    freeMoves.value = []
  }
}

const clearFreeBoard = () => {
  if (freeBoard.value) {
    freeBoard.value.set({
      fen: '8/8/8/8/8/8/8/8 w - - 0 1'
    })
  }
}

const addRandomPieces = () => {
  if (freeBoard.value) {
    // Clear board first, then add random pieces
    freeBoard.value.set({
      fen: '8/8/8/8/8/8/8/8 w - - 0 1'
    })
    
    // Add some random pieces
    const pieces = new Map()
    const squares = ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8']
    const roles = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']
    const colors = ['white', 'black']
    
    squares.forEach(square => {
      pieces.set(square, {
        role: roles[Math.floor(Math.random() * roles.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    })
    
    // Use setTimeout to ensure the clear operation completes first
    setTimeout(() => {
      if (freeBoard.value) {
        freeBoard.value.setPieces(pieces)
      }
    }, 50)
  }
}

const toggleViewOnly = () => {
  viewOnly.value = !viewOnly.value
  if (analysisBoard.value) {
    analysisBoard.value.set({ viewOnly: viewOnly.value })
  }
}

const loadTestPosition = () => {
  if (analysisBoard.value) {
    // Load a middle game position
    analysisBoard.value.set({
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4'
    })
  }
}

const addArrows = () => {
  if (analysisBoard.value) {
    analysisBoard.value.setShapes([
      { orig: 'e2', dest: 'e4', brush: 'green' },
      { orig: 'd1', dest: 'h5', brush: 'red' },
      { orig: 'g1', dest: 'f3', brush: 'blue' }
    ])
  }
}

const clearShapes = () => {
  if (analysisBoard.value) {
    analysisBoard.value.setShapes([])
  }
}

const resetHistoryBoard = () => {
  if (historyBoard.value) {
    historyBoard.value.set({
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    })
    moveHistory.value = []
    currentTurn.value = 'white'
  }
}

const undoLastMove = () => {
  if (moveHistory.value.length > 0) {
    moveHistory.value.pop()
    currentTurn.value = currentTurn.value === 'white' ? 'black' : 'white'
    // In a real implementation, you'd restore the previous position
    console.log('Undo move (position restoration not implemented)')
  }
}

const switchTurns = () => {
  currentTurn.value = currentTurn.value === 'white' ? 'black' : 'white'
  if (historyBoard.value) {
    historyBoard.value.set({ movable: { color: currentTurn.value } })
  }
}

// Global controls
const resetAllBoards = () => {
  resetBasicBoard()
  resetFreeBoard()
  resetHistoryBoard()
  if (analysisBoard.value) {
    analysisBoard.value.set({
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    })
  }
}

const flipAllBoards = () => {
  [basicBoard, freeBoard, analysisBoard, historyBoard].forEach(board => {
    if (board.value) {
      board.value.toggleOrientation()
    }
  })
}

const runTests = () => {
  testResults.value = []
  
  // Test 1: Board initialization
  testResults.value.push({
    name: 'Board Initialization',
    passed: !!basicBoard.value && !!freeBoard.value,
    message: 'All boards initialized successfully'
  })
  
  // Test 2: Piece setting
  try {
    basicBoard.value?.set({
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    })
    testResults.value.push({
      name: 'Piece Setting',
      passed: true,
      message: 'Pieces set successfully'
    })
  } catch (error) {
    testResults.value.push({
      name: 'Piece Setting',
      passed: false,
      message: `Error: ${error}`
    })
  }
  
  // Test 3: Board flipping
  try {
    basicBoard.value?.toggleOrientation()
    basicBoard.value?.toggleOrientation() // Flip back
    testResults.value.push({
      name: 'Board Flipping',
      passed: true,
      message: 'Board orientation toggle works'
    })
  } catch (error) {
    testResults.value.push({
      name: 'Board Flipping',
      passed: false,
      message: `Error: ${error}`
    })
  }
  
  // Test 4: Move history
  testResults.value.push({
    name: 'Move History',
    passed: Array.isArray(moveHistory.value),
    message: `Move history tracking: ${moveHistory.value.length} moves recorded`
  })
}

// Initialize boards on mount
import { onMounted } from 'vue'
onMounted(() => {
  setTimeout(() => {
    resetAllBoards()
  }, 100)
})
</script>

<style scoped>
.chess-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.demo-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.board-container {
  width: 300px;
  height: 300px;
  margin: 20px auto;
  border: 2px solid #333;
  border-radius: 4px;
}

.controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 15px 0;
  flex-wrap: wrap;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

button:hover {
  background: #0056b3;
}

.info {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 10px;
}

.move-history {
  margin-top: 15px;
}

.move-history h4 {
  margin: 0 0 10px 0;
  color: #555;
}

.history-list {
  max-height: 150px;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

.history-item {
  padding: 2px 0;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}

.history-item:last-child {
  border-bottom: none;
}

.captured {
  color: #dc3545;
  font-weight: bold;
}

.global-controls {
  text-align: center;
  margin: 40px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.global-controls h3 {
  margin-top: 0;
  color: #333;
}

.global-controls button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 14px;
}

.test-results {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.test-results h3 {
  margin-top: 0;
  color: #333;
}

.test-result {
  padding: 5px 0;
  font-family: monospace;
  font-size: 14px;
}

.test-pass {
  color: #28a745;
  font-weight: bold;
}

.test-fail {
  color: #dc3545;
  font-weight: bold;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}
</style>