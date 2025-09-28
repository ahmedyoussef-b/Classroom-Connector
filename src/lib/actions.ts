'use server';

import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { getAuthSession } from './session';
import { pusherServer } from './pusher/server';
import type { MessageWithReactions } from './types';


async function getCurrentUser() {
    const session = await getAuthSession();
    if (!session?.user?.id) {
        throw new Error("Utilisateur non authentifié");
    }
    return session.user;
}

export async function setStudentCareer(studentId: string, careerId: string | null) {
  // TODO: Check if user is a teacher
  await prisma.etatEleve.update({
    where: {
      eleveId: studentId,
    },
    data: {
      metierId: careerId,
    },
  });
  revalidatePath(`/student/${studentId}`);
  revalidatePath('/teacher/class/[id]', 'page');
}

export async function togglePunishment(studentId: string, classeId: string) {
    // TODO: Check if user is a teacher
    const studentState = await prisma.etatEleve.findUnique({
        where: {
            eleveId: studentId,
        },
    });

  await prisma.etatEleve.update({
    where: {
      eleveId: studentId,
    },
    data: {
      isPunished: !studentState?.isPunished,
    },
  });
  revalidatePath(`/teacher/class/${classeId}`);
  revalidatePath(`/student/${studentId}`);
}

export async function sendMessage(formData: FormData) {
    const user = await getCurrentUser();
    const messageContent = formData.get('message') as string;
    const chatroomId = formData.get('chatroomId') as string;

    if (!messageContent || !chatroomId) {
        throw new Error("Contenu du message ou ID du salon de discussion manquant.");
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
    if (!dbUser) throw new Error("Utilisateur non trouvé.");

    const newMessage = await prisma.message.create({
        data: {
            message: messageContent,
            senderId: user.id,
            senderName: dbUser.name ?? 'Utilisateur inconnu',
            chatroomId,
        },
        include: {
            reactions: {
                include: {
                    user: {
                        select: { name: true, id: true }
                    }
                }
            }
        }
    });
    
    const channelName = `presence-chatroom-${chatroomId}`;
    await pusherServer.trigger(
        channelName,
        'new-message',
        newMessage
    );
}

export async function toggleReaction(messageId: string, emoji: string) {
    const user = await getCurrentUser();
    
    const message = await prisma.message.findUnique({
        where: { id: messageId },
    });
    if (!message) throw new Error("Message non trouvé");

    const existingReaction = await prisma.reaction.findFirst({
        where: {
            messageId,
            emoji,
            userId: user.id,
        },
    });

    let action: 'added' | 'removed';
    let reaction;

    if (existingReaction) {
        await prisma.reaction.delete({
            where: { id: existingReaction.id },
        });
        action = 'removed';
        reaction = existingReaction; // We need the ID for the client to filter
    } else {
        reaction = await prisma.reaction.create({
            data: {
                messageId,
                emoji,
                userId: user.id,
            },
            include: {
                user: { select: { name: true, id: true } }
            }
        });
        action = 'added';
    }
    
    const channelName = `presence-chatroom-${message.chatroomId}`;
    await pusherServer.trigger(
        channelName,
        'reaction-update',
        { 
            messageId,
            reaction,
            action
        }
    );
}

export async function getMessages(chatroomId: string): Promise<MessageWithReactions[]> {
    return prisma.message.findMany({
        where: { chatroomId },
        include: { 
            reactions: {
                include: {
                    user: {
                        select: { name: true, id: true }
                    }
                }
            } 
        },
        orderBy: { createdAt: 'asc' }
    });
}

export async function createClass(formData: FormData) {
  const user = await getCurrentUser();
  if (user.role !== 'PROFESSEUR') {
      throw new Error("Seul un professeur peut créer une classe.");
  }
  const nom = formData.get('nom') as string;
  
  if (!nom) {
      throw new Error('Le nom de la classe est requis.');
  }

  const chatroom = await prisma.chatroom.create({
      data: {}
  });

  await prisma.classe.create({
    data: {
      nom,
      professeurId: user.id,
      chatroomId: chatroom.id,
    },
  });

  revalidatePath('/teacher');
}

export async function addStudentToClass(formData: FormData) {
    const user = await getCurrentUser();
    if (user.role !== 'PROFESSEUR') {
      throw new Error("Seul un professeur peut ajouter un élève.");
    }
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const ambition = formData.get('ambition') as string;
    const classeId = formData.get('classeId') as string;

    if (!name || !email || !classeId) {
        throw new Error('Le nom, l\'email et l\'ID de la classe sont requis.');
    }

    const newStudent = await prisma.user.create({
        data: {
            name,
            email,
            ambition,
            classeId,
            role: 'ELEVE',
        },
    });

    await prisma.etatEleve.create({
        data: {
            eleveId: newStudent.id,
            isPunished: false,
        },
    });

    revalidatePath(`/teacher/class/${classeId}`);
}

export async function getStudentByEmail(email: string) {
    return prisma.user.findFirst({
        where: {
            email,
            role: 'ELEVE'
        },
    });
}

export async function createSession(professeurId: string, studentIds: string[]) {
    const user = await getCurrentUser();
    if (user.role !== 'PROFESSEUR' || user.id !== professeurId) {
      throw new Error("Action non autorisée.");
    }

    const session = await prisma.session.create({
        data: {
            professeurId,
            participants: {
                connect: studentIds.map(id => ({ id }))
            }
        }
    });

    revalidatePath('/teacher/class/[id]', 'layout');
    studentIds.forEach(id => revalidatePath(`/student/${id}`));

    return session;
}
