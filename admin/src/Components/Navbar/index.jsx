import './Navbar.css';
import navLogo from '../../assets/nav-logo.svg';
import navProfile from '../../assets/nav-profile.svg';

const Navbar = () => {
    return (
        <div className='navbar'>
            <img src={navLogo} alt="Logo" className='nav-logo' />
            <img src={navProfile} alt="Profile" className='nav-profile' />
        </div>
    )
}

export default Navbar;