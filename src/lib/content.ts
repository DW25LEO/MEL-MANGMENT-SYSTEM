import {
  GraduationCap,
  School,
  BookOpen,
  ClipboardCheck,
  ShieldCheck,
  Users,
  CreditCard,
  Bell,
  BarChart3,
  Globe2,
  FileText,
  Award,
  HelpCircle,
  Phone,
  Home,
  Info,
  Building2,
  type LucideIcon,
} from 'lucide-react';

export type NavLink = { label: string; to: string; icon: LucideIcon };

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'About I-LearnAce', to: '/about', icon: Info },
  { label: 'Tertiary Learning', to: '/tertiary', icon: Building2 },
  { label: 'Institutions', to: '/institutions', icon: School },
  { label: 'Courses & Programmes', to: '/courses', icon: BookOpen },
  { label: 'Examinations', to: '/examinations', icon: ClipboardCheck },
  { label: 'Results Verification', to: '/results', icon: ShieldCheck },
  { label: 'Contact', to: '/contact', icon: Phone },
  { label: 'FAQ', to: '/faq', icon: HelpCircle },
];

export const primaryNav = navLinks.slice(0, 6);
export const utilityNav = navLinks.slice(6);

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: GraduationCap,
    title: 'Tertiary Education Management',
    description: 'Faculties, departments, programmes, courses, lecturers, and students — all in a structured hierarchy.',
  },
  {
    icon: School,
    title: 'Primary & Secondary Schools',
    description: 'Primary, JSS, and SSS classes with subjects, teachers, schedules, report cards, and attendance.',
  },
  {
    icon: ClipboardCheck,
    title: 'Online Examinations',
    description: 'Question banks, timed exams, attempt limits, automatic marking, and instant result slips.',
  },
  {
    icon: CreditCard,
    title: 'Exam Credit System',
    description: 'Pay for exam attempts, track credits, view attempts remaining, and re-pay when credits expire.',
  },
  {
    icon: ShieldCheck,
    title: 'Results Verification',
    description: 'Public, secure verification of exam results and certificates by employers and institutions.',
  },
  {
    icon: Users,
    title: 'Student & Staff Portals',
    description: 'Students manage courses and exams. Teachers and lecturers handle classes, materials, and marking.',
  },
];

export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: '120+', label: 'Partner Institutions' },
  { value: '45K+', label: 'Active Students' },
  { value: '1.2M+', label: 'Exams Completed' },
  { value: '99.9%', label: 'Uptime' },
];

export type Role = {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
};

export const roles: Role[] = [
  {
    icon: ShieldCheck,
    title: 'Super Admin',
    description: 'Full platform control — institutions, design, payments, roles, and system settings.',
    features: ['Institution management', 'Global design system', 'Roles & permissions', 'System reports'],
  },
  {
    icon: GraduationCap,
    title: 'Tertiary Education Admin',
    description: 'Manage faculties, departments, programmes, lecturers, students, and exams.',
    features: ['Faculty & departments', 'Programme setup', 'Lecturer management', 'Exam timetables'],
  },
  {
    icon: School,
    title: 'School Admin',
    description: 'Oversee primary and secondary classes, teachers, subjects, and report cards.',
    features: ['Class management', 'Subject allocation', 'Teacher roster', 'Report cards'],
  },
  {
    icon: BookOpen,
    title: 'Lecturer',
    description: 'Manage courses, upload materials, build question banks, create and mark exams.',
    features: ['Course materials', 'Question bank', 'Create exams', 'Mark submissions'],
  },
  {
    icon: Users,
    title: 'Teacher',
    description: 'Handle classes, attendance, question banks, exams, and student scores.',
    features: ['Class attendance', 'Create exams', 'Student scores', 'Announcements'],
  },
  {
    icon: Award,
    title: 'Student',
    description: 'Register for courses, pay for exams, sit examinations, and view results.',
    features: ['Course registration', 'Exam payment', 'Take exams', 'Results & slips'],
  },
];

export type TertiaryEducation = {
  name: string;
  short: string;
  location: string;
  faculties: number;
  students: string;
  programmes: number;
  logo: string;
};

export const tertiaryInstitutions: TertiaryEducation[] = [
  { name: 'Tertiary Education of Lagos', short: 'UNILAG', location: 'Lagos', faculties: 12, students: '36,000', programmes: 84, logo: 'UL' },
  { name: 'Ahmadu Bello Tertiary Education', short: 'ABU', location: 'Zaria', faculties: 16, students: '45,000', programmes: 96, logo: 'AB' },
  { name: 'Tertiary Education of Ibadan', short: 'UI', location: 'Ibadan', faculties: 13, students: '28,000', programmes: 72, logo: 'UI' },
  { name: 'Obafemi Awolowo Tertiary Education', short: 'OAU', location: 'Ile-Ife', faculties: 14, students: '32,000', programmes: 88, logo: 'OA' },
  { name: 'Tertiary Education of Nigeria', short: 'UNN', location: 'Nsukka', faculties: 15, students: '40,000', programmes: 102, logo: 'UN' },
  { name: 'Covenant Tertiary Education', short: 'CU', location: 'Ota', faculties: 9, students: '12,000', programmes: 54, logo: 'CU' },
];

export type School = {
  name: string;
  short: string;
  location: string;
  levels: string;
  students: string;
  logo: string;
};

export const schools: School[] = [
  { name: 'King\'s College', short: 'KC', location: 'Lagos', levels: 'JSS 1 – SSS 3', students: '1,200', logo: 'KC' },
  { name: 'Queen\'s College', short: 'QC', location: 'Lagos', levels: 'JSS 1 – SSS 3', students: '1,150', logo: 'QC' },
  { name: 'Baptist High School', short: 'BHS', location: 'Ibadan', levels: 'Primary 1 – SSS 3', students: '980', logo: 'BH' },
  { name: 'Federal Government College', short: 'FGC', location: 'Abuja', levels: 'JSS 1 – SSS 3', students: '1,400', logo: 'FG' },
  { name: 'Lagos Anglican School', short: 'LAS', location: 'Lagos', levels: 'Primary 1 – 5', students: '720', logo: 'LA' },
  { name: 'St. Augustine Academy', short: 'SAA', location: 'Port Harcourt', levels: 'JSS 1 – SSS 3', students: '860', logo: 'SA' },
];

export type Programme = {
  name: string;
  category: string;
  level: string;
  duration: string;
  description: string;
};

export const programmes: Programme[] = [
  { name: 'Computer Science', category: 'Sciences', level: 'Undergraduate', duration: '4 Years', description: 'Algorithms, software engineering, AI, and data systems.' },
  { name: 'Medicine & Surgery', category: 'Medical', level: 'Undergraduate', duration: '6 Years', description: 'Clinical medicine, surgery, and medical research.' },
  { name: 'Law', category: 'Law', level: 'Undergraduate', duration: '5 Years', description: 'Constitutional, criminal, and commercial law.' },
  { name: 'Business Administration', category: 'Management', level: 'Undergraduate', duration: '4 Years', description: 'Management, finance, marketing, and entrepreneurship.' },
  { name: 'Electrical Engineering', category: 'Engineering', level: 'Undergraduate', duration: '5 Years', description: 'Power systems, electronics, and telecommunications.' },
  { name: 'Mass Communication', category: 'Arts', level: 'Undergraduate', duration: '4 Years', description: 'Journalism, broadcasting, and digital media.' },
  { name: 'Primary Education', category: 'Education', level: 'Primary', duration: '6 Years', description: 'Primary 1 through Primary 5 foundational curriculum.' },
  { name: 'Junior Secondary', category: 'Education', level: 'JSS', duration: '3 Years', description: 'JSS 1 to JSS 3 broad-based junior secondary.' },
  { name: 'Senior Secondary — Sciences', category: 'Education', level: 'SSS', duration: '3 Years', description: 'SSS 1 to SSS 3 science stream with WAEC preparation.' },
];

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image: string;
};

export const newsItems: NewsItem[] = [
  {
    id: 'n1',
    title: 'I-LearnAce Launches Unified Exam Credit System',
    excerpt: 'Students can now purchase exam attempts, track remaining credits, and re-pay seamlessly when credits expire.',
    category: 'Product',
    date: 'Aug 10, 2026',
    author: 'I-LearnAce Team',
    image: 'https://images.pexels.com/photos/6683409/pexels-photo-6683409.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'n2',
    title: 'Six New Tertiary Institutions Join the I-LearnAce Network',
    excerpt: 'Partner institutions gain access to faculty management, course registration, and online examinations.',
    category: 'Partnerships',
    date: 'Aug 4, 2026',
    author: 'I-LearnAce Team',
    image: 'https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'n3',
    title: 'Results Verification Portal Now Open to Employers',
    excerpt: 'Employers and institutions can securely verify exam results and certificates with a candidate reference.',
    category: 'Announcement',
    date: 'Jul 28, 2026',
    author: 'I-LearnAce Team',
    image: 'https://images.pexels.com/photos/8197534/pexels-photo-8197534.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'n4',
    title: 'I-LearnAce Adds Multi-Institution Support',
    excerpt: 'The platform now supports multiple institutions with proper data separation and institution-specific branding.',
    category: 'Product',
    date: 'Jul 20, 2026',
    author: 'I-LearnAce Team',
    image: 'https://images.pexels.com/photos/8419511/pexels-photo-8419511.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'n5',
    title: 'I-LearnAce Hosts Annual Educators Conference 2026',
    excerpt: 'School administrators and lecturers gather to share best practices in digital education management.',
    category: 'Events',
    date: 'Jul 15, 2026',
    author: 'I-LearnAce Team',
    image: 'https://images.pexels.com/photos/8199151/pexels-photo-8199151.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'n6',
    title: 'Question Bank Surpasses 50,000 Questions',
    excerpt: 'Lecturers and teachers have collectively built one of the largest shared question banks in the region.',
    category: 'Milestone',
    date: 'Jul 8, 2026',
    author: 'I-LearnAce Team',
    image: 'https://images.pexels.com/photos/15017187/pexels-photo-15017187.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export type EventItem = {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  category: string;
  description: string;
};

export const events: EventItem[] = [
  { id: 'e1', title: 'Annual Educators Conference 2026', date: '2026-09-12', day: '12', month: 'Sep', time: '09:00 AM', location: 'Eko Hotel, Lagos', category: 'Conference', description: 'A full day of workshops and talks for school administrators and lecturers.' },
  { id: 'e2', title: 'WAEC Exam Preparation Webinar', date: '2026-09-20', day: '20', month: 'Sep', time: '02:00 PM', location: 'Online', category: 'Webinar', description: 'Strategies for SSS 3 students preparing for WAEC examinations.' },
  { id: 'e3', title: 'Tertiary Admissions Fair', date: '2026-10-05', day: '05', month: 'Oct', time: '10:00 AM', location: 'ABU Campus, Zaria', category: 'Fair', description: 'Meet representatives from 20+ tertiary institutions and explore programmes.' },
  { id: 'e4', title: 'I-LearnAce Platform Training for Admins', date: '2026-10-18', day: '18', month: 'Oct', time: '11:00 AM', location: 'Online', category: 'Training', description: 'Hands-on training for tertiary education and school administrators new to I-LearnAce.' },
  { id: 'e5', title: 'Primary Schools Sports Day', date: '2026-11-02', day: '02', month: 'Nov', time: '08:00 AM', location: 'National Stadium, Abuja', category: 'Sports', description: 'Inter-school athletics and team sports for primary partner schools.' },
  { id: 'e6', title: 'Graduation & Awards Ceremony', date: '2026-11-30', day: '30', month: 'Nov', time: '03:00 PM', location: 'Covenant Tertiary Campus, Ota', category: 'Ceremony', description: 'Celebrating the achievements of top-performing students across the network.' },
];

export type FaqItem = {
  question: string;
  answer: string;
  category: string;
};

export const faqs: FaqItem[] = [
  { category: 'Getting Started', question: 'What is I-LearnAce?', answer: 'I-LearnAce is a unified education technology platform that connects universities, tertiary institutions, primary and secondary schools, students, and educators. It handles course registration, examinations, results, payments, and communication — all in one place.' },
  { category: 'Getting Started', question: 'How do I create an account?', answer: 'Click "Login / Register" in the top navigation, choose your institution type (primary/secondary school or tertiary education), and complete the registration form. Your institution must approve your account before you can access portal features.' },
  { category: 'Getting Started', question: 'Which institutions can join I-LearnAce?', answer: 'Any accredited tertiary institution, polytechnic, college, primary school, or secondary school can join. An institution admin signs up first, after which staff and students can register and link to it.' },

  { category: 'Examinations', question: 'How do online exams work?', answer: 'Once your institution schedules an exam and you have active credits, you can start the exam from your student portal. The exam is timed, your answers are saved automatically, and you submit when finished or when time runs out.' },
  { category: 'Examinations', question: 'What is the exam credit system?', answer: 'Each exam requires credits purchased through payment. One payment grants a set number of attempts. You can see your active credits, attempts used, attempts remaining, and expired credits in your portal.' },
  { category: 'Examinations', question: 'Can I retake an exam?', answer: 'Yes, if you have remaining attempts. If your credits have expired, you will need to make another payment to unlock new attempts.' },
  { category: 'Examinations', question: 'How are exams marked?', answer: 'Multiple-choice questions are marked automatically upon submission. Written answers are marked by the assigned lecturer or teacher, and results are released after marking is complete.' },

  { category: 'Results', question: 'How do I view my results?', answer: 'Results appear in the Results section of your student portal once they are released. You can see your score, total questions, percentage, grade, pass/fail status, exam date, and attempt number. You can print or download a result slip.' },
  { category: 'Results', question: 'Can someone verify my results externally?', answer: 'Yes. Employers and institutions can use the public Results Verification page, enter your candidate reference, and securely confirm your results and certificates.' },

  { category: 'Payments', question: 'How do I pay for exams?', answer: 'Go to Exam Payment in your student portal, select an available exam, and complete the payment. You will receive a payment confirmation and your attempts will be activated immediately.' },
  { category: 'Payments', question: 'Can I get a refund?', answer: 'Refunds are handled by your institution admin or the super admin. Failed payments are automatically reversed and do not consume credits.' },

  { category: 'Account', question: 'I forgot my password. What do I do?', answer: 'Click "Login / Register," then "Forgot Password." Enter your email and follow the reset link to set a new password.' },
  { category: 'Account', question: 'How do I change my role?', answer: 'Your role is assigned by your institution. Contact your school or tertiary education admin if you need a role change.' },
];

export type Testimonial = {
  name: string;
  role: string;
  institution: string;
  quote: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  { name: 'Dr. Adaeze Okonkwo', role: 'Registrar', institution: 'Lagos Tertiary Institution', quote: 'I-LearnAce transformed how we manage examinations. Course registration, exam scheduling, and results release are now seamless across all faculties.', initials: 'AO' },
  { name: 'Mr. Tunde Bakare', role: 'Principal', institution: 'King\'s College', quote: 'Report cards, attendance, and communication used to take weeks. With I-LearnAce, everything is in real time. It has changed our school.', initials: 'TB' },
  { name: 'Grace Eze', role: 'Student', institution: 'Nigeria Tertiary Institution, Nsukka', quote: 'I registered for courses, paid for exams, and got my results — all from my phone. The result slip download made verification easy for my internship.', initials: 'GE' },
  { name: 'Prof. Ibrahim Sule', role: 'Dean of Engineering', institution: 'Ahmadu Bello Tertiary Institution', quote: 'The question bank and automatic marking saved our department hundreds of hours. Lecturers now focus on teaching, not administration.', initials: 'IS' },
  { name: 'Chioma Nwosu', role: 'Teacher', institution: 'Queen\'s College', quote: 'Creating exams from the question bank takes minutes. Marking is instant for objective questions, and I can focus on the written answers.', initials: 'CN' },
  { name: 'Emeka Obi', role: 'Student', institution: 'Covenant Tertiary Institution', quote: 'The CBT exam interface is clean and reliable. I never worry about losing my answers, and results come back instantly for objective tests.', initials: 'EO' },
];

export type FooterLink = { label: string; to: string };

export const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About I-LearnAce', to: '/about' },
      { label: 'Tertiary Learning', to: '/tertiary' },
      { label: 'Institutions', to: '/institutions' },
      { label: 'Tertiary Education', to: '/tertiary' },
      { label: 'Courses & Programmes', to: '/courses' },
    ],
  },
  {
    title: 'Academics',
    links: [
      { label: 'Examinations', to: '/examinations' },
      { label: 'Results Verification', to: '/results' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Portals',
    links: [
      { label: 'Student Portal', to: '/login' },
      { label: 'Teacher Portal', to: '/login' },
      { label: 'Lecturer Portal', to: '/login' },
      { label: 'Admin Portals', to: '/login' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Login / Register', to: '/login' },
    ],
  },
];

export const heroImages = {
  campus: 'https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  study: 'https://images.pexels.com/photos/37758609/pexels-photo-37758609.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  graduation: 'https://images.pexels.com/photos/30562665/pexels-photo-30562665.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  schoolStudents: 'https://images.pexels.com/photos/34162714/pexels-photo-34162714.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  exam: 'https://images.pexels.com/photos/6684209/pexels-photo-6684209.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  lecture: 'https://images.pexels.com/photos/8197534/pexels-photo-8197534.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

export const utilityIcons = {
  Globe2, FileText, Award, Bell, BarChart3,
};
