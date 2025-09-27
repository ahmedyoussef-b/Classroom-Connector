import type { Prisma } from '@prisma/client';

export type UserWithClasse = Prisma.UserGetPayload<{
    include: { classe: true }
}>

export type ClasseWithUsers = Prisma.ClasseGetPayload<{
    include: { eleves: true, professeur: true }
}>

export type StudentWithStateAndCareer = Prisma.UserGetPayload<{
    include: { 
        etat: {
            include: {
                metier: true
            }
        },
        sessionsParticipees: true,
        classe: true
    }
}>

export type MessageWithReactions = Prisma.MessageGetPayload<{
    include: { reactions: true }
}>
