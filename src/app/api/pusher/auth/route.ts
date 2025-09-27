// app/api/pusher/auth/route.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { pusherServer } from '@/lib/pusher/server';
import { getAuthSession } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🔐 [PUSHER-AUTH] === DEBUT AUTHENTIFICATION ===');
  
  try {
    // Récupérer la session
    const session = await getAuthSession();
    console.log('🔐 [PUSHER-AUTH] Session trouvée:', !!session);
    
    if (!session?.user?.id) {
      console.log('❌ [PUSHER-AUTH] Aucun utilisateur authentifié');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Lire le body
    const bodyText = await request.text();
    console.log('🔐 [PUSHER-AUTH] Body reçu:', bodyText);
    
    const params = new URLSearchParams(bodyText);
    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');

    console.log('🔐 [PUSHER-AUTH] Paramètres:', { socketId, channelName });

    if (!socketId || !channelName) {
      console.log('❌ [PUSHER-AUTH] Paramètres manquants');
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Autoriser les canaux publics ET privés pour le test
    const isPublicChannel = channelName.startsWith('public-');
    const isPrivateChannel = channelName.startsWith('private-');
    
    if (!isPublicChannel && !isPrivateChannel) {
      console.log('❌ [PUSHER-AUTH] Type de canal non autorisé');
      return new Response(JSON.stringify({ error: 'Invalid channel type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🔐 [PUSHER-AUTH] Tentative d\'autorisation...');
    
    // Pour les canaux publics, auth simple
    if (isPublicChannel) {
      const authResponse = pusherServer.authorizeChannel(socketId, channelName);
      console.log('✅ [PUSHER-AUTH] Canal public autorisé');
      return new Response(JSON.stringify(authResponse), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Pour les canaux privés, auth avec user data
    const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
      user_id: session.user.id,
      user_info: {
        name: session.user.name || 'Utilisateur',
        email: session.user.email || 'user@example.com',
      },
    });

    console.log('✅ [PUSHER-AUTH] Autorisation réussie');
    return new Response(JSON.stringify(authResponse), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ [PUSHER-AUTH] Erreur critique:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Ajoutez aussi la méthode OPTIONS pour CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
