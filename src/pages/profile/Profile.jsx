import React, { useState, useEffect, useContext, useRef } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import Accordion from 'react-bootstrap/Accordion';

import DisplayError from '../../components/DisplayError';
import { useUpdateUserMutation } from '../../store/authApi';
import { AuthContext } from '../../store/authContext';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [type, setType] = useState('password');

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [error, setError] = useState({});
  const [isEditMode, setEditMode] = useState(false);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const [updateUser, { isError, isLoading }] = useUpdateUserMutation();
  const passwdRef = useRef(null);

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
    if (isAccordionOpen) {
      error.confirmPasswordErr = null;
      delete userData.password;
      delete userData.confirmPassword;
    }
    setIsAccordionOpen(!isAccordionOpen);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    const obj = {};
    if (!userData.firstname) {
      obj.firstNameErr = 'Please enter first name';
    } else if (!/^[a-zA-Z]+$/.test(userData.firstname)) {
      obj.firstNameErr = 'Only letters are allowed!';
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
    if (isAccordionOpen && !userData.password) {
      obj.passwordErr = 'Please enter password';
    } else if (
      isAccordionOpen &&
      (userData.password.length < 8 || userData.password.length > 15)
    ) {
      obj.passwordErr = 'Password must be between 8 to 15 characters!';
    } else if (
      isAccordionOpen &&
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        userData.password
      )
    ) {
      obj.passwordErr =
        'Password must contain a letter, a number & a special character!';
    }
    if (isAccordionOpen && !userData.confirmPassword) {
      obj.confirmPasswordErr = 'Please confirm password';
    } else if (
      isAccordionOpen &&
      userData.confirmPassword !== userData.password
    ) {
      obj.confirmPasswordErr = 'Password and confirm Password must be same!';
    }
    if (!userData.isPrivate) {
      obj.accTypeErr = 'Please select account type';
    }
    setError(obj);
    if (!Object.keys(obj).length) {
      try {
        setEditMode(false);
        const user = cloneDeep(userData);
        delete user.confirmPassword;
        setIsAccordionOpen(false);
        console.log(user);
        const response = await updateUser(userData);
        if (response?.data?.status === 'success') {
          setUserData({});
          setUserAuth(response.data.data);
        } else if (isError) {
          obj.accTypeErr = response.error.data.message;
        } else if (!response.data) {
          obj.accTypeErr = 'Something went wrong please try again!';
          setError(obj);
        }
      } catch (error) {
        obj.accTypeErr = 'Something went wrong please try again!';
      }
    }
  };

  return (
    <>
      {isLoading && <span className="loader"></span>}
      <div className="w-100 page-layout d-flex justify-content-center ">
        <section className="col-lg-9">
          <div className="card mt-4">
            <div className="card-header">
              <h4>Profile Details</h4>
            </div>
            <form>
              <div className="card-body">
                <div className="col-lg-12 d-flex mb-3">
                  <div className="col-lg-6 pe-2">
                    <label className="form-label">
                      First Name<span className="text-danger">*</span>
                    </label>
                    <div>
                      {isEditMode ? (
                        <input
                          value={userData.firstname}
                          className="form-control"
                          name="firstname"
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              firstname: e.target.value,
                            });
                          }}
                          placeholder="Enter your First name"
                          type="text"
                        />
                      ) : (
                        userData.firstname
                      )}
                      <div className="messages">
                        <DisplayError error={error.firstNameErr} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 ps-2">
                    <label className="form-label" htmlFor="email">
                      Last Name<span className="text-danger">*</span>
                    </label>
                    <div>
                      {isEditMode ? (
                        <input
                          value={userData.lastname}
                          className="form-control"
                          name="lastname"
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              lastname: e.target.value,
                            })
                          }
                          placeholder="Enter your Last Name"
                          type="text"
                        />
                      ) : (
                        userData.lastname
                      )}
                      <div className="messages">
                        <DisplayError error={error.lastNameErr} />
                      </div>
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
                          value={userData.username}
                          className="form-control"
                          placeholder="Enter your username"
                          name="username"
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              username: e.target.value,
                            })
                          }
                          type="text"
                        />
                      ) : (
                        userData.username
                      )}
                      <div className="messages">
                        <DisplayError error={error.usernameErr} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 ps-2">
                    <label className="form-label" htmlFor="userData.email">
                      Email<span className="text-danger">*</span>
                    </label>
                    <div>
                      {isEditMode ? (
                        <input
                          value={userData.email}
                          className="form-control"
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          name="email"
                          placeholder="Enter your email"
                          type="email"
                        />
                      ) : (
                        userData.email
                      )}
                      <div className="messages">
                        <DisplayError error={error.emailErr} />
                      </div>
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
                          name="accType"
                          id="private"
                          defaultChecked={userData.isPrivate === 'true'}
                          onChange={() =>
                            setUserData({ ...userData, isPrivate: 'true' })
                          }
                        />
                        <label className="mb-0 mr-2" htmlFor="private">
                          Private
                        </label>
                        <input
                          className="mr-2"
                          type="radio"
                          value="false"
                          id="public"
                          name="accType"
                          defaultChecked={userData.isPrivate === 'false'}
                          onChange={() =>
                            setUserData({ ...userData, isPrivate: 'false' })
                          }
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
                    <div className="messages">
                      <DisplayError error={error.accTypeErr} />
                    </div>
                  </div>
                  {isEditMode && (
                    <div className="col-lg-6 ps-2">
                      <Accordion onSelect={cancelPasswordUpdate}>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <span className="btn btn-primary">
                              {/* Change Password */}
                              {isAccordionOpen ? 'Cancel' : 'Change Password'}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            <input
                              onChange={(e) =>
                                (userData.password = e.target.value)
                              }
                              className="form-control w-100"
                              name="password"
                              placeholder="Enter new password"
                              type={type}
                            />
                            <div className="messages">
                              <DisplayError error={error.passwordErr} />
                            </div>
                            <input
                              ref={passwdRef}
                              onChange={(e) =>
                                (userData.confirmPassword = e.target.value)
                              }
                              className="form-control w-100"
                              name="cpassword"
                              placeholder="Please confirm new password"
                              type={type}
                            />

                            <div className="messages">
                              <DisplayError error={error.confirmPasswordErr} />
                            </div>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() =>
                                type === 'password'
                                  ? setType('text')
                                  : setType('password')
                              }
                            >
                              {type === 'password' ? 'Show' : 'Hide'} Password
                            </button>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={(e) =>
                      isEditMode ? handleSubmit(e) : setEditMode(true)
                    }
                    className="btn btn-outline-success  d-grid mr-3"
                  >
                    {isEditMode ? 'Update' : 'Edit Profile'}
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setIsAccordionOpen(false);
                        setError({});
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
