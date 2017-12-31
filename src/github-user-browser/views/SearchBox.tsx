import * as React from 'react';
import { ViewProps, Dispatch } from 'reelm-core';
import { MyModel } from '../Model';
import Msg from '../Msg';
import { KeyboardEvent } from 'react';

const onEnter = (dispatch: Dispatch<Msg>) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        dispatch({ type: 'OnUsernameSearch' })
    }
}

const onChange = (dispatch: Dispatch<Msg>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'OnUsernameSearchChanged', text: event.target.value });
}

const View: React.SFC<ViewProps<MyModel, Msg, null>> = ({ model, dispatch }: ViewProps<MyModel, Msg, null>) => {
    return (
        <div className="search-container">
            <input className="user-search" placeholder="Search for a github user" onKeyUp={onEnter(dispatch)} onChange={onChange(dispatch)} value={model.get('usernameSearchText')} />
        </div>
    );
}

export default View;