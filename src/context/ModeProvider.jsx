import { useReducer, useEffect } from 'react';
import { ModeContext } from './ModeContext';
import { modeReducer } from '../reducers/modeReducer';

export function ModeProvider({ children }) {
    const savedMode = localStorage.getItem('theme');
    const savedGrain = localStorage.getItem('grain') !== null ? localStorage.getItem('grain') === 'true' : true;
    const preferredMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const [state, dispatch] = useReducer(modeReducer, { theme: savedMode || preferredMode, grain: savedGrain });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const changeHandler = () => dispatch({ type: 'SET_MODE', theme: mediaQuery.matches ? 'dark' : 'light' });

        mediaQuery.addListener(changeHandler);

        return () => {
            mediaQuery.removeListener(changeHandler);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', state.theme);
    }, [state.theme]);

    useEffect(() => {
        localStorage.setItem('grain', state.grain);
    }, [state.grain]);

    return (
        <ModeContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ModeContext.Provider>
    );
}