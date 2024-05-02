import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Header from "./components/Header.js";
import Home from "./pages/Home.js";
import WhackAMoleScene from './games/whackAMole/scenes/Config.js';
import './components/styles.css';
import FruitCatchScene from './games/fruitCatch/scenes/Config.js';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whack-a-mole" element={<WhackAMoleScene />} />
        <Route path="/fruit-catch" element={<FruitCatchScene />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App