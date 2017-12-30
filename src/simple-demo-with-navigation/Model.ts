import { createModel, ImmutableModel } from 'reelm-core';

export type CountModel = {
    pathname: string
};

const defaultValues = {
    pathname: document.location.pathname
};

export type Model = ImmutableModel<CountModel>;

export const initialValue: Model = createModel(defaultValues);
