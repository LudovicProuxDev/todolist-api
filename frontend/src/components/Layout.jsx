import { Outlet, NavLink } from 'react-router';

function Layout() {
  return (
    <div className="layout">
      <header>
        <nav>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/tasks">Tasks</NavLink></li>
                <li><NavLink to="/categories">Categories</NavLink></li>
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