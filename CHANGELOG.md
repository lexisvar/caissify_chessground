# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.9] - 2025-01-16

### 🔧 Fixed
- **CRITICAL**: Fixed `@move` event not firing due to chessground instance being destroyed during FEN updates
- **CRITICAL**: Fixed movable configuration being lost when board position changes
- Fixed chess pieces becoming unresponsive after FEN position updates
- Fixed reactive `movable.dests` configuration being cleared during board updates

### 🚀 Improved
- Enhanced FEN update mechanism to preserve movable configuration and event handlers
- Improved chessground instance lifecycle management to avoid unnecessary destruction/recreation
- Better state preservation during board position changes

### 📝 Technical Details
- **useChessground.ts**: Modified `set()` function (lines 125-159) to use `setPieces()` instead of destroying/recreating chessground instance
- **useChessground.ts**: Added configuration merging to preserve reactive movable state during FEN updates
- **useChessground.ts**: Enabled deep watching for reactive configuration updates (`{ deep: true }`)

### 🐛 Bug Context
This release fixes a critical regression where:
1. The `set()` function was destroying and recreating the chessground instance during FEN updates
2. This caused the reactive `movable.dests` configuration (containing legal moves) to be lost
3. Without legal moves, pieces became unselectable and the `@move` event never fired
4. The chess board appeared "frozen" and unresponsive to user interaction

### 💔 Breaking Changes
None - this is a backward-compatible bug fix.

### 🧪 Testing
- Added comprehensive test component `debug-comprehensive-test.vue` for thorough event debugging
- Verified `@move` event fires correctly with legal move validation
- Confirmed chess board remains interactive after FEN position updates
- Tested with chess.js integration patterns

---

## [1.0.8] - 2025-01-16

### 🔧 Fixed
- **CRITICAL**: Fixed `@move` event not firing when using custom `movable.dests` configuration
- **CRITICAL**: Fixed reactive updates to `movable` configuration being ignored due to shallow watching
- Fixed chess pieces becoming unselectable when providing legal moves via `movable.dests`
- Fixed destination square highlighting not working with custom move destinations

### 🚀 Improved
- Enhanced reactivity system to properly detect changes to nested `movable` configuration properties
- Improved move event handling to respect user-provided legal move destinations
- Better integration with chess engines like chess.js for legal move validation

### 📝 Technical Details
- **ChessBoard.vue**: Modified destination handling logic to prioritize user-provided `movable.dests` over default `getBasicDests()`
- **useChessground.ts**: Changed configuration watcher from shallow (`deep: false`) to deep (`deep: true`) watching
- Added comprehensive test components for debugging and verification

### 🐛 Bug Context
This release fixes a critical issue where:
1. User-calculated legal moves from chess engines were being overridden by generic destinations
2. Reactive updates to the movable configuration weren't propagating to the chessground instance
3. The `@move` event never fired because pieces couldn't be properly selected or moved

### 💔 Breaking Changes
None - this is a backward-compatible bug fix.

### 🧪 Testing
- Added `debug-chessboard.vue` for diagnostic testing
- Added `test-fix-verification.vue` for fix validation
- Verified compatibility with existing chess.js integration patterns

---

## [1.0.7] - Previous Release

### Features
- Vue 3 wrapper for chessground
- TypeScript support
- Reactive chess board component
- Comprehensive chess board configuration options
- Event handling for moves, selections, and board changes
- FEN position support
- Drawing and annotation capabilities
- Coordinate display with perfect scaling
- Multiple board size support (300px, 400px, 500px)

### Components
- `ChessBoard.vue` - Main chess board component
- `useChessground.ts` - Composable for chessground integration
- Comprehensive type definitions

### Known Issues (Fixed in 1.0.8)
- `@move` event not firing with custom `movable.dests` ❌
- Reactive configuration updates not working ❌
- Chess pieces unselectable with legal move validation ❌

---

## Migration Guide

### From 1.0.7 to 1.0.8

No code changes required! This is a bug fix release that makes existing code work as expected.

**Before (broken in 1.0.7):**
```vue
<template>
  <ChessBoard
    :movable="movableConfig"
    @move="onMove"  <!-- This didn't fire -->
  />
</template>

<script setup>
const movableConfig = reactive({
  free: false,
  color: 'white',
  dests: new Map(), // This was ignored
  showDests: true
})

// This never got called
function onMove(from, to) {
  console.log('Move:', from, to) // ❌ Never logged
}
</script>
```

**After (working in 1.0.8):**
```vue
<template>
  <ChessBoard
    :movable="movableConfig"
    @move="onMove"  <!-- This now fires! -->
  />
</template>

<script setup>
const movableConfig = reactive({
  free: false,
  color: 'white',
  dests: new Map(), // This is now respected
  showDests: true
})

// This now gets called correctly
function onMove(from, to) {
  console.log('Move:', from, to) // ✅ Works!
}
</script>
```

### Integration with Chess Engines

This fix enables proper integration with chess engines:

```javascript
import { Chess } from 'chess.js'

const updateLegalMoves = () => {
  const chess = new Chess(currentFen.value)
  const moves = chess.moves({ verbose: true })
  
  // Clear existing destinations
  movableConfig.dests.clear()
  
  // This now works correctly in 1.0.8!
  moves.forEach(move => {
    const from = move.from
    const to = move.to
    
    if (!movableConfig.dests.has(from)) {
      movableConfig.dests.set(from, [])
    }
    movableConfig.dests.get(from).push(to)
  })
  
  // Set current player
  movableConfig.color = chess.turn() === 'w' ? 'white' : 'black'
}
```

## Support

- **Repository**: https://github.com/lexisvar/caissify_chessground
- **Issues**: https://github.com/lexisvar/caissify_chessground/issues
- **License**: GPL-3.0

## Contributors

- **lexisvar** - Original author and maintainer
- **Kilo Code** - Bug diagnosis and fixes for v1.0.8