export function modeReducer(state, action) {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, theme: action.theme };
        case 'TOGGLE_GRAIN':
            return { ...state, grain: !state.grain };
        case 'TOGGLE_MONOSPACE':
            return { ...state, monospace: !state.monospace };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}