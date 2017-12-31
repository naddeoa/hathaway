import * as React from 'react';
import { ViewProps } from 'reelm-core';
import { MyModel } from './Model';
import Msg from './Msg';
import SearchBox from './views/SearchBox';
import UserProfile from './views/UserProfile';
import Repos from './views/Repos';

const View: React.SFC<ViewProps<MyModel, Msg, {}>> = ({ model, dispatch }: ViewProps<MyModel, Msg, {}>) => {
    return (
        <div className="root">
            <SearchBox model={model} dispatch={dispatch} componentProps={null} />
            <UserProfile model={model} dispatch={dispatch} componentProps={null} />
            <Repos model={model} dispatch={dispatch} componentProps={null} />
        </div>
    );
}

export default View;