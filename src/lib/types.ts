import type { Prisma, Reaction as PrismaReaction } from '@prisma/client';

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

export type Reaction = PrismaReaction;

// Base message type from Prisma
type BaseMessage = Prisma.MessageGetPayload<{
    include: { reactions: true }
}>;

// Add a status for optimistic UI
export type MessageWithReactions = BaseMessage & {
    status?: 'pending' | 'sent' | 'failed';
};
