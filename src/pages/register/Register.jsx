import React, { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { useRegisterUserMutation } from '../../store/authApi';
import { registrationSchema } from '../../utils/validationSchemas';

const Register = () => {
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();
  const [apiErrors, setApiErrors] = useState('');
  const schema = yup.object().shape(registrationSchema);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const registerValidUser = async (data) => {
    try {
      const response = await registerUser(data);
      if (response.data?.status === 'success') {
        navigate('/login');
      } else if (response.error?.status !== 200) {
        setApiErrors(response.error.data.message);
      } else if (!response.data) {
        setApiErrors(response.error.data.message);
      }
    } catch (error) {
      setApiErrors(error);
    }
  };

  return (
    <div className="w-100">
      <h1 className="mt-4">REGISTER </h1>

      <div className="form reg-form">
        <form
          type="submit"
          className="main-container"
          onSubmit={handleSubmit(registerValidUser)}
        >
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
                id="firstname"
                name="firstname"
                placeholder="Enter first name"
                {...register('firstname')}
              />
              {errors.firstname && (
                <span className="error"> {errors.firstname?.message}</span>
              )}
            </div>
            <div className="form-inputs">
              <input
                className="form-control"
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Enter last name"
                {...register('lastname')}
              />
              {errors.lastname && (
                <span className="error"> {errors.lastname?.message}</span>
              )}
            </div>
            <div className="form-inputs">
              <input
                className="form-control"
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                {...register('username')}
              />
              {errors.username && (
                <span className="error"> {errors.username?.message}</span>
              )}
            </div>
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
            <div className="form-inputs">
              <input
                className="form-control"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword?.message}</span>
              )}
            </div>
            <div className="form-inputs">
              <div className="d-flex align-items-center h-100">
                <input
                  className="mr-2"
                  type="radio"
                  value="true"
                  name="isPrivate"
                  id="private"
                  {...register('isPrivate')}
                />
                <label className="mb-0" htmlFor="private">
                  Private
                </label>
                <input
                  className="mx-2"
                  type="radio"
                  value="false"
                  name="isPrivate"
                  id="public"
                  {...register('isPrivate')}
                />
                <label className="mb-0" htmlFor="public">
                  Public
                </label>
              </div>
              {errors.isPrivate && (
                <span className="error">{errors.isPrivate?.message}</span>
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
              <Link to="/login">Already a Member?</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
