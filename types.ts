export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CompanyInfo {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface ClientInfo {
  name: string;
  contactName: string;
  projectTitle: string;
}

export interface ProposalInput {
  sender: CompanyInfo;
  client: ClientInfo;
  projectDescription: string;
  items: LineItem[];
  validityDays: number;
  tone: 'formal' | 'modern' | 'persuasive';
}

export interface GeneratedSection {
  title: string;
  content: string;
}

export interface ProposalOutput {
  title: string;
  introduction: string;
  objective: string;
  methodology: string[];
  timeline: string;
  investmentText: string;
  termsAndConditions: string[];
  closing: string;
}