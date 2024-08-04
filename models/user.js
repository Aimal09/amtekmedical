import {ExecuteSPAsync} from '../database.js';
import bcrypt from 'bcryptjs';

export const AddUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const [result] = await ExecuteSPAsync(`Call AddUser ('${user.username}', '${hashedPassword}')`);
  return { id: result.insertId, ...user, password: hashedPassword };
};

export const GetUserByUsername = async (username) => {
  const [row] = await ExecuteSPAsync(`CALL LoginUser('${username}');`);
  return row;
};