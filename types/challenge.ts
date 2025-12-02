// types/challenge.ts
export interface Challenge {
    id: string;
    name: string;
    description: string;
    targetDays: number; // e.g., 7 for a weekly challenge
    progress: { date: string; completed: boolean }[]; // Track daily completion
    completedDate?: string; // Date when challenge was completed
    isCompleted: boolean;
    medalEarned: boolean;
    type: 'standard' | 'custom';
}
