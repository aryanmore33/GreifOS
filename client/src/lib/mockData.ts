export interface Asset {
  id: string;
  name: string;
  type: 'bank' | 'insurance' | 'investment' | 'subscription';
  accountType: string;
  enabled: boolean;
  amount?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  urgency: 'red' | 'amber' | 'green';
  period: 'week' | 'month' | 'sixmonths';
  done: boolean;
}

export interface Letter {
  id: string;
  institution: string;
  initials: string;
  color: string;
  letterType: string;
  status: 'ready' | 'generated';
}

export const mockAssets: Asset[] = [
  { id: '1', name: 'HDFC Bank', type: 'bank', accountType: 'Savings Account', enabled: true },
  { id: '2', name: 'LIC', type: 'insurance', accountType: 'Premium Policy', enabled: true },
  { id: '3', name: 'Zerodha', type: 'investment', accountType: 'Trading Account', enabled: true },
  { id: '4', name: 'Netflix', type: 'subscription', accountType: 'Monthly Subscription', enabled: true },
  { id: '5', name: 'SBI', type: 'bank', accountType: 'Savings Account', enabled: true },
  { id: '6', name: 'Groww', type: 'investment', accountType: 'SIP Investment', enabled: true },
  { id: '7', name: 'Jio', type: 'subscription', accountType: 'Mobile Plan', enabled: true },
];

export const mockChecklist: ChecklistItem[] = [
  { id: '1', title: 'Notify HDFC Bank of passing', subtitle: 'Deceased account closure', urgency: 'red', period: 'week', done: false },
  { id: '2', title: 'Cancel Netflix subscription', subtitle: '₹649/month', urgency: 'red', period: 'week', done: false },
  { id: '3', title: 'File LIC claim intimation', subtitle: 'Policy #LIC7823XX', urgency: 'red', period: 'week', done: false },
  { id: '4', title: 'Notify Jio of SIM transfer', subtitle: 'Mobile number transfer', urgency: 'amber', period: 'week', done: false },
  { id: '5', title: 'Contact Zerodha nominee cell', subtitle: 'Trading account transfer', urgency: 'amber', period: 'week', done: false },
  { id: '6', title: 'Apply for succession certificate', subtitle: 'District court filing', urgency: 'amber', period: 'month', done: false },
  { id: '7', title: 'Update SBI account nominee', subtitle: 'Bank branch visit', urgency: 'green', period: 'month', done: false },
  { id: '8', title: 'File income tax return', subtitle: 'For current assessment year', urgency: 'green', period: 'sixmonths', done: false },
];

export const mockLetters: Letter[] = [
  { id: '1', institution: 'HDFC Bank', initials: 'HB', color: '#3B82F6', letterType: 'Deceased Account Closure Request', status: 'ready' },
  { id: '2', institution: 'LIC', initials: 'LI', color: '#0D7377', letterType: 'Death Claim Intimation Letter', status: 'ready' },
  { id: '3', institution: 'Zerodha', initials: 'ZE', color: '#B7770D', letterType: 'Nominee Transfer Request', status: 'ready' },
  { id: '4', institution: 'Netflix', initials: 'NF', color: '#C0392B', letterType: 'Account Cancellation Request', status: 'generated' },
  { id: '5', institution: 'SBI', initials: 'SB', color: '#3B82F6', letterType: 'Deceased Account Closure Request', status: 'ready' },
  { id: '6', institution: 'Groww', initials: 'GR', color: '#B7770D', letterType: 'Nominee Transfer Request', status: 'ready' },
  { id: '7', institution: 'Jio', initials: 'JI', color: '#C0392B', letterType: 'SIM Deactivation Request', status: 'ready' },
];

export const chatMessages = [
  {
    id: '1',
    role: 'ai' as const,
    text: "I'm here to help you through this. Based on the assets in the vault, I can see you have 2 bank accounts, 1 LIC policy, and 2 investments to manage. Would you like to start with the most urgent tasks, or do you have a specific question?",
  },
];

export const suggestedQuestions = [
  "What do I do first?",
  "How do I claim the LIC policy?",
  "Do I need a lawyer?",
  "What is a succession certificate?",
];
