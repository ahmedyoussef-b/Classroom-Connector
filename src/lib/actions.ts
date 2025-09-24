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
  revalidatePath('/teacher/class-a');
  revalidatePath(`/student/${studentId}`);
}

export async function togglePunishment(studentId: string) {
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
  revalidatePath('/teacher/class-a');
  revalidatePath(`/student/${studentId}`);
}

export async function sendMessage(formData: FormData) {
    const senderId = formData.get('senderId') as string;
    const message = formData.get('message') as string;
    const chatroomId = formData.get('chatroomId') as string;

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
    revalidatePath('/teacher/class-a');
}

export async function toggleReaction(messageId: string, emoji: string, userId: string) {
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
    revalidatePath('/teacher/class-a');
}

export async function getMessages(chatroomId: string) {
    return prisma.message.findMany({
        where: { chatroomId },
        include: { reactions: true },
        orderBy: { createdAt: 'asc' }
    });
}
