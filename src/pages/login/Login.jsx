import React, { useContext, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import DisplayError from '../../components/DisplayError';
import { useLoginMutation } from '../../store/authApi';
import { AuthContext } from '../../store/authContext';

const Login = () => {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState({});
  const [loginUser] = useLoginMutation();
  const navigate = useNavigate();
  const { addUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    const obj = {};
    if (!userData.email) {
      obj.emailErr = 'Please enter email';
    } else if (!userData.email.toLowerCase().match(/^\S+@\S+\.\S+$/)) {
      obj.emailErr = 'Please enter valid email!';
    }
    if (!userData.password) {
      obj.passwordErr = 'Please enter password';
    } else if (userData.password.length < 8 || userData.password.length > 15) {
      obj.passwordErr = 'Password must be between 8 to 15 characters!';
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        userData.password
      )
    ) {
      obj.passwordErr =
        'Password must contain a letter, a number & a special character!';
    }
    setError(obj);
    if (!Object.keys(obj).length) {
      try {
        const response = await loginUser(userData);
        if (response.data?.success) {
          addUser(response.data.data);
          setUserData({});
          navigate('/');
        } else if (!response.data) {
          obj.passwordErr = 'Something went wrong please try again!';
          setError(obj);
        } else {
          obj.passwordErr = response?.error?.data?.message;
          setError(obj);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <h1 className="mt-4">LOGIN </h1>
      <div className="form">
        <form className="main-container">
          <div className="form-label-container">
            <div className="label-control">
              <label htmlFor="email">
                Email<span className="star">*</span> :{' '}
              </label>
            </div>
            <div className="label-control">
              <label htmlFor="password">
                Password<span className="star">*</span> :{' '}
              </label>
            </div>
          </div>
          <div className="form-input-container">
            <div className="form-inputs">
              <input
                className="form-control"
                name="email"
                type="email"
                onChange={(e) => (userData.email = e.target.value)}
              />
              <DisplayError error={error.emailErr} />
            </div>
            <div className="form-inputs">
              <input
                className="form-control"
                name="password"
                type="password"
                onChange={(e) => (userData.password = e.target.value)}
              />
              <div className="messages">
                <DisplayError error={error.passwordErr} />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="btn btn-lg btn-primary mt-4 bg-blue ml-2"
              type="submit"
            >
              Submit
            </button>
            <div className="mt-3">
              <Link to="/register">Not a Member?</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
