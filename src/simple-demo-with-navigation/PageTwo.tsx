import { ViewProps, Dispatch } from 'reelm-core';
import { CountModel } from './Model';
import Msg from './Msg';
import * as React from 'react';

const goToPageOne = (dispatch: Dispatch<Msg>) => () => {
    dispatch({ type: 'Navigate', path: '/page-one' });
}

const View: React.SFC<ViewProps<CountModel, Msg, {}>> = ({ dispatch }: ViewProps<CountModel, Msg, {}>) => {
    return (
        <div>
            <h1>Second page</h1>
            <span>Feel free to press back</span>
            <button onClick={goToPageOne(dispatch)}>Go to first page</button>
        </div>
    );
}

export default View;