import { UserProfileModel } from './Model';

function appendKey(url: string): string {
    return `${url}?client_secret=072b5041986c59c65804831ba94086ea043e04be&client_id=185bde446d817f14681f`;
}

export type UserProfile = {
    id: string,
    avatar_url: string,
    url: string,
    html_url: string,
    public_repos: number,
    public_gists: number,
    followers: number,
    repos_url: string
}

function isGetUserProfileResponse(a: any): a is UserProfile {
    return a.id && a.repos_url;
}

export async function getUserProfile(username: string): Promise<UserProfile> {
    const url = appendKey(`https://api.github.com/users/${username}`);
    const response = await fetch(url);
    const responseJson = await response.json();

    if (!isGetUserProfileResponse(responseJson)) {
        throw new Error(`Unexpected return object from Github: ${JSON.stringify(response)}`);
    }

    return responseJson;
}


export type Repo = {
    id: string,
    name: string,
    html_url: string,
    description: string,
    fork: boolean,
    open_issues_count: number,
    forks_count: number,
    watchers: number
}

function isRepos(a: any): a is Repo[] {
    if (!('length' in a)) {
        return false;
    }

    if (a.length === 0) {
        return true;
    }

    const repo: Repo = a[0];

    return 'id' in repo
        && 'name' in repo
        && 'description' in repo
}

export async function getUserRepos(profile: UserProfileModel): Promise<Repo[]> {
    const url = appendKey(profile.get('repos_url'));
    const response = await fetch(url);
    const responseJson = await response.json();

    responseJson.forEach((repo: any) => {
        delete repo['size'];
    });

    if (!isRepos(responseJson)) {
        throw new Error(`Unexpected return object from Github: ${JSON.stringify(responseJson)}`);
    }

    return responseJson;
}