import { apiPost, apiPut } from '../utils/axios';
import { publicApiUrl, communityApiUrl } from '../constants/api-url';

const communityApi = {
  getCategories: async function (
    { status = 'enabled', subforumId = null, ...rest },
    accessToken
  ) {
    let query = `status=${status}`;
    if (subforumId) query = `&subforumId=${subforumId}`;

    const result = await apiPost(
      `${publicApiUrl}/getCategories?${query}`,
      rest,
      accessToken
    );

    return result.data;
  },
  getSubforums: async function (
    { status = 'enabled', ...payload },
    accessToken
  ) {
    const result = await apiPost(
      `${publicApiUrl}/getSubforums?status=${status}`,
      payload,
      accessToken
    );

    return result.data;
  },
  getReactions: async function (
    { state = 'enabled', ...payload },
    accessToken
  ) {
    const result = await apiPost(
      `${publicApiUrl}/getReactions?state=${state}`,
      payload,
      accessToken
    );

    return result.data;
  },
  getPinnedPost: async function (payload, accessToken) {
    const result = await apiPost(
      `${publicApiUrl}/getPinnedPost`,
      payload,
      accessToken
    );
    return result.data;
  },
  togglePinPost: async function (payload) {
    const result = await apiPut(`${communityApiUrl}/pinPost`, payload);
    return result.data;
  },
};

export default communityApi;
