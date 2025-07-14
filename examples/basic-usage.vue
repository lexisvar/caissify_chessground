<template>
  <div class="chess-app">
    <h1>Caissify Chessground Example</h1>
    
    <div class="board-container">
      <ChessBoard
        ref="chessBoard"
        :coordinates="true"
        :movable="movableConfig"
        :highlight="{ lastMove: true, check: true }"
        @move="onMove"
        @select="onSelect"
      />
    </div>
    
    <div class="controls">
      <button @click="flipBoard">Flip Board</button>
      <button @click="resetBoard">Reset Position</button>
      <button @click="toggleFreeMode">{{ freeMode ? 'Disable' : 'Enable' }} Free Mode</button>
    </div>
    
    <div class="info">
      <h3>Move History:</h3>
      <div class="move-list">
        <div v-for="(move, index) in moves" :key="index" class="move">
          {{ index + 1 }}. {{ move.from }} → {{ move.to }}
          <span v-if="move.captured" class="captured">(captured {{ move.captured.role }})</span>
        </div>
      </div>
      
      <h3>Selected Square:</h3>
      <div class="selected">{{ selectedSquare || 'None' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChessBoard } from '../src/index'
import type { Key, Piece } from '../src/types/chessground'

// Component state
const chessBoard = ref()
const freeMode = ref(false)
const selectedSquare = ref<Key | null>(null)
const moves = ref<Array<{ from: Key, to: Key, captured?: Piece }>>([])

// Computed configuration
const movableConfig = computed(() => ({
  free: freeMode.value,
  color: freeMode.value ? 'both' : 'white'
}))

// Event handlers
const onMove = (from: Key, to: Key, captured?: Piece) => {
  moves.value.push({ from, to, captured })
  console.log(`Move: ${from} → ${to}`, captured ? `(captured ${captured.role})` : '')
}

const onSelect = (square: Key) => {
  selectedSquare.value = square
  console.log(`Selected: ${square}`)
}

// Control methods
const flipBoard = () => {
  if (chessBoard.value) {
    chessBoard.value.toggleOrientation()
  }
}

const resetBoard = () => {
  if (chessBoard.value) {
    // Reset to starting position
    chessBoard.value.set({
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    })
    moves.value = []
    selectedSquare.value = null
  }
}

const toggleFreeMode = () => {
  freeMode.value = !freeMode.value
}
</script>

<style scoped>
.chess-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.board-container {
  width: 400px;
  height: 400px;
  margin: 20px auto;
  border: 2px solid #333;
  border-radius: 4px;
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #0056b3;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.move-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.move {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}

.move:last-child {
  border-bottom: none;
}

.captured {
  color: #dc3545;
  font-weight: bold;
}

.selected {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
  font-family: monospace;
  font-size: 16px;
  text-align: center;
}

h1 {
  text-align: center;
  color: #333;
}

h3 {
  margin-top: 0;
  color: #555;
}
</style>