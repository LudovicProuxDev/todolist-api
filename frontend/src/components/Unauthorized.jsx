import { NavLink } from 'react-router';

const Unauthorized = () => {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>Oops! It looks like you can't get there from here.</p>
      <div>
        <NavLink to={'/'}>Home</NavLink>
      </div>
    </div>
  );
};

export default Unauthorized;
