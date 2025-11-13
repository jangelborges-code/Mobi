export type Section = 'Leads' | 'Toolkit' | 'Blackboard';

export enum Temperature {
  Hot = 'Caliente',
  Warm = 'Tibio',
  Cold = 'Frío',
}

export interface Message {
  id: number;
  sender: 'agent' | 'lead' | 'mobi-suggestion' | 'mobi-image';
  text: string;
  timestamp: string;
}

export interface Lead {
  id: number;
  name: string;
  project: string;
  temperature: Temperature;
  persona: string;
  conversation: Message[];
  jobTitle?: string;
  company?: string;
  phone?: string;
  email?: string;
  stage?: string;
  owner?: string;
  tags?: string[];
}

export interface CalendarEvent {
  id: number;
  date: Date;
  title: string;
  description: string;
  time: string;
}

export interface Objection {
  id: number;
  title: string;
  arguments: string[];
}

export interface ProjectResource {
  id: number;
  project: string;
  name: string;
  url: string;
  type: 'pdf' | 'folder' | 'xlsx' | 'docx';
}

export interface MobiState {
  leads: Lead[];
  selectedLead: Lead | null;
  objections: Objection[];
  resources: ProjectResource[];
  setSelectedLead: (lead: Lead | null) => void;
  addMessageToLead: (leadId: number, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateLeadTemperature: (leadId: number, temperature: Temperature) => void;
  addLead: (lead: Omit<Lead, 'id' | 'conversation'>) => void;
  addMultipleLeads: (leads: Omit<Lead, 'id' | 'conversation'>[]) => void;
  addObjection: (objection: Omit<Objection, 'id'>) => void;
  updateObjection: (objection: Objection) => void;
  deleteObjection: (objectionId: number) => void;
  updateLead: (updatedLead: Lead) => void;
}

export interface MobiChatMessage {
  sender: 'agent' | 'mobi';
  text: string;
}

// Mobi Design Types
export interface ImageFile {
  base64: string;
  mimeType: string;
}

export interface FurnitureItem {
  id: string;
  name: string;
  prompt: string;
}

export type ResultStatus = 'welcome' | 'loading' | 'success' | 'error';

export interface ResultState {
  status: ResultStatus;
  data?: string; // base64 image string for success
  message?: string; // loading message or error message
}