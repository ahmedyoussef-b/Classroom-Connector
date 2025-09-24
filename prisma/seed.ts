
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Nettoyage de la base de données
  await prisma.reaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.etatEleve.deleteMany();
  await prisma.user.deleteMany({ where: { role: 'ELEVE' }});
  await prisma.classe.deleteMany();
  await prisma.user.deleteMany({ where: { role: 'PROFESSEUR' }});
  await prisma.metier.deleteMany();


  // Création du professeur
  const professeur = await prisma.user.create({
    data: {
      id: 'teacher-id',
      email: 'professeur.dubois@example.com',
      name: 'Professeur Dubois',
      role: Role.PROFESSEUR,
      ambition: 'Guider la prochaine génération',
    },
  });

  // Création de la classe
  const classe = await prisma.classe.create({
    data: {
      id: 'classe-a',
      nom: 'Classe A',
      professeurId: professeur.id,
      chatroomId: 'classe-a-chat',
    },
  });

  // Création des élèves
  const elevesData = [
    { id: '1', name: 'Alex Johnson', ambition: 'Médecin' },
    { id: '2', name: 'Brenda Smith', ambition: 'Pilote d’avion' },
    { id: '3', name: 'Charles Brown', ambition: 'Avocat' },
    { id: '4', name: 'Diana Miller', ambition: 'Scientifique' },
    { id: '5', name: 'Ethan Wilson', ambition: 'Artiste peintre' },
    { id: '6', name: 'Fiona Davis', ambition: 'Pompier' },
    { id: '7', name: 'George Garcia', ambition: 'Astronaute' },
    { id: '8', name: 'Hannah Rodriguez', ambition: 'Instituteur / Professeur' },
    { id: '9', name: 'Ian Martinez', ambition: 'Développeur' },
    { id: '10', name: 'Jane Hernandez', ambition: 'Cuisinier' },
  ];

  for (const eleveData of elevesData) {
    await prisma.user.create({
      data: {
        id: eleveData.id,
        email: `${eleveData.name.toLowerCase().replace(' ', '.')}@example.com`,
        name: eleveData.name,
        ambition: eleveData.ambition,
        role: Role.ELEVE,
        classeId: classe.id,
        etat: {
          create: {
            isPunished: false,
          },
        },
      },
    });
  }

  // Création des métiers
  const metiersData = [
    {
      nom: 'Médecin',
      description: 'Soigne les gens et sauve des vies.',
      theme: {
        textColor: 'text-red-900',
        cursor: 'cursor-crosshair',
        primaryColor: '2 78% 59%', // Equivalent to hsl(2, 78%, 59%) - a shade of red
        accentColor: '210 40% 98%', // A light grey/white
        backgroundColor: 'from-red-100 to-red-200',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(254,226,226,0.5) 100%)',
      },
    },
    {
      nom: 'Pilote d’avion',
      description: 'Pilote des avions à travers le monde.',
      theme: {
        textColor: 'text-sky-900',
        cursor: 'cursor-grab',
        primaryColor: '199 89% 44%', // A sky blue
        accentColor: '210 20% 90%', // A light silver
        backgroundColor: 'from-sky-100 to-sky-300',
        backgroundImage: 'linear-gradient(to top, #a1c4fd 0%, #c2e9fb 100%)',
      },
    },
    {
      nom: 'Astronaute',
      description: 'Explore l’espace et les étoiles.',
      theme: {
        textColor: 'text-indigo-100',
        cursor: 'cursor-nesw-resize',
        primaryColor: '231 80% 60%', // A deep indigo
        accentColor: '52 94% 75%', // A golden yellow for stars
        backgroundColor: 'from-gray-900 to-black',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill=\'%23fefcbf\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'0\'%3E%3Canimate attributeName=\'r\' values=\'0;1;0\' dur=\'2s\' repeatCount=\'indefinite\'/%3E%3C/circle%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'0\'%3E%3Canimate attributeName=\'r\' values=\'0;1;0\' dur=\'1.5s\' repeatCount=\'indefinite\'/%3E%3C/circle%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'0\'%3E%3Canimate attributeName=\'r\' values=\'0;1;0\' dur=\'2.5s\' repeatCount=\'indefinite\'/%3E%3C/circle%3E%3Ccircle cx=\'30\' cy=\'70\' r=\'0\'%3E%3Canimate attributeName=\'r\' values=\'0;1;0\' dur=\'3s\' repeatCount=\'indefinite\'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")',
      },
    },
    {
        nom: 'Développeur',
        description: 'Crée des applications et des sites web.',
        theme: {
            textColor: 'text-emerald-100',
            cursor: 'cursor-text',
            primaryColor: '145 63% 49%', // A vibrant green
            accentColor: '215 28% 17%', // A dark charcoal
            backgroundColor: 'from-gray-800 to-gray-900',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2334d399' fill-opacity='0.2' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }
    },
    {
        nom: 'Artiste peintre',
        description: 'Exprime sa créativité sur la toile.',
        theme: {
            textColor: 'text-purple-800',
            cursor: 'url(/paint-brush.png), auto',
            primaryColor: '283 81% 53%', // A creative purple
            accentColor: '358 75% 69%', // A splash of pink
            backgroundColor: 'from-purple-100 to-pink-100',
            backgroundImage: `linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)`,
        }
    },
    {
      nom: 'Cuisinier',
      description: 'Prépare des plats délicieux.',
      theme: {
        textColor: 'text-orange-900',
        cursor: 'cursor-cell',
        primaryColor: '24 95% 53%', // An appetizing orange
        accentColor: '45 88% 95%', // Creamy white
        backgroundColor: 'from-orange-100 to-amber-200',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
    },
  ];

  for (const metier of metiersData) {
    await prisma.metier.create({
      data: metier,
    });
  }

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
