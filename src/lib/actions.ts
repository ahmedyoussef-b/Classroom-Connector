'use server';

import prisma from './prisma';
import { revalidatePath } from 'next/cache';

export async function setStudentCareer(studentId: string, careerId: string | null) {
  await prisma.etatEleve.update({
    where: {
      eleveId: studentId,
    },
    data: {
      metierId: careerId,
    },
  });
  revalidatePath('/teacher/class/[id]', 'page');
  revalidatePath(`/student/${studentId}`);
}

export async function togglePunishment(studentId: string, classeId: string) {
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
    const senderId = formData.get('senderId') as string;
    const message = formData.get('message') as string;
    const chatroomId = formData.get('chatroomId') as string;
    const classeId = formData.get('classeId') as string;

    const user = await prisma.user.findUnique({ where: { id: senderId }});
    if (!user) return;

    await prisma.message.create({
        data: {
            message,
            senderId,
            senderName: user.name ?? 'Utilisateur inconnu',
            chatroomId,
        }
    });
    revalidatePath(`/teacher/class/${classeId}`);
}

export async function toggleReaction(messageId: string, emoji: string, userId: string, classeId: string) {
    const existingReaction = await prisma.reaction.findFirst({
        where: {
            messageId,
            emoji,
            userId,
        },
    });

    if (existingReaction) {
        await prisma.reaction.delete({
            where: {
                id: existingReaction.id,
            },
        });
    } else {
        await prisma.reaction.create({
            data: {
                messageId,
                emoji,
                userId,
            },
        });
    }
    revalidatePath(`/teacher/class/${classeId}`);
}

export async function getMessages(chatroomId: string) {
    return prisma.message.findMany({
        where: { chatroomId },
        include: { reactions: true },
        orderBy: { createdAt: 'asc' }
    });
}

export async function createClass(formData: FormData) {
  const nom = formData.get('nom') as string;
  const professeurId = formData.get('professeurId') as string;
  
  if (!nom || !professeurId) {
      throw new Error('Le nom de la classe et l\'ID du professeur sont requis.');
  }

  // 1. Create a new chatroom for the class
  const chatroom = await prisma.chatroom.create({
      data: {}
  });

  // 2. Create the class
  await prisma.classe.create({
    data: {
      nom,
      professeurId,
      chatroomId: chatroom.id,
    },
  });

  revalidatePath('/teacher');
}

export async function addStudentToClass(formData: FormData) {
    'use server';

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
