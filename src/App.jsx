import { useContext } from 'react';
import { ModeContext } from './context/ModeContext';
import ShaderUiProvider from './components/ShaderUiProvider'
import './App.css'
import Sidebar from './components/Sidebar';

function App() {

  const { theme, monospace } = useContext(ModeContext);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className={`bg-white text-black dark:bg-black dark:text-white h-screen w-full font-${monospace ? 'monospace' : 'default'}`}>
        <ShaderUiProvider />
        <Sidebar />
      </div>
    </div >
  )
}

export default App
