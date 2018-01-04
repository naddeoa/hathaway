import { Program } from 'reelm-core';
import { initialValue, CountModel } from './Model';
import Msg from './Msg';
import update from './Update';
import View from './View';
import { start } from '../';

const el = document.getElementById('react-root');

if (el) {
    console.log(el);
    const program: Program<CountModel, Msg> = {
        init: initialValue,
        update,
        view: View,
        renderTarget: el,
        dev: true
    };

    start(program);
}
