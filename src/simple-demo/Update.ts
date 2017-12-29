import { ImmutableModel, Cmd, NoOp } from '../ReElm';
import Msg from './Msg';
import { CountModel } from './Model';

export default function update(model: ImmutableModel<CountModel>, msg: Msg): [ImmutableModel<CountModel>, Cmd<CountModel, Msg>] {
    switch (msg.type) {
        case 'Increment':
            return [model.set('count', model.get('count') + 1), NoOp];
        case 'Decrement':
            if (model.get('count') !== 0) {
                return [model.set('count', model.get('count') - 1), NoOp];
            } else {
                return [model, NoOp];
            }
    }
}
