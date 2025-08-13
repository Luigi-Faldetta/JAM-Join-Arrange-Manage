import { Request, Response } from 'express';
import { User } from '../models/associations';
import { resBody } from '../utils';

/**
 * Delete all users from the database (admin only)
 * DANGER: This will permanently delete all user data
 */
const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    // Safety check - only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json(resBody(false, '403', null, 'Not allowed in production'));
    }

    // Delete all users
    const deletedCount = await User.destroy({
      where: {},
      truncate: true // This will reset auto-increment counters
    });

    console.log(`Deleted ${deletedCount} users from database`);

    res.status(200).json(resBody(true, null, { deletedCount }, `Deleted ${deletedCount} users`));
  } catch (err: any) {
    console.error('Error deleting users:', err);
    res.status(500).json(resBody(false, '500', null, err.message));
  }
};

export default { deleteAllUsers };