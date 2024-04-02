import React, { useState, useEffect, useContext, useRef } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import Accordion from 'react-bootstrap/Accordion';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Loader from '../../components/Loader';
import { useUpdateUserMutation } from '../../store/authApi';
import { AuthContext } from '../../store/authContext';
import {
  profileSchema,
  registrationSchema,
} from '../../utils/validationSchemas';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [passwordType, setPasswordType] = useState('password');
  const [buttonType, setButtonType] = useState('submit');

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const [updateUser, { isError, isLoading }] = useUpdateUserMutation();
  const passwdRef = useRef(null);
  const [apiErrors, setApiErrors] = useState('');
  const schema = yup
    .object()
    .shape(isAccordionOpen ? registrationSchema : profileSchema);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    userAuth && assignValues();
  }, [userAuth]);

  const submitOnEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  useEffect(() => {
    const ref = passwdRef?.current;
    ref?.addEventListener('keypress', submitOnEnter);
    return () => ref?.removeEventListener('keypress', submitOnEnter);
  }, [passwdRef.current]);

  const assignValues = () => {
    if (userAuth) {
      const user = {
        firstname: userAuth.firstname,
        lastname: userAuth.lastname,
        username: userAuth.username,
        isPrivate: JSON.stringify(userAuth.isPrivate),
        email: userAuth.email,
      };
      setUserData(user);
    }
  };
  const cancelPasswordUpdate = () => {
    // if (isAccordionOpen) {
    //   error.confirmPasswordErr = null;
    //   delete userData.password;
    //   delete userData.confirmPassword;
    // }
    setIsAccordionOpen(!isAccordionOpen);
  };
  const updateUserProfile = async (user) => {
    console.log('first');
    try {
      setEditMode(false);
      isAccordionOpen && setIsAccordionOpen(false);
      console.log(user);
      const response = await updateUser(user);
      if (response?.data?.status === 'success') {
        setUserAuth(response.data.data);
      } else if (isError) {
        setApiErrors(response.error.data.message);
      } else if (!response.data) {
        setApiErrors('Something went wrong please try again!');
      }
    } catch (error) {
      setApiErrors('Something went wrong please try again!');
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-100 page-layout d-flex justify-content-center ">
        <section className="col-lg-9">
          <div className="card mt-4">
            <div className="card-header">
              <h4>Profile Details</h4>
            </div>
            <form type="submit" onSubmit={handleSubmit(updateUserProfile)}>
              <div className="card-body">
                <div className="col-lg-12 d-flex mb-3">
                  <div className="col-lg-6 pe-2">
                    <label className="form-label">
                      First Name<span className="text-danger">*</span>
                    </label>
                    <div>
                      {isEditMode ? (
                        <input
                          defaultValue={userData.firstname}
                          className="form-control"
                          name="firstname"
                          placeholder="Enter your First name"
                          type="text"
                          id="firstname"
                          {...register('firstname')}
                        />
                      ) : (
                        userData.firstname
                      )}

                      {errors.firstname && (
                        <span className="error">
                          {errors.firstname?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 ps-2">
                    <label className="form-label" htmlFor="email">
                      Last Name<span className="text-danger">*</span>
                    </label>
                    <div>
                      {isEditMode ? (
                        <input
                          defaultValue={userData.lastname}
                          className="form-control"
                          name="lastname"
                          id="lastname"
                          placeholder="Enter your Last Name"
                          type="text"
                          {...register('lastname')}
                        />
                      ) : (
                        userData.lastname
                      )}

                      {errors.lastname && (
                        <span className="error">
                          {errors.lastname?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 d-flex mb-3">
                  <div className="col-lg-6 pe-2">
                    <label className="form-label">
                      Username<span className="text-danger">*</span>
                    </label>
                    <div>
                      {isEditMode ? (
                        <input
                          defaultValue={userData.username}
                          className="form-control"
                          placeholder="Enter your username"
                          name="username"
                          type="text"
                          id="username"
                          {...register('username')}
                        />
                      ) : (
                        userData.username
                      )}
                      {errors.username && (
                        <span className="error">
                          {errors.username?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 ps-2">
                    <label className="form-label" htmlFor="userData.email">
                      Email<span className="text-danger">*</span>
                    </label>
                    <div>
                      {isEditMode ? (
                        <input
                          defaultValue={userData.email}
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          type="email"
                          {...register('email')}
                        />
                      ) : (
                        userData.email
                      )}
                      {errors.email && (
                        <span className="error"> {errors.email?.message}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 d-flex mb-3">
                  <div className="col-lg-6 pr-2 mt-2">
                    <label className="form-label" htmlFor="email">
                      Account Type<span className="text-danger">*</span>
                    </label>
                    {isEditMode ? (
                      <div>
                        <input
                          className="mr-2"
                          type="radio"
                          value="true"
                          name="isPrivate"
                          id="private"
                          defaultChecked={userData.isPrivate === 'true'}
                          {...register('isPrivate')}
                        />
                        <label className="mb-0 mr-2" htmlFor="private">
                          Private
                        </label>
                        <input
                          className="mr-2"
                          type="radio"
                          value="false"
                          id="public"
                          name="isPrivate"
                          defaultChecked={userData.isPrivate === 'false'}
                          {...register('isPrivate')}
                        />
                        <label className="mb-0" htmlFor="public">
                          Public
                        </label>
                      </div>
                    ) : userData.isPrivate === 'true' ? (
                      <div>Private</div>
                    ) : (
                      <div>Public</div>
                    )}
                    {errors.isPrivate && (
                      <span className="error">{errors.isPrivate?.message}</span>
                    )}
                  </div>
                  {isEditMode && (
                    <div className="col-lg-6 ps-2">
                      <Accordion onSelect={cancelPasswordUpdate}>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <span className="btn btn-primary">
                              {isAccordionOpen ? 'Cancel' : 'Change Password'}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            <input
                              className="form-control w-100 my-2"
                              name="password"
                              id="password"
                              placeholder="Enter new password"
                              type={passwordType}
                              {...register('password')}
                            />
                            {errors.password && (
                              <span className="error">
                                {errors.password?.message}
                              </span>
                            )}
                            <input
                              ref={passwdRef}
                              onChange={(e) =>
                                (userData.confirmPassword = e.target.value)
                              }
                              className="form-control w-100 my-2"
                              id="confirmPassword"
                              name="confirmPassword"
                              placeholder="Please confirm new password"
                              type={passwordType}
                              {...register('confirmPassword')}
                            />

                            {errors.confirmPassword && (
                              <span className="error">
                                {errors.confirmPassword?.message}
                              </span>
                            )}
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() =>
                                passwordType === 'password'
                                  ? setPasswordType('text')
                                  : setPasswordType('password')
                              }
                            >
                              {passwordType === 'password' ? 'Show' : 'Hide'}{' '}
                              Password
                            </button>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type={buttonType}
                    onClick={(e) => {
                      !isEditMode && setEditMode(true);
                      buttonType === 'button'
                        ? setButtonType('submit')
                        : setButtonType('button');
                    }}
                    className="btn btn-outline-success  d-grid mr-3"
                  >
                    {isEditMode ? 'Update' : 'Edit Profile'}
                  </button>

                  {apiErrors && <div className="error">{apiErrors}</div>}
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setButtonType('button');
                        setIsAccordionOpen(false);
                        assignValues();
                      }}
                      className="btn btn-outline-danger d-grid"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Profile;
