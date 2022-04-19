import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { MdError } from 'react-icons/md';

const cookies = new Cookies();

const initialForm = {
  userName: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  avatarURL: ''
}

const Auth = () => {
  const [form, setForm] = useState(initialForm);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!form.userName && !form.password) {
      setErrorMessage('Some fields is missing!');
      return;
    }

    if (isSignUp) {
      if (Object.values(form).some(el => !el)) {
        setErrorMessage('Some fields is missing!');
        return;
      }
      else if (form.password !== form.confirmPassword) {
        setErrorMessage('Password do NOT match!');
        return;
      }
    }

    const { userName, password, phoneNumber, avatarURL } = form;
    const URL = `${process.env.REACT_APP_HOST}/auth`;
    const { data: { token, userID, hashedPassword, error, message } } = await axios.post(`${URL}/${isSignUp ? 'signup' : 'login'}`, {
      userName, password, phoneNumber, avatarURL
    });

    if (error) {
      setErrorMessage(message);
      return;
    }

    cookies.set('token', token);
    cookies.set('userName', userName);
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

  useEffect(() => {
    setForm(initialForm);
  }, [isSignUp])

  useEffect(() => {
    let timeOut;

    if (errorMessage) {
      timeOut = setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }

    return () => {
      clearTimeout(timeOut);
    }
  });

  return (
    <div className="auth__form-container">
      <div className={`auth__form-error${errorMessage ? ' show' : ''}`}>
        <MdError />
        <span>{errorMessage}</span>
      </div>
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>{isSignUp ? 'Sign up' : 'Sign in'}</p>
          <form onSubmit={handleSubmitForm}>
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="userName">* Username</label>
              <input
                name="userName"
                type="text"
                placeholder="Username"
                value={form.userName}
                onChange={handleChange}
                required
              />
            </div>

            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="phoneNumber">* Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  maxLength={10}
                  value={form.phoneNumber}
                  onChange={handleChange}
                  pattern="(\d{10})"
                  required
                />
              </div>
            )}

            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="avatarURL">Avatar URL (jpg or png)</label>
                <input
                  name="avatarURL"
                  type="text"
                  placeholder="Avatar URL"
                  value={form.avatarURL}
                  onChange={handleChange}
                  pattern="(https?:\/\/.*\.(?:png|jpg))"
                />
              </div>
            )}

            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">* Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {isSignUp && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="confirmPassword">* Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
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