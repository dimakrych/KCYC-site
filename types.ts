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
  instagram?: string; // New field for Instagram link
  image: string;
  details: string[]; // Bullet points for popup
  detailsEn?: string[]; // English Bullet points
  order?: number; // Sorting order within department
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
  hasRegistration?: boolean; // Whether the project has a registration form
  order?: number; // Sorting order
  ownershipType?: 'own' | 'support' | 'partner';
  partnerName?: string;
}

export type FormFieldType = 'text' | 'textarea' | 'social' | 'select';

export interface FormQuestion {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select inputs
  allowMultiple?: boolean; // For select inputs: true = checkboxes, false = radio
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
  order?: number; // Sorting order
}

export interface PartnerType {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  color: string; // Background color for header icon
  icon?: string; // URL icon
  order?: number;
}

export interface PartnerItem {
  id: string;
  name: string;
  nameEn?: string;
  image: string;
  type: string; // ID of PartnerType
  bgColor: string;
  link: string;
  order?: number;
}

// Legacy types for constants (used for group headers)
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
  items: Partner[]; // Used only for static fallback
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

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: any;
}