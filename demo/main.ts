import { Chessground } from 'chessground'

// Store board instances
const boards: Map<string, any> = new Map()

// Starting position FEN
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

// Test position FEN (Italian Game)
const TEST_FEN = 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4'

// Helper function to convert FEN to pieces
function fenToPieces(fen: string) {
  const pieces = new Map()
  const rows = fen.split(' ')[0].split('/')
  
  for (let rank = 0; rank < 8; rank++) {
    let file = 0
    for (const char of rows[rank]) {
      if (char >= '1' && char <= '8') {
        file += parseInt(char)
      } else {
        const color = char === char.toUpperCase() ? 'white' : 'black'
        const role = char.toLowerCase()
        const roleMap: Record<string, string> = {
          'p': 'pawn', 'r': 'rook', 'n': 'knight',
          'b': 'bishop', 'q': 'queen', 'k': 'king'
        }
        const square = String.fromCharCode(97 + file) + (8 - rank)
        pieces.set(square, { role: roleMap[role], color })
        file++
      }
    }
  }
  return pieces
}

// Initialize a single board
function initBoard(elementId: string, config: any = {}) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.warn(`Element ${elementId} not found`)
    return null
  }

  const defaultConfig = {
    coordinates: true,
    movable: {
      free: false,
      color: 'white',
      showDests: true
    },
    draggable: {
      enabled: true,
      showGhost: true
    },
    highlight: {
      lastMove: true,
      check: true
    },
    animation: {
      enabled: true,
      duration: 200
    }
  }

  const board = Chessground(element, { ...defaultConfig, ...config })
  boards.set(elementId, board)
  
  // Set starting position
  board.set({
    fen: STARTING_FEN
  })
  
  return board
}

// Initialize all boards when DOM is loaded
function initAllBoards() {
  console.log('Initializing all boards...')
  
  // Size showcase boards
  initBoard('board-300')
  initBoard('board-400')
  initBoard('board-500')
  
  // Demo boards
  initBoard('demo-basic', {
    movable: { free: false, color: 'white' }
  })
  
  initBoard('demo-free', {
    movable: { free: true, color: 'both' }
  })
  
  initBoard('demo-analysis', {
    viewOnly: false,
    drawable: { enabled: true, visible: true }
  })
  
  updateStatus('All boards initialized successfully!')
}

// Update status message
function updateStatus(message: string) {
  const statusEl = document.getElementById('status')
  if (statusEl) {
    statusEl.textContent = message
  }
}

// Global functions for HTML buttons
declare global {
  interface Window {
    resetBoard: (boardId: string) => void
    resetAllBoards: () => void
    flipBoard: (boardId: string) => void
    flipAllBoards: () => void
    loadTestPosition: () => void
    addRandomPieces: (boardId: string) => void
    loadAnalysisPosition: (boardId: string) => void
    toggleViewOnly: (boardId: string) => void
  }
}

// Reset a specific board
window.resetBoard = (boardId: string) => {
  const board = boards.get(boardId)
  if (board) {
    board.set({
      fen: STARTING_FEN,
      lastMove: undefined,
      selected: undefined
    })
    updateStatus(`${boardId} reset to starting position`)
  }
}

// Reset all boards
window.resetAllBoards = () => {
  boards.forEach((board, boardId) => {
    board.set({
      fen: STARTING_FEN,
      lastMove: undefined,
      selected: undefined
    })
  })
  updateStatus('All boards reset to starting position')
}

// Flip a specific board
window.flipBoard = (boardId: string) => {
  const board = boards.get(boardId)
  if (board) {
    board.toggleOrientation()
    updateStatus(`${boardId} flipped`)
  }
}

// Flip all boards
window.flipAllBoards = () => {
  boards.forEach((board, boardId) => {
    board.toggleOrientation()
  })
  updateStatus('All boards flipped')
}

// Load test position on all size showcase boards
window.loadTestPosition = () => {
  const showcaseBoards = ['board-300', 'board-400', 'board-500']
  showcaseBoards.forEach(boardId => {
    const board = boards.get(boardId)
    if (board) {
      board.set({
        fen: TEST_FEN,
        lastMove: ['e2', 'e4']
      })
    }
  })
  updateStatus('Test position loaded on all showcase boards')
}

// Add random pieces to a board
window.addRandomPieces = (boardId: string) => {
  const board = boards.get(boardId)
  if (board) {
    // Clear board first
    board.set({
      fen: '8/8/8/8/8/8/8/8 w - - 0 1'
    })
    
    // Add random pieces
    const pieces = new Map()
    const squares = ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8', 'a8', 'h1']
    const roles = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']
    const colors = ['white', 'black']
    
    squares.forEach(square => {
      pieces.set(square, {
        role: roles[Math.floor(Math.random() * roles.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    })
    
    setTimeout(() => {
      board.setPieces(pieces)
    }, 100)
    
    updateStatus(`Random pieces added to ${boardId}`)
  }
}

// Load analysis position
window.loadAnalysisPosition = (boardId: string) => {
  const board = boards.get(boardId)
  if (board) {
    board.set({
      fen: TEST_FEN,
      lastMove: ['e2', 'e4']
    })
    updateStatus(`Analysis position loaded on ${boardId}`)
  }
}

// Toggle view only mode
window.toggleViewOnly = (boardId: string) => {
  const board = boards.get(boardId)
  if (board) {
    const currentViewOnly = board.state.viewOnly
    board.set({
      viewOnly: !currentViewOnly
    })
    updateStatus(`${boardId} view only: ${!currentViewOnly ? 'enabled' : 'disabled'}`)
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing boards...')
  setTimeout(initAllBoards, 100)
})

// Also try to initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllBoards)
} else {
  setTimeout(initAllBoards, 100)
}

export {}