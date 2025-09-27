// src/app/api/pusher/auth/route.ts
import { pusherServer } from '@/lib/pusher/server';
import { getAuthSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('🔐 [PUSHER-AUTH] === DEBUT AUTHENTIFICATION ===');
  try {
    const session = await getAuthSession();
    console.log('🔐 [PUSHER-AUTH] Session:', session ? '✅ Trouvée' : '❌ Non trouvée');
    
    if (!session?.user?.id) {
      console.error('❌ [PUSHER-AUTH] Authentification échouée: Non autorisé (pas de session)');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.text();
    const params = new URLSearchParams(data);
    
    const socketId = params.get('socket_id');
    const channel = params.get('channel_name');

    console.log('🔐 [PUSHER-AUTH] Données reçues:', { 
      socketId,
      channel,
      userId: session.user.id 
    });

    if (!socketId || !channel) {
       console.error('❌ [PUSHER-AUTH] Authentification échouée: Mauvaise requête (socketId ou channel manquant)');
      return new NextResponse('Bad Request', { status: 400 });
    }

    // Pour les canaux privés, l'authentification est suffisante.
    const authResponse = pusherServer.authorizeChannel(socketId, channel);
    
    console.log(`✅ [PUSHER-AUTH] Autorisation réussie pour l'utilisateur ${session.user.id} sur le canal ${channel}`);
    return new NextResponse(JSON.stringify(authResponse));
  } catch (error) {
    console.error('💥 [PUSHER-AUTH] Erreur critique durant l\'authentification:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
