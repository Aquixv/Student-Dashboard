import jwt from 'jsonwebtoken';
import User from '../models/User';

export const getUserContext = async (req: any) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.API_SECRET || 'fallback_super_secret_key';
      
      const decoded: any = jwt.verify(token, secret);
    
      const user = await User.findById(decoded.id).select('-password');
      return { user };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { user: null };
    }
  }

  return { user: null };
};