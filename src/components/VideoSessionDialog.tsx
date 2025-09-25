
"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, VideoOff } from "lucide-react";

interface VideoSessionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  studentNames: string;
}

export function VideoSessionDialog({ isOpen, onOpenChange, studentNames }: VideoSessionDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (isOpen) {
        setHasCameraPermission(null); // Reset on open
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Accès à la caméra refusé',
            description: 'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.',
          });
        }
      } else {
        // Cleanup when dialog is closed
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
      }
    };

    getCameraPermission();

    // Cleanup function to stop media tracks when the component unmounts or dialog closes
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Session en direct</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de démarrer une session avec : <span className="font-bold">{studentNames}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

          {hasCameraPermission === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-2">En attente de l'accès à la caméra...</p>
            </div>
          )}

          {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive">
                <VideoOff className="h-12 w-24" />
                <Alert variant="destructive" className="mt-4 mx-4 text-left">
                    <AlertTitle>Accès à la caméra requis</AlertTitle>
                    <AlertDescription>
                        Pour continuer, veuillez autoriser l'accès à votre caméra et à votre microphone dans les paramètres de votre navigateur.
                    </AlertDescription>
                </Alert>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Terminer la session</Button>
          <Button disabled={!hasCameraPermission}>Démarrer la diffusion</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
