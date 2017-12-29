export interface Increment {
    type: 'Increment';
}

export interface Decrement {
    type: 'Decrement';
}

export type Msg = Increment | Decrement;

export default Msg;
