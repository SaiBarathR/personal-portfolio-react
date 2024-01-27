import { useContext } from "react";
import { ModeContext } from "../context/ModeContext";

export default function Sidebar() {

    const { grain, monospace, dispatch } = useContext(ModeContext);
    const toggleGrain = () => dispatch({ type: 'TOGGLE_GRAIN' });
    // const toggleMode = (theme) => () => dispatch({ type: 'SET_THEME', theme });
    const toggleMonospace = () => dispatch({ type: 'TOGGLE_MONOSPACE' });

    const CommonButton = ({ children, onClick, spanClassName = null }) => (
        <div onClick={onClick}
            className='flex gap-1 items-center uppercase cursor-pointer [writing-mode:vertical-lr] transform rotate-180'
        >
            <span className={spanClassName + `  mr-[2px] w-3 h-3  border `} />
            {children}
        </div>
    )


    return (
        <div className='z-10 items-center fixed bottom-5 left-0 flex flex-col gap-4'>
            <CommonButton onClick={toggleMonospace} spanClassName={`border-black  dark:border-white  ${monospace ? 'bg-black dark:bg-white' : ''}`}>
                Monospaced
            </CommonButton>
            <CommonButton onClick={toggleGrain} spanClassName={`border-black  dark:border-white  ${grain ? 'bg-black dark:bg-white' : ''}`}>
                Grain
            </CommonButton>
            {/* <CommonButton onClick={toggleMode('dark')} spanClassName={`border-black bg-white dark:bg-white`} >
                Dark
            </CommonButton>
            <CommonButton onClick={toggleMode('light')} spanClassName={`border-white bg-black`} >
                Light
            </CommonButton> */}
        </div >
    )
}
