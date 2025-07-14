# 🏰 Caissify Chessground

A modern Vue 3 wrapper for [chessground](https://github.com/lichess-org/chessground) - the chess board component used by lichess.org.

## ✨ Features

- 🎯 **Vue 3 + TypeScript** - Built with modern Vue 3 Composition API and full TypeScript support
- 🎨 **Latest Chessground** - Uses chessground v9.2.1 with all latest features
- 🔧 **Reactive Configuration** - All chessground options are reactive Vue props
- 📦 **Tree Shakeable** - Import only what you need
- 🎪 **Event System** - Full Vue event system integration
- 🎭 **Composable API** - Use the `useChessground` composable for advanced usage
- 📱 **Responsive** - Works great on mobile and desktop

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

### Analysis Board

```vue
<template>
  <ChessBoard
    :view-only="true"
    :drawable="{ enabled: true }"
    :highlight="{ lastMove: true }"
    :fen="position"
  />
</template>
```

### Puzzle Board

```vue
<template>
  <ChessBoard
    :orientation="puzzleOrientation"
    :movable="{ 
      color: puzzleColor,
      dests: validMoves 
    }"
    @move="checkSolution"
  />
</template>
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

Found a bug? Have a feature request? Please [open an issue](https://github.com/yourusername/caissify_chessground/issues).

## 🙏 Acknowledgments

- [lichess.org](https://lichess.org) for creating chessground
- [Vue.js](https://vuejs.org) team for the amazing framework
- Chess community for inspiration

---

Made with ♟️ and ❤️