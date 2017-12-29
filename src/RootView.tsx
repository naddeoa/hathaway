import * as React from 'react';
import * as ReactDom from 'react-dom';
import { List } from 'immutable';
import { Switchable, RootViewState, RootViewProps, Program, ViewProps, Cmd, ImmutableModel, Model } from './ReElm';

function toJS(a: any): {} | string {
    return a.toJS ? a.toJS() : JSON.stringify(a);
}

class RootView<Defaults extends Model, Msg extends Switchable> extends React.Component<RootViewProps<Defaults, Msg>, RootViewState<Defaults, Msg>>  {

    readonly program: Program<Defaults, Msg>;

    constructor({ program }: RootViewProps<Defaults, Msg>) {
        super({ program });
        this.program = program;
        const InitialView: React.SFC<ViewProps<Defaults, Msg, any>> = program.view;
        this.state = { model: program.init, viewStack: List([{ view: InitialView }]) };

        this.processCmd = this.processCmd.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.onBack = this.onBack.bind(this);
        this.updateModel = this.updateModel.bind(this);
        // BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    onBack(): boolean {
        if (this.state.viewStack.size === 1) {
            return false;
        }

        const viewStack = this.state.viewStack.shift();
        this.setState({ viewStack });
        return true
    }

    shouldComponentUpdate(_nextProps: {}, nextState: RootViewState<Defaults, Msg>) {
        return nextState.model !== this.state.model || nextState.viewStack !== this.state.viewStack;
    }

    updateModel(model: ImmutableModel<Defaults>, callback?: () => any) {
        if (model !== this.state.model) {
            console.log('MODEL CHANGE  -- ', toJS(model));
        }
        this.setState({ model }, callback);
    }

    dispatch(msg: Msg | Msg[]) {
        console.log('DISPATCHED MSG --', msg);
        if (Array.isArray(msg)) {

            let updatedModel = this.state.model;
            let commands: Cmd<Defaults, Msg>[] = [];
            for (let m of msg) {
                const [model, cmd] = this.program.update(updatedModel, m);
                updatedModel = model;
                commands.push(cmd);
            }
            this.updateModel(updatedModel, () => this.processCmd({ type: 'BatchCmd', commands }));
        } else {
            const [model, cmd] = this.program.update(this.state.model, msg);
            this.updateModel(model, () => this.processCmd(cmd));
        }
    }

    processCmd(cmd: Cmd<Defaults, Msg>): boolean {
        console.log('PROCESSING CMD --', cmd);

        switch (cmd.type) {
            case 'BatchCmd':
                cmd.commands.forEach(c => this.processCmd(c))
                return true;

            case 'NavigateTo':
                const viewStack = this.state.viewStack.unshift({ view: cmd.view, componentProps: cmd.props });
                this.setState({ viewStack });
                return true;

            case 'AsyncModelUpdate':
                cmd.promise.then((result: any) => {
                    const model = cmd.updateFunction(this.state.model, result);
                    if (model === null) {
                        cmd.retryFunction && cmd.retryFunction(this.state.model, result);
                    } else {
                        this.updateModel(model);
                    }
                });
                return true;

            case 'AsyncCmd':
                cmd.promise.then((result: any) => {
                    const successFunctionResult = cmd.successFunction(this.dispatch, this.state.model, result);
                    if (successFunctionResult === null) {
                        cmd.errorFunction && cmd.errorFunction(this.dispatch, this.state.model, result);
                    } else {
                        const [model, cmd] = successFunctionResult;
                        this.updateModel(model);
                        this.processCmd(cmd)
                    }
                });
                return true;
            case 'NoOp':
                return true;
        }
    }

    render() {
        const { view, componentProps } = this.state.viewStack.first();
        const CurrentView = view;
        return (
            <div>
                <CurrentView dispatch={this.dispatch} model={this.state.model} componentProps={componentProps} />
            </div>
        );
    }
}

export function start<M extends Model, Msg extends Switchable>(program: Program<M, Msg>) {
    ReactDom.render(React.createElement(RootView, { program }), program.renderTarget);
}
