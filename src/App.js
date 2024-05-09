import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Header from "./components/Header.js";
import Home from "./pages/Home.js";
import GameRoutes from './components/GameRoutes.js';
import './components/styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/*" element={<GameRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}  