import { UserProfileModel, RepoModel } from './Model'

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

export interface FetchLanguagesForRepo {
    type: 'FetchLanguagesForRepo',
    repo: RepoModel
}

export type Msg =
    OnUsernameSearch
    | OnUsernameSearchChanged
    | FetchReposForUser
    | FetchLanguagesForRepo

export default Msg;