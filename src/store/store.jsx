import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authApi } from './authApi';
import postsApi from './postsApi';

const rootReducer = (state, action) => {
  if (action.type === 'logout') {
    console.log(state);
    state = undefined;
    console.log(state);
  }
  return combinedReducer(state, action);
};

const combinedReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(postsApi.middleware),
});
