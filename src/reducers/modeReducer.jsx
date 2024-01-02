export function modeReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_MODE':
            return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
        case 'TOGGLE_GRAIN':
            return { ...state, grain: !state.grain };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}