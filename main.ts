import { createApp } from 'vue'
import ComprehensiveExample from './examples/comprehensive-example.vue'

// Import chessground CSS
import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'
import 'chessground/assets/chessground.cburnett.css'

const app = createApp(ComprehensiveExample)
app.mount('#app')