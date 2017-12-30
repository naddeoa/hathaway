import * as React from 'react';
import { ViewProps, ImmutableModel } from 'reelm-core';
import { CountModel } from './Model';
import Msg from './Msg';
import UnknownPage from './UnknownPage';
import PageOne from './PageOne';
import PageTwo from './PageTwo';


type Route = 'FirstPage' | 'SecondPage' | 'UnknownPage';

function parseRoute(model: ImmutableModel<CountModel>): Route {
    switch (model.get('pathname')) {
        case '/page-one':
            return 'FirstPage';
        case '/page-two':
            return 'SecondPage';
        default:
            return 'UnknownPage';
    }
}

const View: React.SFC<ViewProps<CountModel, Msg, {}>> = ({ model, dispatch }: ViewProps<CountModel, Msg, {}>) => {
    const route = parseRoute(model);

    switch (route) {
        case 'FirstPage':
            return <PageOne model={model} dispatch={dispatch} componentProps={{}} />;
        case 'SecondPage':
            return <PageTwo model={model} dispatch={dispatch} componentProps={{}} />;
        default:
            return <UnknownPage model={model} dispatch={dispatch} componentProps={{}} />;
    };
}

export default View;