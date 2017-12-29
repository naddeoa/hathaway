import * as React from 'react';
import { ViewProps, Dispatch } from 'reelm-core';
import { CountModel } from './Model';
import Msg from './Msg';

const increment = (dispatch: Dispatch<Msg>) => () => {
    dispatch({ type: 'Increment' });
}

const decrement = (dispatch: Dispatch<Msg>) => () => {
    dispatch({ type: 'Decrement' });
}

const View: React.SFC<ViewProps<CountModel, Msg, {}>> = ({ model, dispatch }: ViewProps<CountModel, Msg, {}>) => {
    return (
        <div>
            <span>Current count: {model.get('count')}</span>
            <br/>
            <button onClick={increment(dispatch)}>Increment</button>
            <button onClick={decrement(dispatch)}>Decrement</button>
        </div>
    );
}

export default View;