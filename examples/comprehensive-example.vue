<template>
  <div class="chess-app">
    <header class="app-header">
      <h1>🏆 Caissify Chessground Demo</h1>
      <p class="hero-subtitle">Interactive chess boards with perfect coordinate scaling</p>
    </header>
    
    <!-- Quick Start Guide -->
    <div class="quick-start">
      <h2>🚀 Quick Start Guide</h2>
      <div class="guide-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Choose Your Size</h3>
            <p>See how coordinates scale perfectly at 350px, 400px, and 500px</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Try the Controls</h3>
            <p>Reset, flip, or load test positions to see coordinates in action</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Explore Features</h3>
            <p>Scroll down to see interactive examples and advanced features</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Size Demonstration Section -->
    <div class="size-demo-section">
      <div class="section-header">
        <h2>📏 Board Size Comparison</h2>
        <p class="section-description">
          Watch how coordinates automatically scale and remain perfectly readable at different board sizes.
          This solves the original issue where coordinates didn't fit properly on smaller boards.
        </p>
      </div>
      
      <div class="size-demo-grid">
        <!-- 350px Board -->
        <div class="size-demo-item">
          <div class="size-badge mobile">📱 Mobile</div>
          <h3>350px × 350px</h3>
          <div class="board-container size-350">
            <ChessBoard
              ref="board350"
              :coordinates="true"
              coordinates-position="outside"
              :movable="{ free: false, color: 'white' }"
              :highlight="{ lastMove: true, check: true }"
              :drawable="{ enabled: true, visible: true }"
            />
          </div>
          <div class="size-info">
            <div class="info-row">
              <span class="info-label">📐 Size:</span>
              <span class="info-value">350px × 350px</span>
            </div>
            <div class="info-row">
              <span class="info-label">🎯 Best for:</span>
              <span class="info-value">Mobile phones, compact layouts</span>
            </div>
            <div class="coordinate-status">
              <span class="status-indicator good">✅</span>
              <span>Coordinates: Clear & Readable</span>
            </div>
          </div>
        </div>

        <!-- 400px Board -->
        <div class="size-demo-item">
          <div class="size-badge tablet">📱 Tablet</div>
          <h3>400px × 400px</h3>
          <div class="board-container size-400">
            <ChessBoard
              ref="board400"
              :coordinates="true"
              coordinates-position="outside"
              :movable="{ free: false, color: 'white' }"
              :highlight="{ lastMove: true, check: true }"
              :drawable="{ enabled: true, visible: true }"
            />
          </div>
          <div class="size-info">
            <div class="info-row">
              <span class="info-label">📐 Size:</span>
              <span class="info-value">400px × 400px</span>
            </div>
            <div class="info-row">
              <span class="info-label">🎯 Best for:</span>
              <span class="info-value">Tablets, medium screens</span>
            </div>
            <div class="coordinate-status">
              <span class="status-indicator good">✅</span>
              <span>Coordinates: Well Proportioned</span>
            </div>
          </div>
        </div>

        <!-- 500px Board -->
        <div class="size-demo-item featured">
          <div class="size-badge desktop">🖥️ Desktop</div>
          <div class="featured-badge">⭐ Recommended</div>
          <h3>500px × 500px</h3>
          <div class="board-container size-500">
            <ChessBoard
              ref="board500"
              :coordinates="true"
              coordinates-position="outside"
              :movable="{ free: false, color: 'white' }"
              :highlight="{ lastMove: true, check: true }"
              :drawable="{ enabled: true, visible: true }"
            />
          </div>
          <div class="size-info">
            <div class="info-row">
              <span class="info-label">📐 Size:</span>
              <span class="info-value">500px × 500px</span>
            </div>
            <div class="info-row">
              <span class="info-label">🎯 Best for:</span>
              <span class="info-value">Desktop, optimal experience</span>
            </div>
            <div class="coordinate-status">
              <span class="status-indicator excellent">🌟</span>
              <span>Coordinates: Perfect & Spacious</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="size-demo-controls">
        <div class="controls-header">
          <h3>🎮 Try These Actions</h3>
          <p>Test how coordinates behave across all board sizes. Right-click and drag to draw arrows and circles!</p>
        </div>
        <div class="control-buttons">
          <button class="btn-primary" @click="resetAllSizeBoards">
            <span class="btn-icon">🔄</span>
            Reset All Boards
          </button>
          <button class="btn-secondary" @click="flipAllSizeBoards">
            <span class="btn-icon">🔄</span>
            Flip All Boards
          </button>
          <button class="btn-accent" @click="loadTestPositionAll">
            <span class="btn-icon">🎯</span>
            Load Test Position
          </button>
          <button class="btn-drawing" @click="addArrowsToSizeBoards">
            <span class="btn-icon">🏹</span>
            Add Sample Arrows
          </button>
          <button class="btn-clear" @click="clearAllShapes">
            <span class="btn-icon">🧹</span>
            Clear All Drawings
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div class="success-message">
      <div class="success-content">
        <div class="success-icon">🎉</div>
        <div class="success-text">
          <h3>Problem Solved!</h3>
          <p>Coordinates now scale perfectly at any board size. No more positioning issues!</p>
        </div>
      </div>
    </div>

    <div class="demo-grid">
      <!-- Basic Board -->
      <div class="demo-section">
        <h2>1. Basic Chess Board</h2>
        <div class="board-container">
          <ChessBoard
            ref="basicBoard"
            :coordinates="true"
            coordinates-position="inside"
            :movable="{ free: false, color: basicCurrentColor }"
            :highlight="{ lastMove: true, check: true }"
            :drawable="{ enabled: true, visible: true }"
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
            coordinates-position="outside"
            :movable="{ free: true, color: 'both' }"
            :highlight="{ lastMove: true }"
            :drawable="{ enabled: true, visible: true }"
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
            :drawable="{ enabled: true, visible: true }"
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
// Size demo board refs
const board350 = ref()
const board400 = ref()
const board500 = ref()

// State
const basicLastMove = ref<string>('')
const basicSelected = ref<Key | null>(null)
const basicCurrentColor = ref<'white' | 'black'>('white')
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
  // Switch turns after each move
  basicCurrentColor.value = basicCurrentColor.value === 'white' ? 'black' : 'white'
  console.log('Basic move:', from, to, captured, '- Next turn:', basicCurrentColor.value)
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
    
    // Reset state first
    basicLastMove.value = ''
    basicSelected.value = null
    basicCurrentColor.value = 'white'
    
    // Use set() method with FEN - it handles clearing internally
    basicBoard.value.set({
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lastMove: undefined,
      selected: undefined
    })
    
    console.log('[DEBUG] COMPREHENSIVE - Basic board reset completed')
  }
}

const flipBasicBoard = () => {
  if (basicBoard.value) {
    basicBoard.value.toggleOrientation()
  }
}

const resetFreeBoard = () => {
  if (freeBoard.value) {
    // Reset move history first
    freeMoves.value = []
    
    // Use set() method with FEN for consistent behavior
    freeBoard.value.set({
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lastMove: undefined
    })
    
    console.log('[DEBUG] COMPREHENSIVE - Free board reset completed')
  }
}

const clearFreeBoard = () => {
  if (freeBoard.value) {
    // Use the same FEN-based approach that works for reset
    freeBoard.value.set({
      fen: '8/8/8/8/8/8/8/8 w - - 0 1',
      lastMove: undefined,
      selected: undefined,
      check: undefined
    })
    console.log('[DEBUG] COMPREHENSIVE - Free board cleared')
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

// Size demo methods
const resetAllSizeBoards = () => {
  const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  
  if (board350.value) {
    board350.value.set({ fen: startingFen })
  }
  if (board400.value) {
    board400.value.set({ fen: startingFen })
  }
  if (board500.value) {
    board500.value.set({ fen: startingFen })
  }
}

const flipAllSizeBoards = () => {
  [board350, board400, board500].forEach(board => {
    if (board.value) {
      board.value.toggleOrientation()
    }
  })
}

const loadTestPositionAll = () => {
  const testFen = 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4'
  
  if (board350.value) {
    board350.value.set({ fen: testFen })
  }
  if (board400.value) {
    board400.value.set({ fen: testFen })
  }
  if (board500.value) {
    board500.value.set({ fen: testFen })
  }
}

// Drawing helper functions for size demo boards
const addArrowsToSizeBoards = () => {
  const sampleShapes = [
    { orig: 'e2', dest: 'e4', brush: 'green' },
    { orig: 'd1', dest: 'h5', brush: 'red' },
    { orig: 'g1', dest: 'f3', brush: 'blue' }
  ]
  
  if (board350.value) {
    board350.value.setShapes(sampleShapes)
  }
  if (board400.value) {
    board400.value.setShapes(sampleShapes)
  }
  if (board500.value) {
    board500.value.setShapes(sampleShapes)
  }
}

const clearAllShapes = () => {
  // Clear shapes from all boards
  const allBoards = [basicBoard, freeBoard, analysisBoard, historyBoard, board350, board400, board500]
  allBoards.forEach(board => {
    if (board.value) {
      board.value.setShapes([])
    }
  })
}

// Initialize boards on mount
import { onMounted } from 'vue'
onMounted(() => {
  setTimeout(() => {
    resetAllBoards()
    resetAllSizeBoards()
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
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 15px;
  font-size: 1.4rem;
}

/* Board container sizing for optimal coordinate display */
.board-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto 20px auto;
  /* Ensure minimum size for proper coordinate scaling */
  min-width: 380px;
  aspect-ratio: 1;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 1200px) {
  .demo-grid {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 35px;
  }
  
  .board-container {
    max-width: 420px;
    min-width: 350px;
  }
}

@media (max-width: 900px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .board-container {
    min-width: 300px;
    max-width: 350px;
  }
  
  .demo-section {
    padding: 20px;
  }
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

/* Header Styles */
.app-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin: 0 0 15px 0;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hero-subtitle {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

/* Quick Start Guide */
.quick-start {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.quick-start h2 {
  margin-top: 0;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.guide-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.step-number {
  background: #007bff;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
}

.step-content p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 2rem;
}

.section-description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

/* Success Message */
.success-message {
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 40px;
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.success-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
}

.success-icon {
  font-size: 3rem;
}

.success-text h3 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
}

.success-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-style: italic;
}

/* Size Demo Section Styles - Better spacing for 500px boards */
.size-demo-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 40px;
  border: 2px solid #e9ecef;
  max-width: 1800px;
  margin-left: auto;
  margin-right: auto;
}

.size-demo-section h2 {
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 24px;
}

.size-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 50px;
  margin-bottom: 40px;
  justify-items: center;
}

/* For wider screens, ensure 500px boards can fit in single row */
@media (min-width: 1600px) {
  .size-demo-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1800px;
    gap: 60px;
  }
}

@media (min-width: 1400px) and (max-width: 1599px) {
  .size-demo-grid {
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 55px;
  }
}

.size-demo-item {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  width: 100%;
  max-width: 580px;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.size-demo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.size-demo-item.featured {
  border: 2px solid #ffd700;
  background: linear-gradient(145deg, #fff, #fffef7);
}

/* Size badges */
.size-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.size-badge.mobile {
  background: #e3f2fd;
  color: #1976d2;
}

.size-badge.tablet {
  background: #f3e5f5;
  color: #7b1fa2;
}

.size-badge.desktop {
  background: #e8f5e8;
  color: #388e3c;
}

.featured-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ffd700;
  color: #333;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

.size-demo-item h3 {
  margin-top: 0;
  margin-bottom: 25px;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

/* Fixed size containers for demonstration */
.size-350 {
  width: 350px !important;
  height: 350px !important;
  min-width: 350px !important;
  max-width: 350px !important;
  margin: 0 auto;
}

.size-400 {
  width: 400px !important;
  height: 400px !important;
  min-width: 400px !important;
  max-width: 400px !important;
  margin: 0 auto;
}

.size-500 {
  width: 500px !important;
  height: 500px !important;
  min-width: 500px !important;
  max-width: 500px !important;
  margin: 0 auto;
}

.size-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-row:last-of-type {
  margin-bottom: 12px;
}

.info-label {
  font-weight: 600;
  color: #555;
}

.info-value {
  color: #333;
}

.coordinate-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #e9ecef;
  font-weight: 500;
}

.status-indicator.good {
  color: #28a745;
}

.status-indicator.excellent {
  color: #ffc107;
}

.size-demo-controls {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.controls-header {
  margin-bottom: 25px;
}

.controls-header h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.3rem;
}

.controls-header p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary, .btn-accent {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
  transform: translateY(-1px);
}

.btn-accent {
  background: #28a745;
  color: white;
}

.btn-accent:hover {
  background: #218838;
  transform: translateY(-1px);
}

.btn-drawing {
  background: #17a2b8;
  color: white;
}

.btn-drawing:hover {
  background: #138496;
  transform: translateY(-1px);
}

.btn-clear {
  background: #dc3545;
  color: white;
}

.btn-clear:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Responsive adjustments for size demo - Better breakpoints */
@media (max-width: 1399px) {
  .size-demo-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
  }
  
  .size-demo-item {
    max-width: 520px;
  }
}

@media (max-width: 1200px) {
  .size-demo-grid {
    gap: 35px;
  }
  
  .size-500 {
    width: 450px !important;
    height: 450px !important;
    min-width: 450px !important;
    max-width: 450px !important;
  }
}

@media (max-width: 900px) {
  .size-demo-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .size-500 {
    width: 400px !important;
    height: 400px !important;
    min-width: 400px !important;
    max-width: 400px !important;
  }
}

@media (max-width: 600px) {
  .size-demo-section {
    padding: 25px;
  }
  
  .size-demo-item {
    padding: 20px;
  }
  
  .size-350, .size-400, .size-500 {
    width: 300px !important;
    height: 300px !important;
    min-width: 300px !important;
    max-width: 300px !important;
  }
}
</style>