import React, { useContext } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import logo from '../assets/images/post.png';
import { AuthContext } from '../store/authContext';

const Navbar = () => {
  const { userAuth, removeUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = () => {
    Swal.fire({
      title: 'Are you sure you want to Logout?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        removeUser();

        navigate('/login');
        Swal.fire('You are successfully Logged Out', '', 'success');
      }
    });
  };

  return (
    <div className="navbar-container px-4">
      <div className="d-flex align-items-center ">
        <div className="pr-3 border-white border-right">
          <NavLink exact="true" to="/">
            <img src={logo} alt="app-icon" />
          </NavLink>
        </div>
        <div className="pl-3">
          {userAuth?.firstname} {userAuth?.lastname}
        </div>
      </div>
      <div>
        <NavLink
          exact="true"
          className=" text-decoration-none mr-4 nav-links"
          activeclassname="active"
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className=" text-decoration-none mr-4 nav-links"
          activeclassname="active"
          to="/profile"
        >
          Profile
        </NavLink>
        <span onClick={logout} className="mr-2 nav-links">
          Logout
        </span>
      </div>
    </div>
  );
};

export default Navbar;
