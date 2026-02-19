import jwt from 'jsonwebtoken';

const verifyToken = (data) => {
  try {
    return jwt.verify(data, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

console.log(process.env.JWT_SECRET_KEY)
export default verifyToken;
