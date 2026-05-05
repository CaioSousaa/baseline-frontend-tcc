export interface Tag {
  _id: string;
  name: string;
  color: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  tags: (Tag | string)[];
  alert?: string;
}

export interface Notification {
  _id: string;
  owner: string;
  task: {
    _id: string;
    title: string;
    dueDate: string;
  };
  message: string;
  read: boolean;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
