import { createModel, ImmutableModel } from 'reelm-core';
import { Map, List } from 'immutable';
import { UserProfile, Repo } from './GithubApi';

export function addUserProfile(username: string, profile: UserProfile, model: ImmutableModel<MyModel>): ImmutableModel<MyModel> {
    return model.set('userProfiles', model.get('userProfiles').set(username, createModel(profile)));
}

export function lookupUserProfile(username: string, model: ImmutableModel<MyModel>): UserProfileModel | null {
    const profile = model.get('userProfiles').get(username)

    if (!profile) {
        return null;
    }

    return profile;
}

export function currentlyFetchingRepos(profile: UserProfileModel, model: ImmutableModel<MyModel>): boolean {
    const fetching = model.get('fetchingReposForProfile').get(profile.get('id'));
    if (!fetching) {
        return false;
    }

    return fetching;
}

export function setCurrentlyFetchingRepos(profile: UserProfileModel, fetching: boolean, model: ImmutableModel<MyModel>): ImmutableModel<MyModel> {
    const fetchingStatus = model.get('fetchingReposForProfile').set(profile.get('id'), fetching);
    return model.set('fetchingReposForProfile', fetchingStatus);
}

export function addRepos(profile: UserProfileModel, repos: Repo[], model: ImmutableModel<MyModel>): ImmutableModel<MyModel> {
    const updatedRepos = model.get('repos').set(profile.get('id'), List(repos.map(createModel)));
    return model.set('repos', updatedRepos);
}

export function lookupRepos(profile: UserProfileModel, model: ImmutableModel<MyModel>): ReposModel | null {
    const repos = model.get('repos').get(profile.get('id'));

    if (!repos) {
        return null;
    }

    return repos;
}

export type UserProfileModel = ImmutableModel<UserProfile>;

export type RepoModel = ImmutableModel<Repo>;

export type ReposModel = List<RepoModel>;

export type MyModel = {
    usernameSearchText: string,
    showProfile: string | null,
    userProfiles: Map<string, UserProfileModel>,
    repos: Map<string, ReposModel>,
    fetchingReposForProfile: Map<string, boolean>
};

const defaultValues = {
    usernameSearchText: '',
    showProfile: null,
    userProfiles: Map<string, UserProfileModel>(),
    repos: Map<string, ReposModel>(),
    fetchingReposForProfile: Map<string, boolean>()
};

export type Model = ImmutableModel<MyModel>;

export const initialValue: Model = createModel(defaultValues);
