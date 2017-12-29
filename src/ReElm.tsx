import { Record, List, Map, Set, OrderedMap, OrderedSet, Stack } from 'immutable';

export type ModelValue =
    string
    | null
    | number
    | boolean
    | ImmutableModel<any>
    | List<any>
    | Set<any>
    | Map<any, any>
    | OrderedMap<any, any>
    | OrderedSet<any>
    | Stack<any>

export type Model = Record<any, ModelValue>

export interface ImmutableModel<Defaults extends Model> {

    get<T extends keyof Defaults>(value: T): Defaults[T];

    set<T extends keyof Defaults>(key: T, value: Defaults[T]): ImmutableModel<Defaults>;
}


export function createModel<Defaults extends Model>(defaults: Defaults): ImmutableModel<Defaults> {

    class ImmutableModelImpl extends Record(defaults) {

        constructor(params?: Defaults) {
            params ? super(params) : super();
        }

        get<T extends keyof Defaults>(value: T): Defaults[T] {
            return super.get(value);
        }

        set<T extends keyof Defaults>(key: T, value: Defaults[T]): ImmutableModelImpl {
            return super.set(key, value) as this;
        }
    }

    return new ImmutableModelImpl();
}


export type Update<M extends Model, Msg extends Switchable> = (model: ImmutableModel<M>, msg: Msg) => [ImmutableModel<M>, Cmd<M, Msg>];

export interface NavigateTo<M extends Model, Msg extends Switchable, ComponentProps> {
    type: 'NavigateTo'
    view: React.SFC<ViewProps<M, Msg, ComponentProps>>,
    props: ComponentProps
}

export interface AsyncImmutableModelUpdate<M extends Model, Result> {
    type: 'AsyncModelUpdate'
    promise: Promise<Result>,
    updateFunction: (model: ImmutableModel<M>, result: Result) => ImmutableModel<M> | null
    retryFunction?: (model: ImmutableModel<M>, result: Result) => any
}

export interface NoOp {
    type: 'NoOp'
}

export const NoOp: NoOp = { type: 'NoOp' };

export interface BatchCmd<M extends Model, Msg extends Switchable> {
    type: 'BatchCmd',
    commands: Cmd<M, Msg>[]
}

export interface AsyncCmd<M extends Model, Msg extends Switchable, Result> {
    type: 'AsyncCmd',
    promise: Promise<Result>,
    successFunction: (dispatch: Dispatch<Msg>, model: ImmutableModel<M>, result: Result) => [ImmutableModel<M>, Cmd<M, Msg>] | null
    errorFunction?: (dispatch: Dispatch<Msg>, model: ImmutableModel<M>, result: Result) => any
}

export type Cmd<M extends Model, Msg extends Switchable> =
    NavigateTo<M, Msg, any>
    | NoOp
    | BatchCmd<M, Msg>
    | AsyncImmutableModelUpdate<M, any>
    | AsyncCmd<M, Msg, any>


export type Dispatch<Msg extends Switchable> = (msg: Msg | Msg[]) => void;

export interface Switchable {
    type: string
}

export interface ViewProps<M extends Model, Msg extends Switchable, ComponentProps> {
    model: ImmutableModel<M>,
    dispatch: Dispatch<Msg>,
    componentProps: ComponentProps
}

export interface Program<M extends Model, Msg extends Switchable> {
    init: ImmutableModel<M>,
    update: Update<M, Msg>,
    view: React.SFC<ViewProps<M, Msg, any>>,
    renderTarget: HTMLElement
}

export interface ViewStackframe<M extends Model, Msg extends Switchable, ComponentProps> {
    view: React.SFC<ViewProps<M, Msg, ComponentProps>>,
    componentProps?: ComponentProps
}

export interface RootViewState<M extends Model, Msg extends Switchable> {
    model: ImmutableModel<M>,
    viewStack: List<ViewStackframe<M, Msg, any>>
};

export interface RootViewProps<M extends Model, Msg extends Switchable> {
    program: Program<M, Msg>
}
