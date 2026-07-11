import { NavLink } from "react-router-dom";
import "./Nav.css";

function Nav() {
  return (
    <nav className="navbar">
      <NavLink to="/equipments">equipments</NavLink>
      <NavLink to="/rooms">rooms</NavLink>
    </nav>
  );
}

export default Nav;
