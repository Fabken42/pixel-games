import { NavLink } from "react-router-dom"

export default function Header(){
    return(
        <div>
            <h1>
                <NavLink to='/'>Lista de jogos</NavLink>
            </h1>
        </div>
    )
}