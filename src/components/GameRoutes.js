import GameSceneConfig from './Config.js';
import { Route, Routes } from "react-router-dom"


export default function GameRoutes() {
    return (
      <Routes>
        <Route path="/2d-runner" element={<GameSceneConfig folderName="2DRunner" canvasWidth={800} canvasHeight={600} gravity={0} isPixelArt={true} />} />
        <Route path="/breakout" element={<GameSceneConfig folderName="breakout" canvasWidth={800} canvasHeight={600} gravity={0} isPixelArt={true} />} />
        <Route path="/fruit-catch" element={<GameSceneConfig folderName="fruitCatch" canvasWidth={800} gravity={0} canvasHeight={600} isPixelArt={true} />} />
        <Route path="/match-three" element={<GameSceneConfig folderName="matchThree" canvasWidth={800} gravity={0} canvasHeight={600} isPixelArt={true} />} />
        <Route path="/maze-game" element={<GameSceneConfig folderName="mazeGame" canvasWidth={800} gravity={0} canvasHeight={600} isPixelArt={true} />} />
        <Route path="/memory-game" element={<GameSceneConfig folderName="memoryGame" canvasWidth={800} gravity={0} canvasHeight={600} isPixelArt={true} />} />
        <Route path="/pong" element={<GameSceneConfig folderName="pong" canvasWidth={800} canvasHeight={600} gravity={0} isPixelArt={true} />} />
        <Route path="/simon" element={<GameSceneConfig folderName="simon" canvasWidth={800} canvasHeight={600} gravity={0} isPixelArt={true} />} />
        <Route path="/snake" element={<GameSceneConfig folderName="snake" canvasWidth={800} canvasHeight={600} gravity={0} isPixelArt={true} />} />
        <Route path="/tetris" element={<GameSceneConfig folderName="tetris" canvasWidth={800} canvasHeight={600} gravity={0} isPixelArt={true} />} />
        <Route path="/tic-tac-toe" element={<GameSceneConfig folderName="ticTacToe" canvasWidth={800} canvasHeight={600} gravity={0} isPixelArt={true} />} />
        <Route path="/whack-a-mole" element={<GameSceneConfig folderName="whackAMole" canvasWidth={800} canvasHeight={600} gravity={0} isPixelArt={true} />} />
        <Route path="*" element={<div>Erro 404. Página de jogo não encontrada!</div>} />
      </Routes>
    )
  }