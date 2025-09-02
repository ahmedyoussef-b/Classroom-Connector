import {
  HeartPulse,
  Plane,
  Gavel,
  FlaskConical,
  Palette,
  Flame,
  Rocket,
  BookOpen,
  Camera,
  Film,
  Hammer,
  TreePine,
  Laptop,
  ChefHat,
  Tractor,
  Atom,
  Building,
  Anchor,
  PenTool,
  Music,
  GraduationCap,
  Train,
  Shield,
  Stethoscope,
  Footprints,
  Utensils,
  Mic,
  Clapperboard,
  Mountain,
  Wrench,
  Siren,
  Satellite,
  Brush,
  CookingPot,
  Badge,
  Microscope,
  Spade,
  Terminal,
  Piano,
  TrainTrack,
  Ship,
  Sparkles,
  Bone,
  Ruler,
  Goal,
  Syringe,
  Scroll,
  Briefcase,
  GitBranch,
} from 'lucide-react';
import type { Career, Student } from './types';

export const CAREERS: Career[] = [
  {
    id: 'medecin',
    name: 'Médecin',
    description: 'Diagnostiquer et traiter les affections médicales.',
    theme: {
      backgroundColor: 'from-blue-100 to-blue-200',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(235, 248, 255, 0.5) 100%)',
      primaryColor: '0 84% 60%', // red
      accentColor: '210 17% 95%', // light grey
      textColor: 'text-slate-900',
      icon: Stethoscope,
      cursor: 'cursor-help',
    },
  },
  {
    id: 'pilote',
    name: 'Pilote d’avion',
    description: 'Piloter des avions pour des compagnies aériennes ou des sociétés.',
    theme: {
      backgroundColor: 'from-sky-300 to-sky-400',
      backgroundImage: 'linear-gradient(to top, #a1c4fd 0%, #c2e9fb 100%)',
      primaryColor: '220 75% 25%', // dark blue
      accentColor: '45 100% 50%', // bright yellow
      textColor: 'text-white',
      icon: Plane,
      cursor: 'cursor-grab',
    },
  },
  {
    id: 'professeur',
    name: 'Instituteur / Professeur',
    description: 'Éduquer les élèves dans diverses matières.',
    theme: {
      backgroundColor: 'from-green-600 to-green-700',
      backgroundImage: 'linear-gradient(to right, #4CAF50, #81C784)',
      primaryColor: '50 100% 50%', // yellow
      accentColor: '0 0% 100%', // white
      textColor: 'text-white',
      icon: GraduationCap,
      cursor: 'cursor-text',
    },
  },
  {
    id: 'avocat',
    name: 'Avocat',
    description: 'Conseiller et représenter des clients dans des affaires juridiques.',
    theme: {
      backgroundColor: 'from-yellow-800 to-yellow-900',
      backgroundImage: 'linear-gradient(to right, #8A6E2F, #A48A4F)',
      primaryColor: '0 0% 80%', // light grey
      accentColor: '40 38% 30%', // dark brown
      textColor: 'text-white',
      icon: Gavel,
      cursor: 'cursor-pointer',
    },
  },
  {
    id: 'ingenieur',
    name: 'Ingénieur',
    description: 'Concevoir des solutions techniques à des problèmes complexes.',
    theme: {
      backgroundColor: 'from-gray-400 to-gray-500',
      backgroundImage: 'linear-gradient(to right, #B0BEC5, #CFD8DC)',
      primaryColor: '217 91% 60%', // blue
      accentColor: '215 14% 34%', // dark slate gray
      textColor: 'text-gray-900',
      icon: Wrench,
      cursor: 'cursor-crosshair',
    },
  },
  {
    id: 'pompier',
    name: 'Pompier',
    description: 'Éteindre les incendies et sauver des vies.',
    theme: {
      backgroundColor: 'from-red-600 to-orange-500',
      backgroundImage: 'linear-gradient(45deg, #FF5722 0%, #FF9800 100%)',
      primaryColor: '50 100% 50%', // yellow
      accentColor: '0 100% 50%', // red
      textColor: 'text-white',
      icon: Flame,
      cursor: 'cursor-pointer',
    },
  },
  {
    id: 'astronaute',
    name: 'Astronaute',
    description: 'Explorer l’espace et mener des recherches scientifiques.',
    theme: {
      backgroundColor: 'from-indigo-900 to-black',
      backgroundImage: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
      primaryColor: '207 90% 54%', // sky blue
      accentColor: '0 0% 100%', // white
      textColor: 'text-gray-200',
      icon: Rocket,
      cursor: 'cursor-nesw-resize',
    },
  },
  {
    id: 'artiste',
    name: 'Artiste peintre',
    description: 'Créer des œuvres d’art visuelles.',
    theme: {
      backgroundColor: 'from-pink-200 to-yellow-200',
      backgroundImage: 'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
      primaryColor: '283 81% 53%', // purple
      accentColor: '330 80% 70%', // pink
      textColor: 'text-gray-800',
      icon: Palette,
      cursor: 'cursor-cell',
    },
  },
  {
    id: 'cuisinier',
    name: 'Cuisinier',
    description: 'Préparer des plats savoureux dans une cuisine professionnelle.',
    theme: {
      backgroundColor: 'from-white to-gray-100',
      backgroundImage: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      primaryColor: '0 72% 51%', // red
      accentColor: '0 0% 20%', // dark grey
      textColor: 'text-gray-800',
      icon: ChefHat,
      cursor: 'cursor-pointer',
    },
  },
  {
    id: 'policier',
    name: 'Policier',
    description: 'Maintenir l’ordre et assurer la sécurité publique.',
    theme: {
      backgroundColor: 'from-blue-700 to-blue-900',
      backgroundImage: 'linear-gradient(to right, #1E3A8A, #1E40AF)',
      primaryColor: '210 100% 90%', // light blue
      accentColor: '0 0% 80%', // silver
      textColor: 'text-white',
      icon: Badge,
      cursor: 'cursor-pointer',
    },
  },
  {
    id: 'scientifique',
    name: 'Scientifique',
    description: 'Mener des recherches pour faire avancer la connaissance.',
    theme: {
      backgroundColor: 'from-purple-100 to-purple-200',
      backgroundImage: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
      primaryColor: '250 80% 60%', // purple
      accentColor: '180 60% 50%', // cyan
      textColor: 'text-purple-900',
      icon: FlaskConical,
      cursor: 'cursor-help',
    },
  },
  {
    id: 'agriculteur',
    name: 'Agriculteur',
    description: 'Cultiver la terre et élever des animaux.',
    theme: {
      backgroundColor: 'from-lime-300 to-green-400',
      backgroundImage: 'linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)',
      primaryColor: '40 56% 36%', // brown
      accentColor: '80 60% 50%', // green
      textColor: 'text-gray-800',
      icon: Tractor,
      cursor: 'cursor-pointer',
    },
  },
  {
    id: 'developpeur',
    name: 'Développeur',
    description: 'Concevoir et créer des logiciels et des applications.',
    theme: {
      backgroundColor: 'from-gray-800 to-gray-900',
      backgroundImage: 'linear-gradient(to right, #243949 0%, #517fa4 100%)',
      primaryColor: '175 74% 44%', // cyan
      accentColor: '120 100% 30%', // green
      textColor: 'text-gray-200',
      icon: Terminal,
      cursor: 'cursor-progress',
    },
  },
  {
    id: 'musicien',
    name: 'Chanteur / Musicien',
    description: 'Composer et interpréter de la musique.',
    theme: {
      backgroundColor: 'from-fuchsia-400 to-purple-500',
      backgroundImage: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
      primaryColor: '0 0% 0%', // black
      accentColor: '50 100% 50%', // yellow
      textColor: 'text-white',
      icon: Music,
      cursor: 'cursor-pointer',
    },
  },
  {
    id: 'conducteur-train',
    name: 'Conducteur de train',
    description: 'Conduire des trains de passagers ou de marchandises.',
    theme: {
      backgroundColor: 'from-gray-500 to-gray-600',
      backgroundImage: 'linear-gradient(to right, #616161, #9E9E9E)',
      primaryColor: '50 100% 50%', // yellow
      accentColor: '0 84% 60%', // red
      textColor: 'text-white',
      icon: Train,
      cursor: 'cursor-pointer',
    },
  },
  {
    id: 'marin',
    name: 'Marin / Capitaine',
    description: 'Naviguer sur les mers et les océans.',
    theme: {
      backgroundColor: 'from-cyan-300 to-blue-400',
      backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
      primaryColor: '220 75% 25%', // dark blue
      accentColor: '0 0% 100%', // white
      textColor: 'text-white',
      icon: Anchor,
      cursor: 'cursor-pointer',
    },
  },
  {
    id: 'super-heros',
    name: 'Super-héros',
    description: 'Protéger le monde des menaces surnaturelles.',
    theme: {
      backgroundColor: 'from-yellow-400 to-red-500',
      backgroundImage: 'linear-gradient(to right, #f83600 0%, #f9d423 100%)',
      primaryColor: '217 91% 60%', // blue
      accentColor: '0 84% 60%', // red
      textColor: 'text-white',
      icon: Shield,
      cursor: 'cursor-pointer',
    },
  },
  {
    id: 'veterinaire',
    name: 'Vétérinaire',
    description: 'Soigner la santé et le bien-être des animaux.',
    theme: {
      backgroundColor: 'from-teal-100 to-cyan-200',
      backgroundImage: 'linear-gradient(to top, #B2DFDB 0%, #E0F2F1 100%)',
      primaryColor: '120 60% 50%', // green
      accentColor: '200 80% 70%', // light blue
      textColor: 'text-gray-800',
      icon: Bone,
      cursor: 'cursor-help',
    },
  },
  {
    id: 'architecte',
    name: 'Architecte',
    description: 'Concevoir des bâtiments et des espaces de vie.',
    theme: {
      backgroundColor: 'from-gray-200 to-gray-300',
      backgroundImage: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)',
      primaryColor: '0 0% 20%', // dark grey
      accentColor: '207 90% 54%', // blue
      textColor: 'text-gray-900',
      icon: Building,
      cursor: 'cursor-crosshair',
    },
  },
  {
    id: 'sportif',
    name: 'Sportif',
    description: 'Pratiquer un sport à un niveau professionnel.',
    theme: {
      backgroundColor: 'from-green-400 to-lime-500',
      backgroundImage: 'linear-gradient(to right, #4CAF50, #8BC34A)',
      primaryColor: '0 0% 0%', // black
      accentColor: '0 0% 100%', // white
      textColor: 'text-white',
      icon: Goal,
      cursor: 'cursor-pointer',
    },
  },
];


export const STUDENTS: Student[] = [
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
