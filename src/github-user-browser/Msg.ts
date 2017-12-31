import {UserProfileModel} from './Model'

export interface OnUsernameSearchChanged {
    type: 'OnUsernameSearchChanged',
    text: string
}

export interface OnUsernameSearch {
    type: 'OnUsernameSearch'
}

export interface FetchReposForUser {
    type: 'FetchReposForUser',
    user: UserProfileModel
}

export type Msg = OnUsernameSearch | OnUsernameSearchChanged | FetchReposForUser;

export default Msg;