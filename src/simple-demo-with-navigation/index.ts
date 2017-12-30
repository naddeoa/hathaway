import { Program } from 'reelm-core';
import { initialValue, CountModel } from './Model';
import Msg from './Msg';
import update from './Update';
import View from './View';
import { start } from '../RootView';
import { PlatformSpecificArgs } from '../index';

const el = document.getElementById('react-root');

if (el) {
    const program: Program<CountModel, Msg> = {
        init: initialValue,
        update,
        view: View,
        renderTarget: el,
        dev: true
    };

    const args: PlatformSpecificArgs<Msg> = {
        navigationMsg: function (event) {
            return { type: 'NavigationEvent', event };
        }
    }

    start(program, args);
}
