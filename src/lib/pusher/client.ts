// lib/pusher/client.ts
import PusherClient from 'pusher-js';

// This is a singleton instance of the Pusher client.
// We check if we are in a browser environment before creating it.
class PusherClientSingleton {
  private static instance: PusherClient;

  public static getInstance(): PusherClient {
    if (typeof window !== 'undefined' && !PusherClientSingleton.instance) {
      PusherClientSingleton.instance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: '/api/pusher/auth',
        authTransport: 'ajax',
      });
    }
    return PusherClientSingleton.instance;
  }
}

export const pusherClient = PusherClientSingleton.getInstance();