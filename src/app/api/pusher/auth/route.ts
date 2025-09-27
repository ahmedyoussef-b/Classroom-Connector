// src/app/api/pusher/auth/route.ts
import { pusherServer } from '@/lib/pusher/server';
import { getAuthSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('🔒 Pusher auth request received');
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      console.error('🚫 Pusher auth failed: Unauthorized (no session)');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.text();
    const params = new URLSearchParams(data);
    
    const socketId = params.get('socket_id');
    const channel = params.get('channel_name');

    if (!socketId || !channel) {
       console.error('🚫 Pusher auth failed: Bad Request (missing socketId or channel)');
      return new NextResponse('Bad Request', { status: 400 });
    }

    // For private channels, authentication is sufficient.
    // For presence channels, you would include user_info.
    // Since we are now using private channels, we don't need to pass user_info.
    const authResponse = pusherServer.authorizeChannel(socketId, channel);
    
    console.log(`✅ Pusher auth successful for user ${session.user.id} on channel ${channel}`);
    return new NextResponse(JSON.stringify(authResponse));
  } catch (error) {
    console.error('💥 Pusher auth error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
