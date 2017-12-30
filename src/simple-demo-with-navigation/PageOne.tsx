import { ViewProps, Dispatch } from 'reelm-core';
import { CountModel } from './Model';
import Msg from './Msg';
import * as React from 'react';

const goToPageTwo = (dispatch: Dispatch<Msg>) => () => {
    dispatch({ type: 'Navigate', path: '/page-two' });
}

const View: React.SFC<ViewProps<CountModel, Msg, {}>> = ({ dispatch}: ViewProps<CountModel, Msg, {}>) => {
    return (
        <div>
            <h1>First page</h1>
            <span>Feel free to press back</span>
            <button onClick={goToPageTwo(dispatch)}>Go to second page</button>
        </div>
    );
}

export default View;