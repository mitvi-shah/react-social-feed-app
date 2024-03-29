import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { Router } from './route/lazyRoutes';
import { AuthContextProvider } from './store/authContext';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthContextProvider>
    </Provider>
  );
}

export default App;
