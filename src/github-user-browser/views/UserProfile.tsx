import * as React from 'react';
import { ViewProps } from 'reelm-core';
import { MyModel, UserProfileModel, lookupUserProfile } from '../Model';
import Msg from '../Msg';

function UserStats({ profile }: { profile: UserProfileModel }) {
    return (
        <div>
            <ul>
                <li>id: {profile.get('id')}</li>
                <li>Github page: <a href={profile.get('html_url')} target='_blank'> {profile.get('html_url')} </a></li>
                <li>Number of followers: {profile.get('followers')}</li>
                <li>Number of gists: {profile.get('public_gists')}</li>
                <li>Number of repos: {profile.get('public_repos')}</li>
            </ul>
        </div>
    );
}


const View: React.SFC<ViewProps<MyModel, Msg, null>> = ({ model }: ViewProps<MyModel, Msg, null>) => {
    const username = model.get('showProfile');
    if (username === null) {
        return (
            <div>Try to search for a github username</div>
        );
    }

    const profile = lookupUserProfile(username, model);
    if (profile === null) {
        return (
            <div>Can't find user {username}</div>
        );
    }

    return (
        <div className="user-profile-container">
            <img className="user-profile-img" src={profile.get('avatar_url')} />
            <UserStats profile={profile} />
        </div>
    );
}

export default View;