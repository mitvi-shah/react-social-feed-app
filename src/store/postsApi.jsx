import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import setAPIHeaders from './authApi';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery(setAPIHeaders()),
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (post) => ({
        url: '/posts/create-post',
        method: 'POST',
        body: post,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const response = await queryFulfilled;
        if (response.data.status === 'success') {
          dispatch(
            postsApi.util.updateQueryData(
              'getFeedPosts',
              { page: 1 },
              (cachedData) => {
                return {
                  ...cachedData,
                  data: [response.data.data, ...cachedData.data],
                };
              }
            )
          );
        }
      },
    }),
    getFeedPosts: builder.query({
      query: (arg) => {
        console.log(arg);
        return {
          url: '/posts/get-feed-posts',
          params: arg,
        };
      },
      transformResponse: (response) => response.data,
    }),
  }),
});

export default postsApi;
export const { useCreatePostMutation, useGetFeedPostsQuery } = postsApi;
