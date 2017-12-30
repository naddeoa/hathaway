export interface Navigate {
    type: 'Navigate',
    path: string
}

export interface NavigationEvent {
    type: 'NavigationEvent',
    event: PopStateEvent
}

export type Msg = Navigate | NavigationEvent;

export default Msg;
