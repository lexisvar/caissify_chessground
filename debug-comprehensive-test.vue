<template>
  <div class="debug-container">
    <h2>🐛 Debug: Comprehensive Event Testing</h2>
    
    <div class="test-info">
      <h3>Test Configuration</h3>
      <pre>{{ JSON.stringify({
        fen: currentFen,
        movableColor: movableConfig.color,
        destsSize: movableConfig.dests.size,
        viewOnly: false,
        selectableEnabled: true
      }, null, 2) }}</pre>
    </div>

    <div class="event-log">
      <h3>Event Log</h3>
      <div class="log-entries">
        <div v-for="(log, index) in eventLog" :key="index" :class="['log-entry', log.type]">
          <span class="timestamp">{{ log.timestamp }}</span>
          <span class="event">{{ log.event }}</span>
          <span class="data">{{ log.data }}</span>
        </div>
      </div>
      <button @click="clearLog">Clear Log</button>
    </div>

    <div class="chess-container">
      <h3>Chess Board (Should be interactive)</h3>
      <ChessBoard
        ref="chessboard"
        :fen="currentFen"
        :orientation="'white'"
        :movable="movableConfig"
        :premovable="{ enabled: false }"
        :drawable="{ enabled: true }"
        :coordinates="true"
        :lastMove="lastMove"
        :check="isInCheck"
        @move="onMove"
        @select="onSelect"
        @change="onChange"
        class="debug-board"
        :style="{ width: '400px', height: '400px' }"
      />
    </div>

    <div class="manual-tests">
      <h3>Manual Test Actions</h3>
      <button @click="testProgrammaticMove">Test Programmatic Move</button>
      <button @click="testSelectSquare">Test Select Square</button>
      <button @click="logChessgroundState">Log Chessground State</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import ChessBoard from './src/components/ChessBoard.vue'
import type { Key } from './src/types/chessground'
import { Chess } from 'chess.js'

// Test FEN with multiple pieces that can move
const currentFen = ref('8/p7/8/1p4p1/1P2kp2/P2b3P/2B2KP1/8 w - - 3 46')

// Event logging
const eventLog = ref<Array<{
  timestamp: string,
  event: string,
  data: string,
  type: 'success' | 'error' | 'info'
}>>([])

function addLog(event: string, data: any, type: 'success' | 'error' | 'info' = 'info') {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.value.unshift({
    timestamp,
    event,
    data: typeof data === 'object' ? JSON.stringify(data) : String(data),
    type
  })
  
  // Keep only last 20 entries
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20)
  }
}

// Chess logic
const chess = computed(() => new Chess(currentFen.value))
const lastMove = ref<[Key, Key] | undefined>()
const isInCheck = ref<Key | undefined>()

// Movable configuration
const movableConfig = reactive({
  free: false,
  color: 'white' as 'white' | 'black' | 'both' | undefined,
  dests: new Map(),
  showDests: true
})

// Update legal moves
function updateLegalMoves() {
  addLog('updateLegalMoves', 'Calculating legal moves...', 'info')
  
  const chessInstance = chess.value
  const moves = chessInstance.moves({ verbose: true })
  
  // Clear existing destinations
  movableConfig.dests.clear()
  
  // Populate destinations map
  moves.forEach(move => {
    const from = move.from as Key
    const to = move.to as Key
    
    if (!movableConfig.dests.has(from)) {
      movableConfig.dests.set(from, [])
    }
    movableConfig.dests.get(from)!.push(to)
  })
  
  // Set correct player color
  movableConfig.color = chessInstance.turn() === 'w' ? 'white' : 'black'
  
  addLog('updateLegalMoves', {
    totalMoves: moves.length,
    piecesCanMove: movableConfig.dests.size,
    currentPlayer: movableConfig.color,
    dests: Object.fromEntries(movableConfig.dests)
  }, 'success')
}

// Event handlers
function onMove(from: Key, to: Key, captured?: any) {
  addLog('onMove', { from, to, captured }, 'success')
  
  try {
    const chessInstance = chess.value
    const move = chessInstance.move({ from, to })
    
    if (move) {
      currentFen.value = chessInstance.fen()
      lastMove.value = [from, to]
      
      // Check for check
      if (chessInstance.inCheck()) {
        const kingSquare = chessInstance.board().flat().find(piece => 
          piece && piece.type === 'k' && piece.color === chessInstance.turn()
        )
        // This is simplified - in real implementation you'd find the actual king square
        isInCheck.value = undefined // Would need proper king square detection
      } else {
        isInCheck.value = undefined
      }
      
      updateLegalMoves()
      addLog('moveProcessed', { newFen: currentFen.value }, 'success')
    } else {
      addLog('moveError', 'Invalid move attempted', 'error')
    }
  } catch (error) {
    addLog('moveError', error, 'error')
  }
}

function onSelect(key: Key) {
  addLog('onSelect', { key }, 'info')
}

function onChange() {
  addLog('onChange', 'Board state changed', 'info')
}

// Manual test functions
const chessboard = ref()

function testProgrammaticMove() {
  addLog('testProgrammaticMove', 'Testing programmatic move...', 'info')
  
  if (chessboard.value && movableConfig.dests.size > 0) {
    const firstPiece = Array.from(movableConfig.dests.keys())[0]
    const firstMove = movableConfig.dests.get(firstPiece)?.[0]
    
    if (firstPiece && firstMove) {
      addLog('testProgrammaticMove', `Moving ${firstPiece} to ${firstMove}`, 'info')
      chessboard.value.move(firstPiece, firstMove)
    }
  }
}

function testSelectSquare() {
  addLog('testSelectSquare', 'Testing square selection...', 'info')
  
  if (chessboard.value && movableConfig.dests.size > 0) {
    const firstPiece = Array.from(movableConfig.dests.keys())[0]
    addLog('testSelectSquare', `Selecting ${firstPiece}`, 'info')
    chessboard.value.selectSquare(firstPiece)
  }
}

function logChessgroundState() {
  addLog('logChessgroundState', 'Logging chessground state...', 'info')
  
  if (chessboard.value?.chessground) {
    const state = chessboard.value.chessground.state
    addLog('chessgroundState', {
      viewOnly: state.viewOnly,
      movable: state.movable,
      selectable: state.selectable,
      selected: state.selected,
      pieces: Object.fromEntries(state.pieces)
    }, 'info')
  } else {
    addLog('chessgroundState', 'Chessground not available', 'error')
  }
}

function clearLog() {
  eventLog.value = []
}

// Initialize
onMounted(() => {
  addLog('mounted', 'Component mounted, initializing...', 'info')
  updateLegalMoves()
})
</script>

<style scoped>
.debug-container {
  padding: 20px;
  font-family: monospace;
}

.test-info {
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.test-info pre {
  margin: 0;
  font-size: 12px;
}

.event-log {
  margin-bottom: 20px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.log-entries {
  margin-bottom: 10px;
}

.log-entry {
  display: flex;
  gap: 10px;
  padding: 4px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}

.log-entry.success {
  background: #e8f5e8;
}

.log-entry.error {
  background: #ffeaea;
}

.log-entry.info {
  background: #e8f4fd;
}

.timestamp {
  color: #666;
  min-width: 80px;
}

.event {
  font-weight: bold;
  min-width: 120px;
}

.data {
  flex: 1;
  word-break: break-all;
}

.chess-container {
  margin-bottom: 20px;
}

.debug-board {
  border: 2px solid #333;
  margin: 10px 0;
}

.manual-tests {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.manual-tests button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.manual-tests button:hover {
  background: #0056b3;
}
</style>