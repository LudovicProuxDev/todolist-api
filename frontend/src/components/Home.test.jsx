// src/components/Home.test.jsx
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home component', () => {
  test('renders without crashing', () => {
    const { asFragment } = render(<Home />);
    // Snapshot test
    expect(asFragment()).toMatchSnapshot();
  });

  test('displays the correct heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Todolist App');
  });
});
