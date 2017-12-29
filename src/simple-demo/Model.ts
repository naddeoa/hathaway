import { createModel, ImmutableModel } from '../ReElm';

export type CountModel = {
    count: number;
};

const defaultValues = {
    count: 0,
};

export type Model = ImmutableModel<CountModel>;

export const initialValue: Model = createModel(defaultValues);
