<template>
  <div class="test-container">
    <h2>FEN Prop Test</h2>
    
    <div class="test-section">
      <h3>Test 1: Starting Position</h3>
      <ChessBoard 
        :fen="startingFen"
        :coordinates="true"
        coordinates-position="outside"
      />
      <p>FEN: {{ startingFen }}</p>
    </div>
    
    <div class="test-section">
      <h3>Test 2: Middle Game Position</h3>
      <ChessBoard 
        :fen="middleGameFen"
        :coordinates="true"
        coordinates-position="outside"
      />
      <p>FEN: {{ middleGameFen }}</p>
    </div>
    
    <div class="test-section">
      <h3>Test 3: Dynamic FEN Change</h3>
      <ChessBoard 
        :fen="dynamicFen"
        :coordinates="true"
        coordinates-position="outside"
      />
      <button @click="changeFen">Change Position</button>
      <p>FEN: {{ dynamicFen }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChessBoard } from './src/index'

const startingFen = ref('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
const middleGameFen = ref('r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4')
const dynamicFen = ref('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

const testPositions = [
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
  'rnbqkb1r/pp1ppppp/5n2/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq c6 0 3',
  '8/8/8/8/8/8/8/8 w - - 0 1'
]

let currentIndex = 0

const changeFen = () => {
  currentIndex = (currentIndex + 1) % testPositions.length
  dynamicFen.value = testPositions[currentIndex]
}
</script>

<style scoped>
.test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.test-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 15px;
}

.chessground {
  width: 400px !important;
  height: 400px !important;
  margin: 20px auto;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
  margin: 10px;
}

button:hover {
  background: #0056b3;
}

p {
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  word-break: break-all;
  font-size: 12px;
  margin-top: 15px;
}
</style>