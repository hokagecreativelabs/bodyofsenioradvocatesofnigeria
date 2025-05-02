import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/user.model';

export async function POST(request) {
  const { token } = await request.json();

  await dbConnect();

  const user = await User.findOne({
    activationToken: token,
    activationTokenExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
  }

  user.isActive = true;
  user.activationToken = undefined;
  user.activationTokenExpiresAt = undefined;
  await user.save();

  return NextResponse.json({ success: true, message: 'Account activated' });
}
