import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <div className='navbar'>
        <Link to='/'><h1>DoShiTo💩</h1></Link>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/profile'>Profile</Link>
        <Link to='/register'>Register</Link>
      </nav>
    </div>
  );
};

export default Navbar;
