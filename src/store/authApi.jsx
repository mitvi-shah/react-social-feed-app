import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCookieValue } from '../route/RequireAuth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery(setAPIHeaders()),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: '/sign-up',
        method: 'POST',
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: '/login',
        method: 'POST',
        body: user,
      }),
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: '/users/update-user',
        method: 'PUT',
        body: userData,
      }),
    }),
    getUser: builder.query({
      query: () => {
        return {
          url: 'users/get-user',
        };
      },
    }),
  }),
});

export default function setAPIHeaders() {
  return {
    baseUrl: 'http://localhost:5000',
    prepareHeaders: (headers, { endpoint }) => {
      if (endpoint !== 'refresh') {
        headers.set('Authorization', `Bearer ${getCookieValue('accessToken')}`);
        headers.set('Access-Control-Allow-Origin', '*');
      }
      return headers;
    },
  };
}

export const {
  useRegisterUserMutation,
  useLoginMutation,
  useUpdateUserMutation,
  useGetUserQuery,
} = authApi;
