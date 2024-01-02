import { useReducer, useEffect } from 'react';
import { ModeContext } from './ModeContext';
import { modeReducer } from '../reducers/modeReducer';

export function ModeProvider({ children }) {
    const savedMode = localStorage.getItem('mode');
    const preferredMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const [mode, dispatch] = useReducer(modeReducer, savedMode || preferredMode);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const changeHandler = () => dispatch({ type: 'SET_MODE', mode: mediaQuery.matches ? 'dark' : 'light' });

        mediaQuery.addListener(changeHandler);

        return () => {
            mediaQuery.removeListener(changeHandler);
        };
    }, []);

    return (
        <ModeContext.Provider value={{ mode, dispatch }}>
            {children}
        </ModeContext.Provider>
    );
}