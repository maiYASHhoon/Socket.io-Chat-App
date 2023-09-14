// import { Routes, Route, BrowserRouter } from 'react-router-dom';
import React from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'
const App = () =>  {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Join/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
