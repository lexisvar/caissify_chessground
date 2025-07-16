import { createApp } from 'vue'
import TestMoves from './test-moves.vue'

// Import chessground CSS
import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'
import 'chessground/assets/chessground.cburnett.css'

const app = createApp(TestMoves)
app.mount('#app')