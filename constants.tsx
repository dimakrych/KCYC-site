import { 
  Users, 
  Megaphone, 
  Target, 
  Briefcase, 
  FileText, 
  HeartHandshake,
  Heart,
  BookOpen,
  Scale,
  Globe, 
  Sun,
  Zap,
  Leaf,
  GraduationCap,
  Lightbulb,
  Building2,
  Eye,
  Calendar,
  TrendingUp,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Department, Opportunity, Project, SDG, TeamMember, FocusArea, DocumentItem, PartnerGroup } from './types';

// Helper function to format image paths.
const p = (fileName: string) => {
  if (fileName.startsWith('http')) return fileName;
  return `/LOGO%20PAR/${encodeURIComponent(fileName)}`;
};

const placeholder = (text: string) => `https://placehold.co/400x200/ffffff/031B47?text=${encodeURIComponent(text)}`;

export const NAV_LINKS_UK = [
  { name: 'Про нас', path: '/about' },
  { name: 'Команда', path: '/team' },
  { name: 'Проєкти', path: '/projects' },
  { name: 'Можливості', path: '/opportunities' },
  { name: 'Документи', path: '/documents' },
];

export const NAV_LINKS_EN = [
  { name: 'About', path: '/about' },
  { name: 'Team', path: '/team' },
  { name: 'Projects', path: '/projects' },
  { name: 'Opportunities', path: '/opportunities' },
  { name: 'Documents', path: '/documents' },
];

export const NAV_LINKS = NAV_LINKS_UK;

// --- FOCUS AREAS ---
export const FOCUS_AREAS_UK: FocusArea[] = [
  {
    id: 'participation',
    title: 'Молодь та участь',
    description: 'Залучення молоді до процесів прийняття рішень та громадського життя міста.',
    icon: Users,
    color: 'bg-kmmr-blue dark:bg-blue-400'
  },
  {
    id: 'career',
    title: 'Зайнятість та кар\'єра',
    description: 'Створення можливостей для працевлаштування, стажування та професійного розвитку.',
    icon: Briefcase,
    color: 'bg-kmmr-pink'
  },
  {
    id: 'education',
    title: 'Освіта та розвиток',
    description: 'Неформальна освіта, тренінги та просвітницькі заходи для молоді.',
    icon: GraduationCap,
    color: 'bg-kmmr-green'
  },
  {
    id: 'civil-society',
    title: 'Громадянське суспільство',
    description: 'Розвиток волонтерства та підтримка молодіжних ініціатив.',
    icon: HeartHandshake,
    color: 'bg-kmmr-orange'
  }
];

export const FOCUS_AREAS_EN: FocusArea[] = [
  {
    id: 'participation',
    title: 'Youth & Participation',
    description: 'Engaging youth in decision-making processes and public life of the city.',
    icon: Users,
    color: 'bg-kmmr-blue dark:bg-blue-400'
  },
  {
    id: 'career',
    title: 'Employment & Career',
    description: 'Creating opportunities for employment, internships, and professional development.',
    icon: Briefcase,
    color: 'bg-kmmr-pink'
  },
  {
    id: 'education',
    title: 'Education & Development',
    description: 'Non-formal education, trainings, and educational events for youth.',
    icon: GraduationCap,
    color: 'bg-kmmr-green'
  },
  {
    id: 'civil-society',
    title: 'Civil Society',
    description: 'Development of volunteering and support for youth initiatives.',
    icon: HeartHandshake,
    color: 'bg-kmmr-orange'
  }
];

export const FOCUS_AREAS = FOCUS_AREAS_UK;

// --- DOCUMENTS ---
export const DOCUMENTS_LIST_UK: DocumentItem[] = [
  { id: 'statute', title: 'Статут Організації', type: 'PDF', date: '12.01.2024', size: '2.4 MB', link: '#' },
  { id: 'report-2023', title: 'Річний звіт за 2023 рік', type: 'PDF', date: '15.02.2024', size: '5.1 MB', link: '#' },
  { id: 'strategy', title: 'Стратегія розвитку 2024-2026', type: 'PDF', date: '01.03.2024', size: '1.8 MB', link: '#' },
  { id: 'membership', title: 'Положення про членство', type: 'DOCX', date: '10.01.2024', size: '0.5 MB', link: '#' }
];

export const DOCUMENTS_LIST_EN: DocumentItem[] = [
  { id: 'statute', title: 'Organization Statute', type: 'PDF', date: '12.01.2024', size: '2.4 MB', link: '#' },
  { id: 'report-2023', title: 'Annual Report 2023', type: 'PDF', date: '15.02.2024', size: '5.1 MB', link: '#' },
  { id: 'strategy', title: 'Development Strategy 2024-2026', type: 'PDF', date: '01.03.2024', size: '1.8 MB', link: '#' },
  { id: 'membership', title: 'Membership Regulation', type: 'DOCX', date: '10.01.2024', size: '0.5 MB', link: '#' }
];

export const DOCUMENTS_LIST = DOCUMENTS_LIST_UK;

// --- SDGs (Universal) ---
export const SDGS_UK: SDG[] = [
  { id: 1, title: 'Подолання бідності', icon: HeartHandshake, color: '#E5243B' },
  { id: 3, title: 'Міцне здоров\'я', icon: Heart, color: '#4C9F38' },
  { id: 4, title: 'Якісна освіта', icon: BookOpen, color: '#C5192D' },
  { id: 5, title: 'Гендерна рівність', icon: Scale, color: '#FF3A21' }, 
  { id: 8, title: 'Гідна праця', icon: Briefcase, color: '#A21942' },
  { id: 10, title: 'Скорочення нерівності', icon: Target, color: '#DD1367' },
  { id: 13, title: 'Боротьба зі зміною клімату', icon: Globe, color: '#3F7E44' },
  { id: 16, title: 'Мир та справедливість', icon: Leaf, color: '#00689D' },
];

export const SDGS_EN: SDG[] = [
  { id: 1, title: 'No Poverty', icon: HeartHandshake, color: '#E5243B' },
  { id: 3, title: 'Good Health', icon: Heart, color: '#4C9F38' },
  { id: 4, title: 'Quality Education', icon: BookOpen, color: '#C5192D' },
  { id: 5, title: 'Gender Equality', icon: Scale, color: '#FF3A21' }, 
  { id: 8, title: 'Decent Work', icon: Briefcase, color: '#A21942' },
  { id: 10, title: 'Reduced Inequalities', icon: Target, color: '#DD1367' },
  { id: 13, title: 'Climate Action', icon: Globe, color: '#3F7E44' },
  { id: 16, title: 'Peace & Justice', icon: Leaf, color: '#00689D' },
];

export const SDGS = SDGS_UK;

// --- DEPARTMENTS ---
export const DEPARTMENTS_UK: Department[] = [
  { id: 'smm', name: 'SMM команда', description: 'Голос організації в цифровому просторі. Ми створюємо контент, що надихає.', icon: Megaphone, color: 'bg-kmmr-orange' },
  { id: 'projects', name: 'Проєктна команда', description: 'Архітектори змін. Ми перетворюємо ідеї на реальні заходи та ініціативи.', icon: Target, color: 'bg-kmmr-green' },
  { id: 'pr', name: 'Піар відділ', description: 'Будуємо мости комунікації. Зовнішній та внутрішній бренд організації.', icon: Users, color: 'bg-kmmr-pink' },
  { id: 'fundraising', name: 'Фандрайзингова команда', description: 'Паливо для наших ідей. Пошук ресурсів та партнерів.', icon: Briefcase, color: 'bg-kmmr-brown' },
  { id: 'secretariat', name: 'Секретаріат', description: 'Серце структури. Документообіг та організаційна підтримка.', icon: FileText, color: 'bg-kmmr-blue dark:bg-blue-400' }
];

export const DEPARTMENTS_EN: Department[] = [
  { id: 'smm', name: 'SMM Team', description: 'The voice of the organization in the digital space. We create inspiring content.', icon: Megaphone, color: 'bg-kmmr-orange' },
  { id: 'projects', name: 'Project Team', description: 'Architects of change. We turn ideas into real events and initiatives.', icon: Target, color: 'bg-kmmr-green' },
  { id: 'pr', name: 'PR Department', description: 'Building communication bridges. External and internal brand of the organization.', icon: Users, color: 'bg-kmmr-pink' },
  { id: 'fundraising', name: 'Fundraising Team', description: 'Fuel for our ideas. Searching for resources and partners.', icon: Briefcase, color: 'bg-kmmr-brown' },
  { id: 'secretariat', name: 'Secretariat', description: 'The heart of the structure. Document flow and organizational support.', icon: FileText, color: 'bg-kmmr-blue dark:bg-blue-400' }
];

export const DEPARTMENTS = DEPARTMENTS_UK;

// --- PARTNERS ---
export const PARTNER_GROUPS_UK: PartnerGroup[] = [
  {
    id: 'partners',
    title: 'Партнери',
    description: 'Інституції та компанії, з якими ми реалізуємо спільні проєкти.',
    icon: HeartHandshake,
    color: 'bg-kmmr-blue dark:bg-blue-400',
    items: [
      { name: 'Будинок Кіно', image: placeholder('Будинок Кіно') },
      { name: 'Департамент Молоді та Спорту', image: placeholder('Департамент МС') },
      { name: 'В КПДЮ', image: placeholder('КПДЮ') },
      { name: 'Німецький Дім-Київ', image: placeholder('Німецький Дім') },
      { name: 'Averina', image: placeholder('Averina') },
      { name: 'Aware zone', image: placeholder('Aware zone') },
      { name: 'EPA', image: placeholder('EPA') },
      { name: 'IHUB', image: placeholder('IHUB') },
      { name: 'Kyiv Campus', image: placeholder('Kyiv Campus') },
      { name: 'Your communication', image: placeholder('Your communication') },
      { name: 'Київський молодіжний центр', image: placeholder('КМЦ') }
    ].map(item => ({ ...item, icon: Briefcase }))
  },
  {
    id: 'organizations',
    title: 'Організації',
    description: 'Громадські організації, що входять до складу або співпрацюють з нами.',
    icon: Building2,
    color: 'bg-kmmr-green',
    items: [
      { name: 'Взаємодія молоді', image: placeholder('Взаємодія') },
      { name: 'CIM', image: placeholder('CIM') },
      { name: 'Відрада', image: placeholder('Відрада') },
      { name: 'Дакус', image: placeholder('Дакус') },
      { name: 'Німецький молодіжний клуб', image: placeholder('НМК') },
      { name: 'Ранганатха', image: placeholder('Ранганатха') },
      { name: 'Скаути України', image: placeholder('Скаути') },
      { name: 'Український Альянс', image: placeholder('Укр Альянс') },
      { name: 'Центр соціальних транформацій', image: placeholder('ЦСТ') },
      { name: 'Aiesec', image: placeholder('Aiesec') },
      { name: 'Erasmus Students Network', image: placeholder('ESN') },
      { name: 'Key Generation', image: placeholder('Key Gen') },
      { name: "Let's do it", image: placeholder("Let's do it") },
      { name: 'Qhub', image: placeholder('Qhub') },
      { name: 'Thesmos Ares', image: placeholder('Thesmos Ares') },
    ].map(item => ({ ...item, icon: Users }))
  },
  {
    id: 'observers',
    title: 'Спостерігачі',
    description: 'Організації, що мають статус спостерігачів при КММР.',
    icon: Eye,
    color: 'bg-kmmr-pink',
    items: [
      { name: 'КМРС', image: placeholder('КМРС') },
      { name: 'СПУ', image: placeholder('СПУ') },
    ].map(item => ({ ...item, icon: Eye }))
  }
];

export const PARTNER_GROUPS_EN: PartnerGroup[] = [
  {
    id: 'partners',
    title: 'Partners',
    description: 'Institutions and companies with whom we implement joint projects.',
    icon: HeartHandshake,
    color: 'bg-kmmr-blue dark:bg-blue-400',
    items: PARTNER_GROUPS_UK[0].items
  },
  {
    id: 'organizations',
    title: 'Organizations',
    description: 'Public organizations that are part of or cooperate with us.',
    icon: Building2,
    color: 'bg-kmmr-green',
    items: PARTNER_GROUPS_UK[1].items
  },
  {
    id: 'observers',
    title: 'Observers',
    description: 'Organizations holding observer status at KCYC.',
    icon: Eye,
    color: 'bg-kmmr-pink',
    items: PARTNER_GROUPS_UK[2].items
  }
];

export const PARTNER_GROUPS = PARTNER_GROUPS_UK;

// --- TEAM ---
export const TEAM_MEMBERS_UK: TeamMember[] = [
  {
    id: '1',
    name: 'Владислав Олексієнко',
    role: 'Президент організації',
    department: 'secretariat',
    email: 'vladyslav@kmmr.org',
    bio: 'Співзасновник, Лідер, Натхненник.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    details: ['20 років, народився в м. Києві', 'Здобуває освіту в ННІ права КНУ ім. Т. Шевченка', 'Понад 2 роки займається громадською активністю', 'Керує стратегічним розвитком КММР']
  },
  {
    id: '2',
    name: 'Анна Коваль',
    role: 'Голова SMM відділу',
    department: 'smm',
    bio: 'Креатив та комунікація.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    details: ['Досвід у SMM 3 роки', 'Студентка Могилянки', 'Відповідає за візуальний стиль та tone of voice']
  },
  {
    id: '3',
    name: 'Дмитро Соловей',
    role: 'Голова проєктного відділу',
    department: 'projects',
    bio: 'Менеджмент та реалізація.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    details: ['Організував більше 20 заходів', 'Спеціаліст з грантового менеджменту', 'Координує роботу проєктних менеджерів']
  },
  {
    id: '4',
    name: 'Марія Іваненко',
    role: 'Головний фандрайзер',
    department: 'fundraising',
    bio: 'Ресурси для змін.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    details: ['Залучила фінансування на 5 великих проєктів', 'Має широку мережу контактів з бізнесом', 'Проводить тренінги з фандрайзингу']
  },
  {
    id: '5',
    name: 'Олег Петренко',
    role: 'PR менеджер',
    department: 'pr',
    bio: 'Зв\'язки з громадськістю.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    details: ['Відповідає за зв\'язки зі ЗМІ', 'Організовує прес-конференції', 'Веде комунікацію з партнерами']
  }
];

export const TEAM_MEMBERS_EN: TeamMember[] = [
  {
    id: '1',
    name: 'Vladyslav Oleksiienko',
    role: 'President',
    department: 'secretariat',
    email: 'vladyslav@kmmr.org',
    bio: 'Co-founder, Leader, Inspirer.',
    image: TEAM_MEMBERS_UK[0].image,
    details: ['20 years old, born in Kyiv', 'Studying at Taras Shevchenko National University of Kyiv', 'Over 2 years of civic activity', 'Manages strategic development of KCYC']
  },
  {
    id: '2',
    name: 'Anna Koval',
    role: 'Head of SMM',
    department: 'smm',
    bio: 'Creativity and communication.',
    image: TEAM_MEMBERS_UK[1].image,
    details: ['3 years of experience in SMM', 'Student at Kyiv-Mohyla Academy', 'Responsible for visual style and tone of voice']
  },
  {
    id: '3',
    name: 'Dmytro Solovey',
    role: 'Head of Project Dept',
    department: 'projects',
    bio: 'Management and implementation.',
    image: TEAM_MEMBERS_UK[2].image,
    details: ['Organized over 20 events', 'Grant management specialist', 'Coordinates project managers']
  },
  {
    id: '4',
    name: 'Maria Ivanenko',
    role: 'Chief Fundraiser',
    department: 'fundraising',
    bio: 'Resources for change.',
    image: TEAM_MEMBERS_UK[3].image,
    details: ['Raised funds for 5 major projects', 'Extensive business network', 'Conducts fundraising training']
  },
  {
    id: '5',
    name: 'Oleg Petrenko',
    role: 'PR Manager',
    department: 'pr',
    bio: 'Public Relations.',
    image: TEAM_MEMBERS_UK[4].image,
    details: ['Responsible for media relations', 'Organizes press conferences', 'Manages partner communication']
  }
];

export const TEAM_MEMBERS = TEAM_MEMBERS_UK;

// --- PROJECTS ---
export const PROJECTS_UK: Project[] = [
  {
    id: 'money-week',
    title: 'Money Week Forum 2.0',
    description: `Money Week Forum 2.0: Розкрий свій фінансовий потенціал! 🌍 Форум проводиться в рамках Global Money Week – міжнародної ініціативи, яка об’єднує молодь у 100+ країнах світу для підвищення фінансової грамотності.

Це унікальна можливість зануритися у світ фінансів, підприємництва та кар’єрного зростання. Два дні інтенсиву, які можуть змінити твоє життя!

📌 Що на тебе чекає?
▫️ Інсайти від топових підприємців(-иць), інвесторів(-ок) та бізнес-лідерів(-ок);
▫️ Воркшопи, де ти отримаєш практичні знання та навички зі створення власної справи;
▫️ Знайомства з представниками та представницями провідних українських компаній та стартапів;
▫️ Продуктивний нетворкінг з однодумцями та майбутніми партнерами та партнерками.

🔥Чому варто тут бути?
Хочеш навчитись керувати грошима, побудувати кар’єру чи створити власний бізнес? Money Week 2.0 — це шанс отримати реальні знання, знайомства та можливості, які допоможуть тобі досягти фінансової свободи. Тут ти знайдеш відповіді на питання, які хвилюють усіх, хто прагне успіху. Це твій перший крок до змін!

👥 Кому буде корисно?
Майбутнім підприємцям і підприємицям, які хочуть стартувати власний бізнес.
Молодим фахівцям, які прагнуть швидкого кар’єрного росту.
Всім, хто хоче навчитися ефективно керувати фінансами.

🏆 Що ти отримаєш?
▫️ Чітке розуміння старту власної справи або кар’єрного прориву;
▫️ Реальні кейси та стратегії успіху від підприємців(-иць) та бізнес-лідерів(-ок);
▫️ Нові знайомства та можливості для співпраці з найкращими компаніями;
▫️ Драйвову атмосферу та натхнення діяти вже зараз!

📅 Дата: 29-30 березня 📍
Місце проведення буде вказано при підтвердженні реєстрації.
Участь: безоплатна, за попередньої реєстрації.
📢Кількість місць обмежена, учасникам(-цям) надійдуть відповідні листи.

🚀 Готовий(-а) змінити своє фінансове майбутнє?
Реєструйся в шапці профілю зараз та стань частиною нового покоління підприємців!

👉 Слідкуй за оновленнями та деталями заходу на наших офіційних сторінках!`,
    date: 'Травень 2024',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instagramLink: 'https://www.instagram.com/p/DHGqANQI4Pq/'
  },
  {
    id: 'kyiv-urban-hack-2026',
    title: 'Kyiv Urban Hackathon 2026',
    description: 'Творимо місто майбутнього разом! 48-годинний марафон, де команди розробників, дизайнерів та урбаністів працюватимуть над вирішенням актуальних інфраструктурних проблем Києва. Ментори з Міської Ради та провідних IT-компаній, пітчинг ідей перед інвесторами та можливість отримати фінансування на реалізацію прототипу.',
    date: '12-14 Лютого 2026',
    deadline: '2026-02-12',
    image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instagramLink: 'https://www.instagram.com'
  },
  {
    id: 'ngo-office',
    title: 'Офіс НУО: Кадри',
    description: 'Інтенсивна програма підготовки кваліфікованих кадрів для громадського сектору. Навчання проєктному менеджменту, комунікаціям та лідерству.',
    date: 'Квітень 2024',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instagramLink: 'https://www.instagram.com/p/DJCOwF8IYwX/'
  },
  {
    id: 'youth-dialogue',
    title: 'Молодіжний Діалог',
    description: 'Серія зустрічей молоді з представниками місцевої влади для обговорення актуальних проблем міста.',
    date: 'Постійно діючий',
    image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e3169?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    instagramLink: 'https://www.instagram.com'
  }
];

export const PROJECTS_EN: Project[] = [
  {
    id: 'money-week',
    title: 'Money Week Forum 2.0',
    description: 'Large-scale financial literacy forum for youth. Lectures from leading experts, workshops, and networking.',
    date: 'May 2024',
    image: PROJECTS_UK[0].image,
    instagramLink: PROJECTS_UK[0].instagramLink
  },
  {
    id: 'kyiv-urban-hack-2026',
    title: 'Kyiv Urban Hackathon 2026',
    description: 'Creating the city of the future together! A 48-hour marathon where teams of developers, designers, and urbanists will work on solving current infrastructure problems in Kyiv. Mentors from the City Council and leading IT companies, idea pitching to investors and the opportunity to receive funding for prototype implementation.',
    date: 'February 12-14, 2026',
    deadline: '2026-02-12',
    image: PROJECTS_UK[1].image,
    instagramLink: PROJECTS_UK[1].instagramLink
  },
  {
    id: 'ngo-office',
    title: 'NGO Office: Personnel',
    description: 'Intensive training program for qualified personnel for the public sector. Training in project management, communications, and leadership.',
    date: 'April 2024',
    image: PROJECTS_UK[2].image,
    instagramLink: PROJECTS_UK[2].instagramLink
  },
  {
    id: 'youth-dialogue',
    title: 'Youth Dialogue',
    description: 'Series of meetings between youth and local government representatives to discuss current city issues.',
    date: 'Ongoing',
    image: PROJECTS_UK[3].image,
    instagramLink: PROJECTS_UK[3].instagramLink
  }
];

export const PROJECTS = PROJECTS_UK;

// --- OPPORTUNITIES ---
export const OPPORTUNITIES_UK: Opportunity[] = [
  { id: 'vol-1', title: 'Набір до SMM команди', description: 'Шукаємо креативних копірайтерів та дизайнерів, готових розвивати соцмережі КММР.', deadline: '', link: '/contacts', type: 'Volunteering' },
  { id: 'event-1', title: 'Лекція: Лідерство в кризу', description: 'Відкрита лекція для всіх бажаючих. Спікери - топ-менеджери українських компаній.', deadline: '2026-01-25', link: '#', type: 'Event' },
  { id: 'edu-1', title: 'Школа Молодіжних Рад', description: 'Триденний інтенсив для представників молодіжних рад з усієї України.', deadline: '2026-03-15', link: '#', type: 'Education' }
];

export const OPPORTUNITIES_EN: Opportunity[] = [
  { id: 'vol-1', title: 'Call for SMM Team', description: 'We are looking for creative copywriters and designers ready to develop KCYC social networks.', deadline: '', link: '/contacts', type: 'Volunteering' },
  { id: 'event-1', title: 'Lecture: Leadership in Crisis', description: 'Open lecture for everyone. Speakers - top managers of Ukrainian companies.', deadline: '2026-01-25', link: '#', type: 'Event' },
  { id: 'edu-1', title: 'Youth Councils School', description: 'Three-day intensive for representatives of youth councils from all over Ukraine.', deadline: '2026-03-15', link: '#', type: 'Education' }
];

export const OPPORTUNITIES = OPPORTUNITIES_UK;

// --- TIMELINE DATA ---
export const TIMELINE_EVENTS_UK = [
  { year: '2017', icon: Calendar, color: 'text-kmmr-blue dark:text-blue-400', bg: 'bg-kmmr-blue dark:bg-blue-400', title: 'Витоки та становлення', desc: '13 травня 2017 року відбулися установчі збори та обрання першого Правління, що стало фактичним народженням КММР як інституції. У 2017–2019 роках формувалися внутрішні зв’язки.' },
  { year: '2019', icon: TrendingUp, color: 'text-kmmr-green', bg: 'bg-kmmr-green', title: 'Перезапуск і професіоналізація', desc: '20 серпня 2019 року відбулися позачергові Загальні збори. Це дало Раді новий імпульс розвитку, посилило довіру та професійність команди.' },
  { year: '2022', icon: Shield, color: 'text-kmmr-orange', bg: 'bg-kmmr-orange', title: 'Розвиток під час війни', desc: 'Повномасштабне вторгнення тимчасово «заморозило» діяльність, але з осені 2022 року Рада відновила активну роботу. Оновлено візуальну айдентику.' },
  { year: 'Сьогодні', icon: Briefcase, color: 'text-kmmr-pink', bg: 'bg-kmmr-pink', title: 'Можливості та результати', desc: 'Рада активно працює через соцмережі та офлайн-простори. Серед партнерів: департаменти КМДА, Київський молодіжний центр, НБУ, Deutsches Haus Kyiv.' },
  { year: 'Плани', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500', title: 'Виклики та Стратегія', desc: 'Ми працюємо над подоланням основних викликів. Стратегічні цілі: адвокація змін до законодавства та залучення донорської підтримки.' },
];

export const TIMELINE_EVENTS_EN = [
  { year: '2017', icon: Calendar, color: 'text-kmmr-blue dark:text-blue-400', bg: 'bg-kmmr-blue dark:bg-blue-400', title: 'Origins and Formation', desc: 'On May 13, 2017, the constituent assembly and election of the first Board took place, marking the birth of KCYC. In 2017–2019, internal connections were formed.' },
  { year: '2019', icon: TrendingUp, color: 'text-kmmr-green', bg: 'bg-kmmr-green', title: 'Relaunch and Professionalization', desc: 'On August 20, 2019, an extraordinary General Assembly took place. This gave the Council a new impulse for development and strengthened trust.' },
  { year: '2022', icon: Shield, color: 'text-kmmr-orange', bg: 'bg-kmmr-orange', title: 'Development during War', desc: 'The full-scale invasion temporarily paused activities, but since autumn 2022, the Council resumed active work. Visual identity was updated.' },
  { year: 'Today', icon: Briefcase, color: 'text-kmmr-pink', bg: 'bg-kmmr-pink', title: 'Opportunities and Results', desc: 'The Council works actively through social networks and offline spaces. Partners include: KSCA departments, Kyiv Youth Center, NBU, Deutsches Haus Kyiv.' },
  { year: 'Plans', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500', title: 'Challenges and Strategy', desc: 'We are working to overcome major challenges. Strategic goals: advocacy for legislative changes and attracting donor support.' },
];