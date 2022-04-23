import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { useDispatch } from 'react-redux';
import { changeStatus, changeType, logout, update } from '../actions';
import { RESET_STATUS, SHOW_MENU, STATUS_LOADING } from '../actions/types';
import { HeaderForChange, AlertDialog } from './';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';

const EditForm = ({ form, formError, handleChange, handleSubmitForm }) => {
  return (
    <Container component="main">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Box
          component="form"
          onSubmit={handleSubmitForm}
          noValidate
          sx={{ mt: 1 }}
          autoComplete="off">
          <Typography component="h1" variant="h5" sx={{ width: '100%', mb: 2 }}>
            Username: {form.userName}
          </Typography>
          <TextField
            margin="dense"
            required
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            onChange={handleChange}
            value={form.phoneNumber}
            error={!!formError.phoneNumber}
            helperText={formError.phoneNumber}
            inputProps={{
              maxLength: 10
            }}
          />
          <TextField
            margin="dense"
            fullWidth
            label="Avatar URL"
            name="avatarURL"
            onChange={handleChange}
            value={form.avatarURL}
            error={!!formError.avatarURL}
            helperText={formError.avatarURL}
            maxLength={10}
          />
          <Button variant="contained" type="submit" size="large" sx={{ mt: 3, mb: 2 }}>
            Submit Edit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

const EditChannel = () => {
  const { client } = useChatContext();
  const initialForm = {
    userName: client?.user?.name || '',
    phoneNumber: client?.user?.phoneNumber || '',
    avatarURL: client?.user?.image || ''
  };
  let formErrorObject = {
    phoneNumber: '',
    avatarURL: ''
  };
  const [form, setForm] = useState(initialForm);
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState(formErrorObject);
  const dispatch = useDispatch();
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!form.phoneNumber) {
      formErrorObject = {
        ...formErrorObject,
        phoneNumber: 'Please input this field.'
      };
    } else if (form.phoneNumber && !form.phoneNumber.match(/\d{10}/g)) {
      formErrorObject = {
        ...formErrorObject,
        phoneNumber: 'Invalid phone number.'
      };
    }

    if (form.avatarURL && !form.avatarURL.match(/https?:\/\/.*\.(?:png|jpg)/g)) {
      formErrorObject = {
        ...formErrorObject,
        avatarURL: 'Invalid image link (.jpg or .png only).'
      };
    }

    setFormError(formErrorObject);

    if (Object.values(formErrorObject).some((el) => !!el)) return;
    setOpen(true);
  };

  const handleChangeProfile = async () => {
    const updateData = {
      id: client.userID,
      set: {
        phoneNumber: form.phoneNumber,
        image: form.avatarURL
      }
    };

    const response = await client.partialUpdateUser(updateData);

    if (response) {
      dispatch(update(client, form.avatarURL));
      handleCloseSection();
    }
  };

  const handleCloseSection = () => {
    dispatch(changeStatus(RESET_STATUS));
    dispatch(changeType(''));
    dispatch(changeStatus(SHOW_MENU));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    dispatch(changeStatus(STATUS_LOADING));
    dispatch(logout(client));
    dispatch(changeStatus(SHOW_MENU));
  };

  return (
    <Container
      component="main"
      sx={{
        height: 'calc(100vh - 96px)',
        mt: 10,
        mb: 2
      }}>
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: '25px',
          maxHeight: '100%',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}>
        <Box
          sx={{
            padding: 6,
            pl: {
              xs: 2.5
            },
            pr: {
              xs: 2.5
            }
          }}>
          <HeaderForChange
            customHandle={handleLogout}
            handleClose={handleCloseSection}
            isCustomLogout={true}>
            <IconButton>
              <Edit sx={{ width: '28px', height: '28px' }} />
            </IconButton>
            Edit Profile
          </HeaderForChange>
          <EditForm
            form={form}
            formError={formError}
            handleChange={handleChange}
            handleSubmitForm={handleSubmitForm}
          />
        </Box>
        <AlertDialog
          open={open}
          content={'Are you sure you want to change your profile?'}
          handleClose={() => setOpen(false)}
          handleAgree={() => {
            handleChangeProfile();
            setOpen(false);
            dispatch(changeStatus(SHOW_MENU));
          }}
        />
      </Box>
    </Container>
  );
};

export default EditChannel;
