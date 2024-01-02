import { useContext } from "react";
import { ModeContext } from "../context/ModeContext";

export default function Sidebar() {

    const { theme, grain, dispatch } = useContext(ModeContext);
    const toggleMode = () => dispatch({ type: 'TOGGLE_MODE' });
    const toggleGrain = () => dispatch({ type: 'TOGGLE_GRAIN' });

    return (
        <div className=' flex gap-4'>
            <button onClick={toggleMode} className='  rounded-md z-[1000]'>
                theme : {theme}
            </button>
            <button onClick={toggleGrain} className='  rounded-md z-[1000]'>
                grain : {grain ? 'on' : 'off'}
            </button>
        </div>
    )
}
