export interface Category {
  id: string;
  name: string;
  color: string;
}

export type TaskType = 'daily' | 'one-time';

export interface Task {
  id: string;
  title: string;
  categoryId: string;
  type: TaskType;
  completed: boolean;
  deadline?: string; // ISO date string for one-time tasks
  routineTime?: string; // "HH:mm" for daily rituals
  createdAt: string;
}

export type Tab = 'home' | 'routine' | 'manage';
