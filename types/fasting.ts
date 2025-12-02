// types/fasting.ts
export interface FastingState {
    isActive: boolean;
    startTime: string | null; // ISO string
    endTime: string | null;   // ISO string (calculated)
    durationHours: number;
    completionNotified: boolean;
}
