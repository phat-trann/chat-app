const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;
const client = StreamChat.getInstance(api_key, api_secret);

const signup = async (req, res) => {
  try {
    const { userName, password, phoneNumber } = req.body;
    const { users } = await client.queryUsers({ name: userName });

    if (users.length > 0) return res.status(200).json({ error: true, message: 'This user name already exits' });

    const userID = crypto.randomBytes(16).toString('hex');
    const serverClient = connect(api_key, api_secret, app_id);
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createUserToken(userID);

    res.status(200).json({ token, userName, userID, hashedPassword, phoneNumber });
  } catch (err) {
    console.log(err);

    res.status(200).json({
      error: true,
      message: err?.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const serverClient = connect(api_key, api_secret, app_id);
    const { users } = await client.queryUsers({ name: userName });

    if (!users.length) return res.status(200).json({ error: true, message: 'User not found' });

    const success = await bcrypt.compare(password, users[0].hashedPassword);
    const token = serverClient.createUserToken(users[0].id);

    if (success) {
      res.status(200).json({ token, fullName: users[0].userName, userID: users[0].id, hashedPassword: users[0].hashedPassword });
    } else {
      res.status(200).json({ error: true, message: 'Incorrect password' });
    }
  } catch (err) {
    console.log(err);

    res.status(200).json({
      error: true,
      message: err?.message
    });
  }
};

module.exports = {
  login,
  signup
}