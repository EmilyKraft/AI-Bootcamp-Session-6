import React, { useState, useEffect } from 'react';
import TodoCard from './TodoCard';

function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  const [forceUpdateKey, setForceUpdateKey] = useState(0);

  // Real-time overdue status updates
  useEffect(() => {
    // Check for overdue status changes every minute
    const interval = setInterval(() => {
      const now = new Date();
      // Check if it's just past midnight (within 1 minute boundary)
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        // Force re-render at midnight to update overdue status
        setForceUpdateKey(prev => prev + 1);
      }
    }, 60000); // Check every minute

    // Recalculate overdue status on user interaction
    const handleInteraction = () => {
      setForceUpdateKey(prev => prev + 1);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keypress', handleInteraction);
    window.addEventListener('focus', handleInteraction);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keypress', handleInteraction);
      window.removeEventListener('focus', handleInteraction);
    };
  }, []);

  if (todos.length === 0) {
    return (
      <div className="todo-list empty-state">
        <p className="empty-state-message">
          No todos yet. Add one to get started! 👻
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list" key={forceUpdateKey}>
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

export default TodoList;
