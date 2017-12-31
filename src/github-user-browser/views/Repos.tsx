import * as React from 'react';
import { ViewProps } from 'reelm-core';
import { MyModel, lookupRepos, RepoModel, lookupUserProfile, currentlyFetchingRepos } from '../Model';
import Msg from '../Msg';


function RepoView(repo: RepoModel | undefined) {
    if (!repo) {
        return null;
    }
    return (
        <div key={repo.get('id')} className='repo'>
            <a target='_blank' href={repo.get('html_url')}> <h2>{repo.get('name')}</h2></a>
            <p>{repo.get('description')}</p>
            <ul>
                {repo.get('fork') && <li className='fork'>fork</li>}
                <li>Number of forks: {repo.get('forks_count')}</li>
                <li>Number of open issues: {repo.get('open_issues_count')}</li>
                <li>Number of watchers: {repo.get('watchers')}</li>
            </ul>
        </div>
    );
}

const View: React.SFC<ViewProps<MyModel, Msg, null>> = ({ model }: ViewProps<MyModel, Msg, null>) => {
    const username = model.get('showProfile');

    if (username === null) {
        return null;
    }

    const profile = lookupUserProfile(username, model);

    if (profile === null) {
        return null;
    }

    const repos = lookupRepos(profile, model);
    const fetching = currentlyFetchingRepos(profile, model);
    if (repos === null && !fetching) {
        return (
            <div>Fetchign repos... {username}</div>
        );
    }

    if (repos === null) {
        return <div>Can't get the repos for {username}</div>
    }

    if (repos.size === 0) {
        return <div>No repos</div>;
    }

    return (
        <div className='repositories'>
            <h1>Repositories</h1>
            {repos.map(RepoView)}
        </div>
    );
}

export default View;