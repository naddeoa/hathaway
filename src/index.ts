import * as ReactDom from 'react-dom';
import * as React from 'react';
import { Switchable, Program, Model, RootView } from 'hathaway-core';

export * from 'hathaway-core';

export function start<M extends Model, Msg extends Switchable>(program: Program<M, Msg>) {
    ReactDom.render(React.createElement(RootView, { program }), program.renderTarget);
}