import { Link } from "react-router-dom";
import "./Nav.css";

function Nav() {
  return (
    <nav className="navbar">
      <Link to="/equipments">equipments</Link>
      <Link to="/rooms">rooms</Link>
    </nav>
  );
}

export default Nav;
