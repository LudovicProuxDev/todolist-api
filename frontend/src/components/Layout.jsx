import { Outlet, NavLink } from 'react-router';
import Logout from './Logout';

function Layout() {
  return (
    <div className="layout">
      <header>
        <nav>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/tasks">Tasks</NavLink></li>
                <li><NavLink to="/categories">Categories</NavLink></li>
                <li><NavLink to="/users">Users</NavLink></li>
                <li><NavLink to="/login">Log in</NavLink></li>
                <li><NavLink to="/profile">My profile</NavLink></li>
                <li><Logout /></li>
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