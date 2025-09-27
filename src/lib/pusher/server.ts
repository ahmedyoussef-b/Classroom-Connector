// lib/pusher/server.ts
import PusherServer from 'pusher';

console.log('🔧 [PUSHER-SERVER] Configuring Pusher server...');
console.log('🔧 [PUSHER-SERVER] Environment check:', {
  appId: process.env.PUSHER_APP_ID ? '✅ Present' : '❌ Missing',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY ? '✅ Present' : '❌ Missing',
  secret: process.env.PUSHER_SECRET ? '✅ Present' : '❌ Missing',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ? '✅ Present' : '❌ Missing',
});

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});
