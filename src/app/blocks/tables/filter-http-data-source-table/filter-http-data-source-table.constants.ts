/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/filter-http-data-source-table`
*/

import { GithubApi } from './filter-http-data-source-table.types';

export const OWNER = 'angular';
export const REPO = 'components';

export const EmptyGithubApi: GithubApi = {
  items: [],
  total_count: 0,
};
