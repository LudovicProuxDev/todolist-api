// src/components/Layout.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Layout from './Layout';

describe('Layout component', () => {
  test('renders without crashing and matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('contains navigation links with correct destinations', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    const navLinks = screen.getAllByRole('link');
    expect(navLinks).toHaveLength(3);
    expect(navLinks[0]).toHaveAttribute('href', '/');
    expect(navLinks[0]).toHaveTextContent('Home');
    expect(navLinks[1]).toHaveAttribute('href', '/tasks');
    expect(navLinks[1]).toHaveTextContent('Tasks');
    expect(navLinks[2]).toHaveAttribute('href', '/categories');
    expect(navLinks[2]).toHaveTextContent('Categories');
  });

  test('renders child routes via Outlet', () => {
    const Child = () => <div data-testid="child">Child Component</div>;
    render(
      <MemoryRouter initialEntries={[ '/test' ]}>
        <Layout />
        <Child />
      </MemoryRouter>
    );
    // Since Outlet renders children, we can check for the child component
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
