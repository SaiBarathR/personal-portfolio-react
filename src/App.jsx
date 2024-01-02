import { useContext } from 'react';
import { ModeContext } from './context/ModeContext';
import ShaderUiProvider from './components/ShaderUiProvider'
import './App.css'
import Sidebar from './components/Sidebar';

function App() {

  const { theme } = useContext(ModeContext);

  return (
    <div className={theme === 'dark' ? 'dark bg-black text-white' : 'bg-white text-black h-screen w-full'}>
      <ShaderUiProvider />
      <Sidebar />
    </div>
  )
}

export default App
