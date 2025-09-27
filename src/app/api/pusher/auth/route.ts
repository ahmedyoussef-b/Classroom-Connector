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

    // Envisagez d'ajouter ici une logique de vérification pour s'assurer
    // que l'utilisateur est autorisé à rejoindre ce canal spécifique.
    // Par exemple, vérifier s'il fait partie de la classe associée à ce chat.

    const presenceData = {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        email: session.user.email,
      },
    };

    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channel,
      presenceData
    );
    
    console.log(`✅ Pusher auth successful for user ${session.user.id} on channel ${channel}`);
    return new NextResponse(JSON.stringify(authResponse));
  } catch (error) {
    console.error('💥 Pusher auth error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
