import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { useDispatch } from 'react-redux';
import { changeStatus, changeType, logout, update } from '../actions';
import { RESET_STATUS, STATUS_LOADING } from '../actions/types';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const EditForm = ({ form, handleChange, handleSubmitForm }) => {
  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <form onSubmit={handleSubmitForm}>
            <div className="auth__form-container_fields-content_input">
              <h3>Username: {form.userName}</h3>
            </div>

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

            <div className="auth__form-container_fields-content_button">
              <button>Submit Edit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const EditChannel = () => {
  const { client } = useChatContext();
  const initialForm = {
    userName: client?.user?.name || '',
    phoneNumber: client?.user?.phoneNumber || '',
    avatarURL: client?.user?.image || ''
  }
  const [form, setForm] = useState(initialForm);
  const dispatch = useDispatch();
  const handleSubmitForm = async (e) => {
    e.preventDefault();

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
  }

  const handleCloseSection = () => {
    dispatch(changeStatus(RESET_STATUS));
    dispatch(changeType(''));
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleLogout = () => {
    dispatch(changeStatus(STATUS_LOADING));
    dispatch(logout(client));
  }

  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Edit Profile</p>
        <div onClick={handleLogout}>
          Logout
        </div>
        <AiOutlineCloseCircle onClick={handleCloseSection} />
      </div>
      <EditForm form={form} handleChange={handleChange} handleSubmitForm={handleSubmitForm} />
    </div>
  )
}

export default EditChannel