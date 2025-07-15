import { createApp } from 'vue'
import BasicUsage from './examples/basic-usage.vue'

// Import chessground CSS
import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'
import 'chessground/assets/chessground.cburnett.css'

const app = createApp(BasicUsage)
app.mount('#app')