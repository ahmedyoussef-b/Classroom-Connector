// src/app/api/pusher/auth/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher/server';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const data = await req.text();
  const [socketId, channelName] = data.split('&').map((str) => str.split('=')[1]);
  
  const
   userData = {
    user_id: session.user.id,
    user_info: {
      name: session.user.name,
      email: session.user.email,
    },
  };

  try {
    const authResponse = pusherServer.authorizeChannel(socketId, channelName, userData);
    return new NextResponse(JSON.stringify(authResponse));
  } catch (error) {
    console.error('Pusher auth error:', error);
    return new NextResponse('Forbidden', { status: 403 });
  }
}
