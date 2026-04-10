import { Outlet, NavLink } from "react-router";
import Logout from "./Logout";
import AccessControl from "./AccessControl";
import { ROLES } from "../constants/roles";

function Layout() {
  return (
    <div className="layout">
      <header>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <AccessControl roles={[ROLES.USER]}>
              <li>
                <NavLink to="/tasks">Tasks</NavLink>
              </li>
            </AccessControl>
            <AccessControl roles={[ROLES.ADMIN]}>
              <li>
                <NavLink to="/categories">Categories</NavLink>
              </li>
              <li>
                <NavLink to="/users">Users</NavLink>
              </li>
            </AccessControl>
            <AccessControl isAuth={false}>
              <li>
                <NavLink to="/login">Log in</NavLink>
              </li>
            </AccessControl>
            <AccessControl isAuth={true}>
              <li>
                <NavLink to="/profile">My profile</NavLink>
              </li>
              <li>
                <Logout />
              </li>
            </AccessControl>
          </ul>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer>
        <p>© 2026 - LudovicProuxDev</p>
      </footer>
    </div>
  );
}

export default Layout;
