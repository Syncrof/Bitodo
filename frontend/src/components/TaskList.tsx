import React from 'react';
import { Task, ID } from './TaskItem';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleDone: (id: ID) => void;
  onOpenDetails: (task: Task) => void;
}

const TaskList = ({ tasks, onToggleDone, onOpenDetails }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-xl font-medium mb-2">Henüz görev yok</h2>
        <p>Yeni bir görev ekleyerek başlayabilirsin.</p>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {tasks.map((task: Task) => {
         return (
           <TaskItem
             key={task.id}
             task={task}
             onToggleDone={onToggleDone}
             onOpenDetails={onOpenDetails}
           />
         );
       })}
    </ul>
  );
};

export default TaskList;
