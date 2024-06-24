import { NavLink } from "react-router-dom";
import '../styles/Header.css';

export default function Header() {
    return (
        <header className="header">
            <h1>
                <NavLink to='/' className="header-link">Lista de jogos</NavLink>
            </h1>
        </header>
    );
}
