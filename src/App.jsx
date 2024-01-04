import { useContext } from 'react';
import { ModeContext } from './context/ModeContext';
import ShaderUiProvider from './components/ShaderUiProvider'
import './App.css'
import Sidebar from './components/Sidebar';
import PortfolioContent from './components/PortfolioContent';

function App() {

  const { theme, monospace } = useContext(ModeContext);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className={`bg-[#e6e6e6] text-black dark:bg-black dark:text-white h-screen w-full text-default ${monospace ? 'font-NeueMontrealMono' : 'font-NeueMontreal'}`}>
        <ShaderUiProvider />
        <PortfolioContent />
        <Sidebar />
      </div>
    </div >
  )
}

export default App
