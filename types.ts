import { LucideIcon } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  roleEn?: string;
  department: string; // ID of the department
  bio: string;
  bioEn?: string;
  email?: string;
  image: string;
  details: string[]; // Bullet points for popup
  detailsEn?: string[]; // English Bullet points
}

export interface Department {
  id: string;
  name: string;
  nameEn?: string; // English Name
  description: string;
  descriptionEn?: string; // English Description
  icon: any; // Can be LucideIcon (legacy/static) or string (URL from DB)
  color: string; // Tailwind class (legacy) or Hex Code (dynamic)
  order?: number; // Sorting order
}

export interface Project {
  id: string;
  title: string;
  titleEn?: string; // English Title
  description: string; // Short description for card
  descriptionEn?: string; // Short description EN
  fullDescription?: string; // Long description for Modal
  fullDescriptionEn?: string; // Long description EN
  date: string; // Display string e.g. "May 2024"
  deadline?: string; // ISO Date string e.g. "2024-05-20" for logic
  image: string;
  instagramLink?: string;
  questions?: FormQuestion[]; // Custom form configuration specific to this project
}

export type FormFieldType = 'text' | 'textarea' | 'social' | 'select';

export interface FormQuestion {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select inputs
}

export interface Opportunity {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  deadline: string;
  link: string; // Internal link logic or external
  type: 'Volunteering' | 'Education' | 'Job' | 'Event';
  image?: string; // Optional cover image
  questions?: FormQuestion[]; // Custom form configuration
}

export interface SDG {
  id: number;
  title: string;
  icon: LucideIcon;
  color: string;
}

export interface FocusArea {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: string; // e.g., "PDF", "DOCX"
  date: string;
  size?: string;
  link: string;
}

export interface Partner {
  name: string;
  image: string;
}

export interface PartnerGroup {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  items: Partner[];
}

// New Types for Backend/Admin
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  motivation: string;
  status: 'new' | 'contacted' | 'approved' | 'rejected';
  createdAt: string;
}