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
}
