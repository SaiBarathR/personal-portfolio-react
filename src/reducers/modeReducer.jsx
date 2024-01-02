export function modeReducer(state, action) {
    switch (action.type) {
        case 'SET_MODE':
            return action.mode;
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}