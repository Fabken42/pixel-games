import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Home.css';
import runner2d from '../img/runner2d.png';
import climbPlatforms from '../img/climbPlatforms.png';
import fruitCatch from '../img/fruitCatch.png';
import hitTargets from '../img/hitTargets.png';
import mazeGame from '../img/mazeGame.png';
import memoryGame from '../img/memoryGame.png';
import pong from '../img/pong.png';
import simon from '../img/simon.png';
import snake from '../img/snake.png';
import tetris from '../img/tetris.png';
import ticTacToe from '../img/ticTacToe.png';
import whackAMole from '../img/whackAMole.png';

const games = [
    {
        name: '2D Runner',
        path: '/games/2d-runner',
        description: 'Pule e evite obstáculos conforme eles ficam mais difíceis',
        image: runner2d
    },
    {
        name: 'Climb Platforms',
        path: '/games/climb-platforms',
        description: 'Suba as plataformas e chegue até o topo',
        image: climbPlatforms
    },
    {
        name: 'Hit the Targets',
        path: '/games/hit-the-targets',
        description: 'Acerte o maior número de alvos que aparecem',
        image: hitTargets
    },
    {
        name: 'Fruit Catch',
        path: '/games/fruit-catch',
        description: 'Pegue o maior número de maçãs que caem da árvore',
        image: fruitCatch
        },
    {
        name: 'Maze Game',
        path: '/games/maze-game',
        description: 'Chegue ao objetivo evitando os inimigos',
        image: mazeGame
    },
    {
        name: 'Memory Game',
        path: '/games/memory-game',
        description: 'Teste sua memória com este jogo',
        image: memoryGame
    },
    {
        name: 'Pong',
        path: '/games/pong',
        description: 'o clássico jogo Pong',
        image: pong
    },
    {
        name: 'Simon',
        path: '/games/simon',
        description: 'Repita a sequência de cores que aparecem',
        image: simon
    },
    {
        name: 'Snake',
        path: '/games/snake',
        description: 'Faça o dragão crescer ao comer as bolas do dragão',
        image: snake
    },
    {
        name: 'Tetris',
        path: '/games/tetris',
        description: 'Encaixe os blocos para limpar as linhas',
        image: tetris
    },
    {
        name: 'Tic Tac Toe',
        path: '/games/tic-tac-toe',
        description: 'O clássico jogo da velha',
        image: ticTacToe
    },
    {
        name: 'Whack a Mole',
        path: '/games/whack-a-mole',
        description: 'Acerte as toupeiras conforme elas aparecem',
        image: whackAMole
    },
];

export default function Home() {
    return (
        <div className="home-container">
            <h1 className="title">Lista de Jogos</h1>
            <div className="cards-container">
                {games.map(game => (
                    <div key={game.name} className="card">
                        <NavLink to={game.path}>
                            <img src={game.image} alt={game.name} className="card-image" />
                            <div className="card-content">
                                <h3>{game.name}</h3>
                                <p>{game.description}</p>
                            </div>
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
}
