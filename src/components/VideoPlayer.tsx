// src/components/VideoPlayer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, VideoOff } from "lucide-react";

interface VideoPlayerProps {
  userId: string; // To identify the user stream in the future
}

export function VideoPlayer({ userId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
        setHasPermission(null);
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;
          setHasPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error(`Error accessing media devices for user ${userId}:`, error);
          setHasPermission(false);
          toast({
            variant: 'destructive',
            title: 'Accès média refusé',
            description: 'Veuillez autoriser l\'accès à la caméra et au microphone.',
          });
        }
    };

    getCameraPermission();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [userId, toast]);

  return (
    <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

      {hasPermission === null && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="mt-2 text-sm">Chargement...</p>
        </div>
      )}

      {hasPermission === false && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/20 text-destructive-foreground p-2 text-center">
            <VideoOff className="h-8 w-8 mb-2" />
            <p className="text-xs font-semibold">Caméra indisponible</p>
        </div>
      )}
    </div>
  );
}
