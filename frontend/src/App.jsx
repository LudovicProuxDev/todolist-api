import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';

export function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App
