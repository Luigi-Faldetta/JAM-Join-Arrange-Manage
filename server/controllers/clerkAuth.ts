import { Request, Response } from 'express';
import { User } from '../models/associations';
import { resBody } from '../utils';
import jwt from 'jsonwebtoken';

/**
 * Sync a Clerk user with the backend database
 * Creates a new user if they don't exist, or returns existing user
 * @param req needs body with Clerk user data: { clerkId, email, name, profilePic? }
 */
const syncClerkUser = async (req: Request, res: Response) => {
  const { clerkId, email, name, profilePic } = req.body;

  if (!clerkId || !email || !name) {
    return res
      .status(400)
      .json(resBody(false, '400', null, 'Missing required user data'));
  }

  try {
    // Check if user already exists by email
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user for Clerk OAuth users
      // Use clerkId as password (it won't be used for login)
      user = await User.create({
        name,
        email,
        password: clerkId, // This won't be used for authentication
        phone: '', // Empty string for optional phone field
        profilePic: profilePic || '',
      });
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET || process.env.TOKEN_SECRET as string,
      { expiresIn: '2h' }
    );

    const { password, ...safeUser } = { ...user.dataValues };

    res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
      message: 'User synced successfully',
    });
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error('Clerk sync error:', err);
    res.status(500).json(resBody(false, '500', null, err.message));
  }
};

export default { syncClerkUser };