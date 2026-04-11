import mongoose, { Schema, Document } from 'mongoose';
import type { User } from '../../../../../packages/shared-types/src';
import { Router, Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';

// ─── Model ────────────────────────────────────────────────────────────────────
type UserDocument = User & Document;
const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const UserModel = mongoose.model<UserDocument>('User', UserSchema);

// ─── Service ──────────────────────────────────────────────────────────────────
class UsersService {
  async createUser(name: string, email: string): Promise<User> {
    const user = await UserModel.create({ name, email });
    return user.toObject() as User;
  }

  async getUserById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean<User>();
  }

  async getAllUsers(): Promise<User[]> {
    return UserModel.find().lean<User[]>();
  }
}

const usersService = new UsersService();

// ─── Controller + Routes ──────────────────────────────────────────────────────
const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) { sendError(res, 'name and email required', 422); return; }
  const user = await usersService.createUser(name, email);
  sendSuccess(res, user, 'User created', 201);
});

router.get('/', async (_req: Request, res: Response) => {
  const users = await usersService.getAllUsers();
  sendSuccess(res, users);
});

router.get('/:id', async (req: Request, res: Response) => {
  const user = await usersService.getUserById(req.params.id);
  if (!user) { sendError(res, 'User not found', 404); return; }
  sendSuccess(res, user);
});

export default router;
