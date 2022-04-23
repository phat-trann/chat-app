import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { changeStatus, changeType, login } from '../actions';
import { useDispatch } from 'react-redux';
import { STATUS_LOADING } from '../actions/types';
import { Box, Button, Container, TextField, Typography, FormLabel, Link } from '@mui/material';

const initialForm = {
  userName: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  avatarURL: ''
};

const Auth = ({ client }) => {
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState(initialForm);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userNameRef = useRef();
  const dispatch = useDispatch();

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    let missingFields = Object.keys(form).map((element) => {
      if (
        (!isSignUp && element !== 'userName' && element !== 'password') ||
        (element === 'avatarURL' && !form[element])
      )
        return '';

      return !form[element] ? element : '';
    });

    let resetFormError = {
      ...initialForm
    };

    missingFields.forEach((element) => {
      if (element) {
        resetFormError = {
          ...resetFormError,
          [element]: 'Please input this field.'
        };
      }
    });

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      resetFormError = {
        ...resetFormError,
        password: 'Please make sure your passwords match.',
        confirmPassword: 'Please make sure your passwords match.'
      };
    }

    if (form.phoneNumber && !form.phoneNumber.match(/\d{10}/g)) {
      resetFormError = {
        ...resetFormError,
        phoneNumber: 'Invalid phone number.'
      };
    }

    if (form.avatarURL && !form.avatarURL.match(/https?:\/\/.*\.(?:png|jpg)/g)) {
      resetFormError = {
        ...resetFormError,
        avatarURL: 'Invalid image link (.jpg or .png only).'
      };
    }

    setFormError(resetFormError);

    if (Object.values(resetFormError).some((el) => !!el)) return;

    const { userName, password, phoneNumber, avatarURL } = form;
    const URL = `${process.env.REACT_APP_HOST}/auth`;
    const {
      data: { token, userID, userPhoneNumber, hashedPassword, error, errorType, message }
    } = await axios.post(`${URL}/${isSignUp ? 'signup' : 'login'}`, {
      userName,
      password,
      phoneNumber,
      avatarURL
    });

    if (error && errorType && message) {
      setFormError({
        ...resetFormError,
        [errorType]: message
      });
      return;
    }

    dispatch(login({ token, userID, userName, userPhoneNumber, hashedPassword, client }));
    dispatch(changeType(''));
    dispatch(changeStatus(STATUS_LOADING));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setForm(initialForm);
  }, [isSignUp]);

  useEffect(() => {
    let timeOut;

    if (errorMessage) {
      timeOut = setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [errorMessage]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Typography
          component="h1"
          variant="h3"
          sx={{ width: '100%', mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          FERB<FormLabel sx={{ fontSize: '0.75em' }}>ooK</FormLabel>
        </Typography>
        <Typography component="h1" variant="h5" sx={{ width: '100%' }}>
          {isSignUp ? 'Sign up' : 'Sign in'}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmitForm}
          noValidate
          sx={{ mt: 1 }}
          autoComplete="off">
          <TextField
            margin="dense"
            required
            fullWidth
            placeholder="Username *"
            name="userName"
            autoFocus
            onChange={handleChange}
            value={form.userName}
            error={!!formError.userName}
            helperText={formError.userName}
            inputRef={userNameRef}
          />
          {isSignUp && (
            <TextField
              margin="dense"
              required
              fullWidth
              placeholder="Phone Number *"
              name="phoneNumber"
              onChange={handleChange}
              value={form.phoneNumber}
              error={!!formError.phoneNumber}
              helperText={formError.phoneNumber}
              inputProps={{
                maxLength: 10
              }}
            />
          )}
          {isSignUp && (
            <TextField
              margin="dense"
              fullWidth
              placeholder="Avatar URL"
              name="avatarURL"
              onChange={handleChange}
              value={form.avatarURL}
              error={!!formError.avatarURL}
              helperText={formError.avatarURL}
              maxLength={10}
            />
          )}
          <TextField
            margin="dense"
            required
            fullWidth
            placeholder="Password *"
            name="password"
            type="password"
            onChange={handleChange}
            value={form.password}
            error={!!formError.password}
            helperText={formError.password}
          />
          {isSignUp && (
            <TextField
              margin="dense"
              required
              fullWidth
              placeholder="Confirm Password *"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              value={form.confirmPassword}
              error={!!formError.confirmPassword}
              helperText={formError.confirmPassword}
            />
          )}
          <Button fullWidth variant="contained" type="submit" size="large" sx={{ mt: 3, mb: 2 }}>
            {isSignUp ? 'Sign up' : 'Sign in'}
          </Button>
        </Box>
        <FormLabel>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Link
            href="#"
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              setFormError(initialForm);
              setIsSignUp((pre) => !pre);
              userNameRef.current.focus();
            }}>
            {isSignUp ? 'Sign In' : 'Sign up'}
          </Link>
        </FormLabel>
      </Box>
    </Container>
  );
};

export default Auth;
