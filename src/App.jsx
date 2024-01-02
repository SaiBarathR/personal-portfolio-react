import { useContext } from 'react';
import ShaderUiProvider from './components/ShaderUiProvider'
import { ModeContext } from './context/ModeContext';
import './App.css'

function App() {

  const { mode, dispatch } = useContext(ModeContext);
  const toggleMode = () => {
    dispatch({ type: 'SET_MODE', mode: mode === 'dark' ? 'light' : 'dark' })
  }

  return (
    <div className={mode === 'dark' ? 'dark bg-black text-white' : 'bg-white text-black h-screen w-full'}>
      <div className=' flex gap-4'>
        <button onClick={toggleMode} className='  rounded-md z-[1000]'>
          Mode : {mode}
        </button>
      </div>
      <ShaderUiProvider />
    </div>
  )
}

export default App
