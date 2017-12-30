import { ImmutableModel, Cmd, NoOp } from 'reelm-core';
import Msg from './Msg';
import { CountModel } from './Model';

function saveState(model: ImmutableModel<CountModel>): ImmutableModel<CountModel> {
    return model.set('history', model.get('history').unshift(model));
}

function popState(model: ImmutableModel<CountModel>): ImmutableModel<CountModel> {
    return model.get('history').first() || model;
}

export default function update(model: ImmutableModel<CountModel>, msg: Msg): [ImmutableModel<CountModel>, Cmd<CountModel, Msg>] {
    switch (msg.type) {
        case 'Increment':
            return [saveState(model).set('count', model.get('count') + 1), NoOp];
        case 'Decrement':
            if (model.get('count') !== 0) {
                return [saveState(model).set('count', model.get('count') - 1), NoOp];
            } else {
                return [model, NoOp];
            }
        case 'Undo':
            return [popState(model), NoOp];
    }
}
