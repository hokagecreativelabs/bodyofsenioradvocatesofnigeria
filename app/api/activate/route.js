import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/user.model';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ success: false, message: 'Missing token or password' }, { status: 400 });
  }

  await dbConnect();

  const user = await User.findOne({
    activationToken: token,
    activationTokenExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword; // ← ensure `password` field exists in schema
  user.isActive = true;
  user.activationToken = undefined;
  user.activationTokenExpiresAt = undefined;
  await user.save();

  return NextResponse.json({ success: true, message: 'Account activated successfully' });
}
