import { ImmutableModel, Cmd, NoOp } from 'reelm-core';
import Msg from './Msg';
import { CountModel } from './Model';

function goToPage(model: ImmutableModel<CountModel>, path: string): ImmutableModel<CountModel> {
    window.history.pushState(null, document.title, path);
    return model.set('pathname', path);
}

export default function update(model: ImmutableModel<CountModel>, msg: Msg): [ImmutableModel<CountModel>, Cmd<CountModel, Msg>] {
    switch (msg.type) {
        case 'Navigate':
            return [goToPage(model, msg.path), NoOp];

        case 'NavigationEvent':
            return [model.set('pathname', document.location.pathname), NoOp];

    }
}
