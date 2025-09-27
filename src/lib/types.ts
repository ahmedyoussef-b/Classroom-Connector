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

export type MessageWithReactions = Prisma.MessageGetPayload<{
    include: { reactions: true }
}>
