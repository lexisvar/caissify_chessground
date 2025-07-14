import ChessBoard from './components/ChessBoard.vue'
import { useChessground } from './composables/useChessground'

// Export component
export { ChessBoard }
export default ChessBoard

// Export composable
export { useChessground }

// Export types
export type {
  Api,
  Config,
  Key,
  Piece,
  PiecesDiff,
  Role,
  Color,
  ChessBoardProps,
  ChessBoardEmits,
  UseChessgroundReturn
} from './types/chessground'

// Vue plugin installation
export const CaissifyChessgroundPlugin = {
  install(app: any) {
    app.component('ChessBoard', ChessBoard)
  }
}