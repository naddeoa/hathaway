import { Program } from 'reelm-core';
import { initialValue, CountModel } from './Model';
import Msg from './Msg';
import update from './Update';
import View from './View';
import { start } from '../RootView';

const el = document.getElementById('react-root');

if (el) {
    const program: Program<CountModel, Msg> = {
        init: initialValue,
        update,
        view: View,
        renderTarget: el,
        dev: true,
        setupCallbacks: function (dispatch) {
            window.onpopstate = (event: PopStateEvent) => dispatch({ type: 'NavigationEvent', event });
        }
    };

    start(program);
}
