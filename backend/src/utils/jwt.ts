import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for user
 */
export const generateToken = (payload: {
  id: string;
  email: string;
  role: 'user' | 'admin';
}): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '7d', // Token valid for 7 days
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
