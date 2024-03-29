import React, { useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { Link, useNavigate } from 'react-router-dom';

import DisplayError from '../../components/DisplayError';
import { useRegisterUserMutation } from '../../store/authApi';

const Register = () => {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState({});

  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    const obj = {};
    if (!userData.firstname) {
      obj.firstnameErr = 'Please enter first name';
    } else if (!/^[a-zA-Z]+$/.test(userData.firstname)) {
      obj.firstnameErr = 'Only letters are allowed!';
    }
    if (!userData.lastname) {
      obj.lastNameErr = 'Please enter last name';
    } else if (!/^[a-zA-Z]+$/.test(userData.lastname)) {
      obj.lastNameErr = 'Only letters are allowed!';
    }
    if (!userData.username) {
      obj.usernameErr = 'Please enter username';
    } else if (userData.username.length < 6) {
      obj.usernameErr = 'Username must be at least 6 characters long';
    }
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
    if (!userData.confirmPassword) {
      obj.confirmPasswordErr = 'Please confirm password';
    } else if (userData.confirmPassword !== userData.password) {
      obj.confirmPasswordErr = 'Password and confirm Password must be same!';
    }
    if (!userData.isPrivate) {
      obj.accTypeErr = 'Please select account type';
    }
    setError(obj);
    if (!Object.keys(obj).length) {
      try {
        const user = cloneDeep(userData);
        delete user.confirmPassword;
        const response = await registerUser(user);
        if (response.data?.status === 'success') {
          setUserData({});
          navigate('/login');
        } else if (response.error?.status !== 200) {
          obj.accTypeErr = response.error.data.message;
          setError(obj);
        } else if (!response.data) {
          obj.accTypeErr = 'Something went wrong please try again!';
          setError(obj);
        }
      } catch (error) {
        obj.accTypeErr = 'Something went wrong please try again!';
        setError(obj);
      }
    }
  };

  return (
    <>
      {isLoading && <span className="loader"></span>}
      <h1 className="mt-4">Registration</h1>
      <div className="form reg-form">
        <form type="submit" className="main-container">
          <div className="form-label-container pl-3">
            <div className="label-control">
              <label htmlFor="userData.email">
                First Name<span className="star">*</span> :
              </label>
            </div>
            <div className="label-control">
              <label htmlFor="userData.email">
                Last Name<span className="star">*</span> :
              </label>
            </div>
            <div className="label-control">
              <label htmlFor="userData.email">
                username<span className="star">*</span> :
              </label>
            </div>

            <div className="label-control">
              <label htmlFor="userData.email">
                Email<span className="star">*</span> :
              </label>
            </div>
            <div className="label-control">
              <label htmlFor="userData.password">
                Password<span className="star">*</span> :
              </label>
            </div>
            <div className="label-control">
              <label htmlFor="cpassword">
                Confirm Password<span className="star">*</span> :
              </label>
            </div>
            <div className="label-control">
              <label htmlFor="userData.email">
                Account Type<span className="star">*</span> :
              </label>
            </div>
          </div>
          <div className="form-input-container">
            <div className="form-inputs">
              <input
                className="form-control"
                type="text"
                onChange={(e) => (userData.firstname = e.target.value)}
              />
              <DisplayError error={error.firstnameErr} />
            </div>
            <div className="form-inputs">
              <input
                className="form-control"
                type="text"
                onChange={(e) => (userData.lastname = e.target.value)}
              />
              <DisplayError error={error.lastNameErr} />
            </div>
            <div className="form-inputs">
              <input
                className="form-control"
                type="text"
                onChange={(e) => (userData.username = e.target.value)}
              />
              <DisplayError error={error.usernameErr} />
            </div>
            <div className="form-inputs">
              <input
                className="form-control"
                type="userData.email"
                onChange={(e) => (userData.email = e.target.value)}
              />
              <DisplayError error={error.emailErr} />
            </div>
            <div className="form-inputs">
              <input
                className="form-control"
                type="password"
                onChange={(e) => (userData.password = e.target.value)}
              />
              <DisplayError error={error.passwordErr} />
            </div>
            <div className="form-inputs">
              <input
                className="form-control"
                type="password"
                onChange={(e) => (userData.confirmPassword = e.target.value)}
              />
              <DisplayError error={error.confirmPasswordErr} />
            </div>
            <div className="form-inputs">
              <div
                className="d-flex align-items-center h-100"
                onChange={(e) => (userData.isPrivate = e.target.value)}
              >
                <input
                  className="mr-2"
                  type="radio"
                  value="true"
                  name="accType"
                  id="private"
                  defaultChecked={userData.isPrivate === 'true'}
                />
                <label className="mb-0" htmlFor="private">
                  Private
                </label>
                <input
                  className="mx-2"
                  type="radio"
                  value="false"
                  name="accType"
                  id="public"
                  defaultChecked={userData.isPrivate === 'false'}
                />
                <label className="mb-0" htmlFor="public">
                  Public
                </label>
              </div>
              <DisplayError error={error.accTypeErr} />
            </div>
            <button
              onClick={handleSubmit}
              className="btn btn-lg btn-primary mt-4 bg-blue ml-2"
              type="submit"
            >
              Submit
            </button>
            <div className="mt-3">
              <Link to="/login">Already a Member?</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
