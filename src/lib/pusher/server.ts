// lib/pusher/server.ts
import PusherServer from 'pusher';

console.log('🔧 [PUSHER-SERVER] Configuration vérification:', {
  appId: process.env.PUSHER_APP_ID?.substring(0, 10) + '...',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY?.substring(0, 10) + '...',
  secret: process.env.PUSHER_SECRET?.substring(0, 10) + '...',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

if (!process.env.PUSHER_APP_ID || !process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.PUSHER_SECRET || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('❌ [PUSHER-SERVER] Variables d\'environnement manquantes');
}

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});
