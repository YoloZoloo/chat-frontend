import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Chat from './Chat/Chat';
import Register from './User/Register'
import store, { persistor } from './reducers/reducer';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
}


export default App;
