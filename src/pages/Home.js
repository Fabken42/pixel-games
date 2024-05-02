import React from'react';
//importacao de navLink
import { NavLink } from'react-router-dom';

export default function Home() {
    return (
        <div>
            <p>lista de jogos</p>
            <ul>
                <li><NavLink to='/whack-a-mole'>Whack-a-mole</NavLink></li>
                <li><NavLink to='/fruit-catch'>Fruit-catch</NavLink></li>
            </ul>
        </div>
    )
}