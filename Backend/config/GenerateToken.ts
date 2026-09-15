import jwt from 'jsonwebtoken';
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.API_SECRET as string, {
    expiresIn: '6h',
  });
};

export default generateToken;