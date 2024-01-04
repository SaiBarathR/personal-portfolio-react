import { useContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import { portfolioContentRouter } from './routes/router';
import { ModeContext } from './context/ModeContext';
import ShaderUiProvider from './components/ShaderUiProvider'
import Sidebar from './components/Sidebar';
import './App.css'

function App() {

  const { theme, monospace } = useContext(ModeContext);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className={`bg-[#e6e6e6] text-black dark:bg-black dark:text-white h-screen w-full text-default ${monospace ? 'font-NeueMontrealMono' : 'font-NeueMontreal'}`}>
        <ShaderUiProvider />
        <RouterProvider router={portfolioContentRouter} />
        <Sidebar />
      </div>
    </div >
  )
}

export default App
