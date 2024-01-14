import { useContext, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { portfolioContentRouter } from './routes/router';
import { ModeContext } from './context/ModeContext';
import ShaderUiProvider from './components/ShaderUiProvider'
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import './App.css'

function App() {

  const { theme, monospace } = useContext(ModeContext);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {showWelcome && <WelcomeScreen />}
      <div className={`bg-[#e6e6e6] fixed text-black dark:bg-black dark:text-white h-screen w-full text-default ${monospace ? 'font-NeueMontrealMono' : 'font-NeueMontreal'}`}>
        <ShaderUiProvider />
        <RouterProvider router={portfolioContentRouter} />
        <Sidebar />
      </div>
    </div >
  )
}

export default App
