// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clean up existing data
  await prisma.reaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.etatEleve.deleteMany();
  await prisma.user.deleteMany();
  await prisma.classe.deleteMany();
  await prisma.metier.deleteMany();
  await prisma.chatroom.deleteMany();

  // Create careers (métiers)
  const pompier = await prisma.metier.create({
    data: {
      nom: 'Pompier',
      description: 'Protège les personnes et les biens des incendies.',
      theme: {
        backgroundColor: 'from-red-500 to-orange-500',
        textColor: 'text-white',
        primaryColor: '24 96% 59%', // orange-500
        accentColor: '0 84% 60%', // red-500
        cursor: 'cursor-crosshair',
        backgroundImage: 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
    },
  });

  const astronaute = await prisma.metier.create({
    data: {
      nom: 'Astronaute',
      description: "Explore l'espace et voyage vers d'autres planètes.",
      theme: {
        backgroundColor: 'from-gray-800 to-blue-900',
        textColor: 'text-white',
        primaryColor: '217 91% 60%', // blue-500
        accentColor: '221 39% 11%', // gray-900
        cursor: 'cursor-grab',
        backgroundImage: 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
    },
  });

  const veterinaire = await prisma.metier.create({
    data: {
      nom: 'Vétérinaire',
      description: 'Soigne les animaux malades et blessés.',
      theme: {
        backgroundColor: 'from-green-400 to-teal-500',
        textColor: 'text-white',
        primaryColor: '162 72% 47%', // teal-500
        accentColor: '142 58% 58%', // green-400
        cursor: 'cursor-help',
        backgroundImage: 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
    },
  });

  console.log('Careers created.');

  // Create a teacher
  const teacher = await prisma.user.create({
    data: {
      id: 'teacher-id',
      email: 'teacher@example.com',
      name: 'M. Dupont',
      role: Role.PROFESSEUR,
    },
  });

  console.log('Teacher created.');

  // Create a chatroom
  const chatroom = await prisma.chatroom.create({
    data: {},
  });

  // Create a class
  const classeA = await prisma.classe.create({
    data: {
      nom: 'Classe A',
      professeurId: teacher.id,
      chatroomId: chatroom.id,
    },
  });

  console.log('Class created.');

  // Create students
  const studentsData = [
    { name: 'Alice', ambition: 'devenir pompier' },
    { name: 'Bob', ambition: 'explorer Mars' },
    { name: 'Charlie', ambition: 'soigner les animaux' },
    { name: 'Diana', ambition: "être une artiste célèbre" },
  ];

  for (let i = 0; i < studentsData.length; i++) {
    const student = await prisma.user.create({
      data: {
        id: (i + 1).toString(),
        email: `student${i + 1}@example.com`,
        name: studentsData[i].name,
        role: Role.ELEVE,
        ambition: studentsData[i].ambition,
        classeId: classeA.id,
      },
    });

    await prisma.etatEleve.create({
      data: {
        eleveId: student.id,
        isPunished: false,
        // Assign a career to some students for demonstration
        metierId: i < 3 ? [pompier.id, astronaute.id, veterinaire.id][i] : undefined,
      },
    });
  }

  console.log('Students and their states created.');

  // Create some messages in the chatroom
  await prisma.message.create({
    data: {
        message: "Bonjour la classe! N'oubliez pas vos devoirs pour demain.",
        senderId: teacher.id,
        senderName: teacher.name!,
        chatroomId: chatroom.id,
    }
  });

  await prisma.message.create({
    data: {
        message: "Bonjour Monsieur, j'ai une question sur l'exercice 3.",
        senderId: '1', // Alice
        senderName: 'Alice',
        chatroomId: chatroom.id,
    }
  });

  console.log('Messages created.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
