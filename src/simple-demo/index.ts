import { Program } from 'reelm-core';
import { initialValue, CountModel } from './Model';
import Msg from './Msg';
import update from './Update';
import View from './View';
import { start } from '../RootView';

const el = document.getElementById('react-root');
console.log(el);

if (el) {
    console.log(el);
    const program: Program<CountModel, Msg> = {
        init: initialValue,
        update,
        view: View,
        renderTarget: el,
    };

    start(program);
}
