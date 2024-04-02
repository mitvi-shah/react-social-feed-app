import React, { useContext, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { useLoginMutation } from '../../store/authApi';
import { AuthContext } from '../../store/authContext';
import { loginSchema } from '../../utils/validationSchemas';

const Login = () => {
  const [loginUser] = useLoginMutation();
  const navigate = useNavigate();
  const { addUser } = useContext(AuthContext);
  const [apiErrors, setApiErrors] = useState('');
  const schema = yup.object().shape(loginSchema);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const loginValidUser = async (data) => {
    try {
      const response = await loginUser(data);
      if (response.data?.success) {
        addUser(response.data.data);
        navigate('/');
      } else if (!response.data) {
        setApiErrors(response.error.data.message);
      } else {
        setApiErrors('Something went wrong please try again!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="mt-4">LOGIN </h1>
      <div className="form">
        <form
          type="submit"
          className="main-container"
          onSubmit={handleSubmit(loginValidUser)}
        >
          <div className="form-label-container pl-3">
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
          </div>
          <div className="form-input-container">
            <div className="form-inputs">
              <input
                className="form-control"
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                {...register('email')}
              />
              {errors.email && (
                <span className="error"> {errors.email?.message}</span>
              )}
            </div>
            <div className="form-inputs">
              <input
                className="form-control"
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                {...register('password')}
              />
              {errors.password && (
                <span className="error"> {errors.password?.message}</span>
              )}
            </div>

            {apiErrors && <div className="error">{apiErrors}</div>}
            <button
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
