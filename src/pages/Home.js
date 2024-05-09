import React from'react';
//importacao de navLink
import { NavLink } from'react-router-dom';

export default function Home() {
    return (
        <div>
            <p>lista de jogos</p>
            <ul>
                <li><NavLink to='/games/2d-runner'>2d runner</NavLink></li>
                <li><NavLink to='/games/breakout'>breakout</NavLink></li>
                <li><NavLink to='/games/fruit-catch'>Fruit-catch</NavLink></li>
                <li><NavLink to='/games/match-three'>match three</NavLink></li>
                <li><NavLink to='/games/maze-game'>maze game</NavLink></li>
                <li><NavLink to='/games/memory-game'>memory game</NavLink></li>
                <li><NavLink to='/games/pong'>pong</NavLink></li>
                <li><NavLink to='/games/simon'>simon</NavLink></li>
                <li><NavLink to='/games/snake'>snake</NavLink></li>
                <li><NavLink to='/games/tetris'>tetris</NavLink></li>
                <li><NavLink to='/games/tic-tac-toe'>tic tac toe</NavLink></li>
                <li><NavLink to='/games/whack-a-mole'>Whack-a-mole</NavLink></li>
                
            </ul>
        </div>
    )
}