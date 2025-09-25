// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Démarrage du seeding...');

  // Clean up existing data
  console.log('🧹 Nettoyage des anciennes données...');
  await prisma.reaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.etatEleve.deleteMany();
  await prisma.user.deleteMany();
  await prisma.classe.deleteMany();
  await prisma.metier.deleteMany();
  await prisma.chatroom.deleteMany();
  console.log('✅ Données nettoyées.');

  // Create careers (métiers)
  console.log('🎨 Création des métiers...');
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
  console.log('✅ Métiers créés.');

  // Create a teacher
  console.log('🧑‍🏫 Création du professeur...');
  const teacher = await prisma.user.create({
    data: {
      id: 'teacher-id',
      email: 'teacher@example.com',
      name: 'M. Dupont',
      role: Role.PROFESSEUR,
    },
  });
  console.log('✅ Professeur créé.');

  // Create a chatroom
  console.log('💬 Création du salon de discussion...');
  const chatroom = await prisma.chatroom.create({
    data: {},
  });
  console.log('✅ Salon de discussion créé.');

  // Create a class
  console.log('🏫 Création de la classe...');
  const classeA = await prisma.classe.create({
    data: {
      nom: 'Classe A',
      professeurId: teacher.id,
      chatroomId: chatroom.id,
    },
  });
  console.log('✅ Classe créée.');

  // Create students
  console.log('🧑‍🎓 Création des élèves...');
  const studentsData = [
    { name: 'Alice', ambition: 'devenir pompier', email: 'student1@example.com' },
    { name: 'Bob', ambition: 'explorer Mars', email: 'student2@example.com' },
    { name: 'Charlie', ambition: 'soigner les animaux', email: 'student3@example.com' },
    { name: 'Diana', ambition: "être une artiste célèbre", email: 'student4@example.com' },
  ];
  
  const createdStudents = [];
  for (const studentData of studentsData) {
    const student = await prisma.user.create({
      data: {
        email: studentData.email,
        name: studentData.name,
        role: Role.ELEVE,
        ambition: studentData.ambition,
        classeId: classeA.id,
      },
    });
    createdStudents.push(student);
  }

  for (let i = 0; i < createdStudents.length; i++) {
     await prisma.etatEleve.create({
      data: {
        eleveId: createdStudents[i].id,
        isPunished: false,
        // Assign a career to some students for demonstration
        metierId: i < 3 ? [pompier.id, astronaute.id, veterinaire.id][i] : undefined,
      },
    });
  }

  console.log('✅ Élèves et leurs états créés.');

  // Create some messages in the chatroom
  console.log('✉️ Création des messages...');
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
        senderId: createdStudents[0].id, // Alice
        senderName: createdStudents[0].name!,
        chatroomId: chatroom.id,
    }
  });
  console.log('✅ Messages créés.');
  
  console.log('🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Une erreur est survenue durant le seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
