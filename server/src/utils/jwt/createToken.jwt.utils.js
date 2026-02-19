import jwt from 'jsonwebtoken';

export const createToken = (data) => {
  try {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {
      expiresIn: '60h',
    });
  } catch (error) {
    console.error('JWT Sign Error:', error.message);
    return null;
  }
};
