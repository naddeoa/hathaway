import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Switchable, RootViewState, RootViewProps, Program, Cmd, ImmutableModel, Model } from 'reelm-core';

/**
 * Print to the console for debugging purposes.
 * @param a Some object. Probably an ImmutableJS object.
 */
function debugLog<Defaults extends Model, Msg extends Switchable>(program: Program<Defaults, Msg>, message: string, a: any) {
    // Make sure not to call immutable.toJS(). It will slow the application way down really fast.
    if (program.dev) {
        const objectMessage = a.toObject ? a.toObject() : JSON.stringify(a);
        console.log(`${message} -- `, objectMessage);
    }
}

class RootView<Defaults extends Model, Msg extends Switchable> extends React.Component<RootViewProps<Defaults, Msg, {}>, RootViewState<Defaults>>  {

    readonly program: Program<Defaults, Msg>;
    state: RootViewState<Defaults>

    constructor({ program, platformSpecificArgs }: RootViewProps<Defaults, Msg, {}>) {
        super({ program, platformSpecificArgs });
        this.program = program;
        this.state = { model: program.init };

        this.processCmd = this.processCmd.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.updateModel = this.updateModel.bind(this);
    }

    componentWillMount() {
        this.program.setupCallbacks && this.program.setupCallbacks(this.dispatch);
    }

    componentWillUnmount() {
        this.program.setupCallbacks && this.program.setupCallbacks(this.dispatch);
    }

    shouldComponentUpdate(_nextProps: {}, nextState: RootViewState<Defaults>) {
        return nextState.model !== this.state.model;
    }

    updateModel(model: ImmutableModel<Defaults>, callback?: () => any) {
        if (model !== this.state.model) {
            debugLog(this.program, 'MODEL CHANGE', model);
        }
        this.setState({ model }, callback);
    }

    dispatch(msg: Msg | Msg[]) {
        debugLog(this.program, 'DISPATCHED MSG', msg);
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
        debugLog(this.program, 'PROCESSING CMD', cmd);

        switch (cmd.type) {
            case 'BatchCmd':
                cmd.commands.forEach((c: Cmd<Defaults, Msg>) => this.processCmd(c))
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
        const CurrentView = this.program.view;
        return (
            <CurrentView dispatch={this.dispatch} model={this.state.model} componentProps={null} />
        );
    }
}

export function start<M extends Model, Msg extends Switchable>(program: Program<M, Msg>) {
    ReactDom.render(React.createElement(RootView, { program }), program.renderTarget);
}
