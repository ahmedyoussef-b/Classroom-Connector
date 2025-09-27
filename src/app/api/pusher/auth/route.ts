// src/app/api/pusher/auth/route.ts
import { pusherServer } from '@/lib/pusher/server';
import { getAuthSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 [PUSHER-AUTH] === DEBUT ===');
    
    const session = await getAuthSession();
    console.log('🔐 [PUSHER-AUTH] Session user:', session?.user?.id);
    
    if (!session?.user?.id) {
      console.log('❌ [PUSHER-AUTH] No session');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const bodyText = await request.text();
    console.log('🔐 [PUSHER-AUTH] Raw body:', bodyText);
    
    const params = new URLSearchParams(bodyText);
    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');

    console.log('🔐 [PUSHER-AUTH] Params:', { socketId, channelName });

    if (!socketId || !channelName) {
      console.log('❌ [PUSHER-AUTH] Missing params');
      return new Response(JSON.stringify({ error: 'Missing socket_id or channel_name' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Autoriser uniquement les canaux privés de chatroom
    if (!channelName.startsWith('private-chatroom-')) {
      console.log('❌ [PUSHER-AUTH] Invalid channel name');
      return new Response(JSON.stringify({ error: 'Invalid channel' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const authResponse = pusherServer.authorizeChannel(
      socketId, 
      channelName, 
      {
        user_id: session.user.id,
        user_info: {
          name: session.user.name || 'User',
          email: session.user.email || 'user@example.com',
        },
      }
    );

    console.log('✅ [PUSHER-AUTH] Success, returning auth');
    return new Response(JSON.stringify(authResponse), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ [PUSHER-AUTH] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
