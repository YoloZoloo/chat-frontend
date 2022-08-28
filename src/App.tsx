import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Chat from './Chat/Chat';
// import { createStore } from 'redux';
// import reducer from './reducers/reducer';

//STORE
// let store = createStore(reducer);
// console.log("state: ", store.getState());
// ACTION 

// REDUCER

//DISPATCH

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}


export default App;
