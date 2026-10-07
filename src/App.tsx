import { PlayView } from './components/PlayView'
import { SetupView } from './components/SetupView'
import { useBingoApp } from './hooks/useBingoApp'

function App() {
  const { state, setInput, setShuffle, createBoard, toggleCell, clearMarks, goToSetup, goToPlay } = useBingoApp()

  if (state.view === 'play' && state.board) {
    return <PlayView board={state.board} onToggle={toggleCell} onReset={clearMarks} onBack={goToSetup} />
  }

  return (
    <SetupView
      input={state.input}
      shuffle={state.shuffle}
      hasBoard={state.board !== null}
      onInputChange={setInput}
      onShuffleChange={setShuffle}
      onCreate={createBoard}
      onResume={goToPlay}
    />
  )
}

export default App
