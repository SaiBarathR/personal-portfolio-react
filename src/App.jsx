import { useContext } from 'react';
import ShaderUiProvider from './components/ShaderUiProvider'
import { ModeContext } from './context/ModeContext';
import './App.css'

function App() {

  const { theme, dispatch } = useContext(ModeContext);
  const toggleMode = () => dispatch({ type: 'TOGGLE_MODE' });

  return (
    <div className={theme === 'dark' ? 'dark bg-black text-white' : 'bg-white text-black h-screen w-full'}>
      <div className=' flex gap-4'>
        <button onClick={toggleMode} className='  rounded-md z-[1000]'>
          theme : {theme}
        </button>
      </div>
      <ShaderUiProvider />
    </div>
  )
}

export default App
