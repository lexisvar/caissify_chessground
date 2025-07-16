# 🏰 Caissify Chessground

A modern Vue 3 wrapper for [chessground](https://github.com/lichess-org/chessground) - the chess board component used by lichess.org.

## 🚀 Live Demo

**[Try the Interactive Demo](https://lexisvar.github.io/caissify_chessground/)** - See all features in action!

The demo showcases:
- 📱 **Responsive Design** - Different board sizes (300px, 400px, 500px)
- 🎮 **Interactive Examples** - Programmatic moves, shapes, and FEN manipulation
- 🎨 **Drawing Features** - Circles, arrows, and custom shapes
- ⚡ **Advanced Features** - Animation, themes, and event handling
- 🔄 **Real-time Updates** - Live position editing and undo functionality

## ✨ Features

- 🎯 **Vue 3 + TypeScript** - Built with modern Vue 3 Composition API and full TypeScript support
- 🎨 **Latest Chessground** - Uses chessground v9.2.1 with all latest features
- 🔧 **Reactive Configuration** - All chessground options are reactive Vue props
- 📦 **Tree Shakeable** - Import only what you need
- 🎪 **Event System** - Full Vue event system integration
- 🎭 **Composable API** - Use the `useChessground` composable for advanced usage
- 📱 **Responsive** - Works great on mobile and desktop
- 🎨 **Drawing Support** - Built-in support for arrows, circles, and custom shapes
- ⚡ **Performance Optimized** - Efficient updates and memory management

## 🚀 Installation

```bash
npm install caissify_chessground
# or
yarn add caissify_chessground
# or
pnpm add caissify_chessground
```

## 📖 Basic Usage

### Component Usage

```vue
<template>
  <ChessBoard
    :coordinates="true"
    :movable="{ free: true }"
    @move="onMove"
  />
</template>

<script setup lang="ts">
import { ChessBoard } from 'caissify_chessground'

const onMove = (orig: string, dest: string, capturedPiece?: any) => {
  console.log(`Move: ${orig} -> ${dest}`)
}
</script>
```

### Plugin Installation

```typescript
import { createApp } from 'vue'
import { CaissifyChessgroundPlugin } from 'caissify_chessground'

const app = createApp(App)
app.use(CaissifyChessgroundPlugin)
```

### Composable Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useChessground } from 'caissify_chessground'

const boardElement = ref<HTMLElement>()
const config = ref({
  coordinates: true,
  movable: { free: true }
})

const { chessground, set, toggleOrientation } = useChessground(boardElement, config)
</script>
```

## 🎛️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fen` | `string` | - | Board position in FEN notation |
| `orientation` | `'white' \| 'black'` | `'white'` | Board orientation |
| `turnColor` | `'white' \| 'black'` | - | Current turn color |
| `coordinates` | `boolean` | `true` | Show board coordinates |
| `viewOnly` | `boolean` | `false` | Disable all interactions |
| `movable` | `MovableConfig` | - | Piece movement configuration |
| `premovable` | `PremovableConfig` | - | Premove configuration |
| `animation` | `AnimationConfig` | - | Animation settings |
| `highlight` | `HighlightConfig` | - | Square highlighting |
| `drawable` | `DrawableConfig` | - | Drawing shapes on board |

## 🎪 Events

| Event | Payload | Description |
|-------|---------|-------------|
| `move` | `(orig: string, dest: string, capturedPiece?: Piece)` | Piece moved |
| `select` | `(key: string)` | Square selected |
| `dropNewPiece` | `(piece: Piece, key: string)` | New piece dropped |
| `change` | `()` | Board state changed |

## 🔧 API Methods

Access these methods via template ref:

```vue
<template>
  <ChessBoard ref="board" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const board = ref()

// Available methods:
// board.value.set(config)
// board.value.toggleOrientation()
// board.value.setPieces(pieces)
// board.value.move(orig, dest)
// board.value.selectSquare(key)
// ... and more
</script>
```

## 🎨 Styling

The component includes default chessground CSS. You can customize the appearance:

```css
/* Override chessground styles */
.cg-wrap {
  /* Your custom styles */
}

/* Custom piece themes */
.cg-wrap piece.white.king {
  /* Custom piece styling */
}
```

## 📱 Examples

### Basic Game Board

```vue
<template>
  <ChessBoard
    :coordinates="true"
    :movable="{
      free: false,
      color: 'white',
      dests: possibleMoves
    }"
    :highlight="{
      lastMove: true,
      check: true
    }"
    @move="makeMove"
  />
</template>
```

### Analysis Board with Drawing

```vue
<template>
  <ChessBoard
    :view-only="true"
    :drawable="{
      enabled: true,
      visible: true
    }"
    :highlight="{ lastMove: true }"
    :fen="position"
  />
</template>
```

### Interactive Puzzle Board

```vue
<template>
  <ChessBoard
    :orientation="puzzleOrientation"
    :movable="{
      color: puzzleColor,
      dests: validMoves
    }"
    :animation="{ enabled: true, duration: 300 }"
    @move="checkSolution"
  />
</template>
```

### Programmatic Control

```vue
<template>
  <ChessBoard
    ref="board"
    :coordinates="true"
    @move="onMove"
  />
  <button @click="makeRandomMove">Random Move</button>
  <button @click="addArrow">Add Arrow</button>
  <button @click="resetPosition">Reset</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChessBoard } from 'caissify_chessground'

const board = ref()

const makeRandomMove = () => {
  board.value.move('e2', 'e4')
}

const addArrow = () => {
  board.value.setShapes([{
    orig: 'e2',
    dest: 'e4',
    brush: 'green'
  }])
}

const resetPosition = () => {
  board.value.set({
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  })
}
</script>
```

### Responsive Board Sizes

```vue
<template>
  <div class="board-container">
    <!-- Mobile: 300px -->
    <ChessBoard
      class="mobile-board"
      :coordinates="true"
    />
    
    <!-- Desktop: 500px -->
    <ChessBoard
      class="desktop-board"
      :coordinates="true"
    />
  </div>
</template>

<style>
.mobile-board {
  width: 300px;
  height: 300px;
}

.desktop-board {
  width: 500px;
  height: 500px;
}

@media (max-width: 768px) {
  .desktop-board { display: none; }
}

@media (min-width: 769px) {
  .mobile-board { display: none; }
}
</style>
```

## 🔄 Migration from vue-chessboard

If you're migrating from the old vue-chessboard:

1. **Vue 3 Required** - This package requires Vue 3
2. **New Import** - Import from `caissify_chessground` instead
3. **Props Changes** - Some prop names have changed to match chessground API
4. **Events** - Event names are now camelCase

## 📄 License

GPL-3.0 - Same as chessground

This means:
- ✅ Free for open source projects
- ✅ Free for internal/private use
- ❌ Cannot be used in proprietary software without releasing source code

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Issues

Found a bug? Have a feature request? Please [open an issue](https://github.com/lexisvar/caissify_chessground/issues).

## 🙏 Acknowledgments

- [lichess.org](https://lichess.org) for creating chessground
- [Vue.js](https://vuejs.org) team for the amazing framework
- Chess community for inspiration

---

Made with ♟️ and ❤️