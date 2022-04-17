import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

const initialForm = {
  fullName: '',
  userName: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  avatarURL: ''
}

const Auth = () => {
  const [form, setForm] = useState(initialForm);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const { fullName, userName, password, phoneNumber, avatarURL } = form;
    const URL = `${process.env.REACT_APP_HOST}/auth`;
    const { data: { token, userID, hashedPassword } } = await axios.post(`${URL}/${isSignUp ? 'signup' : 'login'}`, {
      userName, password, fullName, phoneNumber, avatarURL
    });

    cookies.set('token', token);
    cookies.set('userName', userName);
    cookies.set('fullName', fullName);
    cookies.set('userID', userID);

    if (isSignUp) {
      cookies.set('phoneNumber', phoneNumber);
      cookies.set('avatarURL', avatarURL);
      cookies.set('hashedPassword', hashedPassword);
    }

    window.location.reload();
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const switchMode = () => {
    setIsSignUp(pre => !pre);
  }

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>{isSignUp ? 'Sign up' : 'Sign in'}</p>
          <form onSubmit={handleSubmitForm}>
            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="fullName">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="auth__form-container_fields-content_input">
              <label htmlFor="userName">Username</label>
              <input
                name="userName"
                type="text"
                placeholder="Username"
                onChange={handleChange}
              />
            </div>

            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  onChange={handleChange}
                />
              </div>
            )}

            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="avatarURL">Avatar URL</label>
                <input
                  name="avatarURL"
                  type="text"
                  placeholder="Avatar URL"
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_button">
              <button>{isSignUp ? 'Sign up' : 'Sign in'}</button>
            </div>
          </form>
          <div className="auth__form-container_fields-account">
            <p>
              {
                isSignUp ?
                  'Already have an account?' :
                  'Don\'t have an account?'
              }
              <span onClick={switchMode}>
                {
                  isSignUp ? 'Sign In' : 'Sign up'
                }
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth