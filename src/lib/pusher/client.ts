// lib/pusher/client.ts
import PusherClient from 'pusher-js';

// Forcer une configuration minimale
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!, 
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher/auth',
    auth: {
      params: {},
      headers: {}
    },
    enabledTransports: ['ws', 'wss'],
    disabledTransports: ['sockjs', 'xhr_polling', 'xhr_streaming']
  }
);
