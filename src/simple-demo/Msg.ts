export interface Increment {
    type: 'Increment';
}

export interface Decrement {
    type: 'Decrement';
}

export interface Undo {
    type: 'Undo';
}

export type Msg = Increment | Decrement | Undo;

export default Msg;
