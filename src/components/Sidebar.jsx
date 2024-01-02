import { useContext } from "react";
import { ModeContext } from "../context/ModeContext";

export default function Sidebar() {

    const { grain, dispatch } = useContext(ModeContext);
    const toggleGrain = () => dispatch({ type: 'TOGGLE_GRAIN' });
    const toggleMode = (theme) => () => dispatch({ type: 'SET_THEME', theme });

    return (
        <div className=' flex gap-4 items-center h-10'>
            <button onClick={toggleMode('light')} className='flex gap-2 items-center'>
                <span className={`w-3 h-3  border border-white bg-black `} />
                Light
            </button>
            <button onClick={toggleMode('dark')} className='flex gap-2 items-center'>
                <span className={`w-3 h-3  border  border-black bg-white dark:bg-white`} />
                Dark
            </button>
            <button onClick={toggleGrain} className='flex gap-2 items-center'>
                <span className={`w-3 h-3  border border-black  dark:border-white  ${grain ? 'bg-black dark:bg-white' : ''}`}>
                </span>
                grain : {grain ? 'on' : 'off'}
            </button>
        </div >
    )
}
