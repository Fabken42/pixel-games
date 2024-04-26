import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home.js";
import WhackAMoleScene from './scenes/WhackAMole.js';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WhackAMoleScene />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App