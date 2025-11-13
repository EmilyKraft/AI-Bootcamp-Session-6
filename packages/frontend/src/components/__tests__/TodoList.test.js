import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    const { container } = render(
      <TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />
    );
    
    const cards = container.querySelectorAll('.todo-card');
    expect(cards).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });
});

describe('TodoList Component - Overdue Integration Tests', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockCurrentDate = new Date('2025-11-13T12:00:00Z');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(mockCurrentDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should display overdue styling for multiple overdue todos', () => {
    const todosWithOverdue = [
      { id: 1, title: 'Overdue 1', dueDate: '2025-11-10', completed: 0 },
      { id: 2, title: 'Overdue 2', dueDate: '2025-11-11', completed: 0 },
      { id: 3, title: 'Future', dueDate: '2025-11-20', completed: 0 }
    ];

    const { container } = render(
      <TodoList todos={todosWithOverdue} {...mockHandlers} isLoading={false} />
    );

    const overduecards = container.querySelectorAll('.todo-card.overdue');
    expect(overduecards).toHaveLength(2);
  });

  it('should display consistent overdue styling across all overdue todos', () => {
    const todosWithOverdue = [
      { id: 1, title: 'Overdue 1', dueDate: '2025-11-10', completed: 0 },
      { id: 2, title: 'Overdue 2', dueDate: '2025-11-05', completed: 0 }
    ];

    render(
      <TodoList todos={todosWithOverdue} {...mockHandlers} isLoading={false} />
    );

    const overdueIcons = screen.getAllByLabelText('Overdue');
    expect(overdueIcons).toHaveLength(2);
  });

  it('should NOT display overdue styling for completed todos even with past dates', () => {
    const todosWithCompleted = [
      { id: 1, title: 'Completed Overdue', dueDate: '2025-11-10', completed: 1 },
      { id: 2, title: 'Active Overdue', dueDate: '2025-11-11', completed: 0 }
    ];

    const { container } = render(
      <TodoList todos={todosWithCompleted} {...mockHandlers} isLoading={false} />
    );

    const overdueCards = container.querySelectorAll('.todo-card.overdue');
    expect(overdueCards).toHaveLength(1);
  });

  it('should handle mixed todo states correctly', () => {
    const mixedTodos = [
      { id: 1, title: 'Overdue', dueDate: '2025-11-10', completed: 0 },
      { id: 2, title: 'Due Today', dueDate: '2025-11-13', completed: 0 },
      { id: 3, title: 'Future', dueDate: '2025-11-20', completed: 0 },
      { id: 4, title: 'Completed Overdue', dueDate: '2025-11-10', completed: 1 },
      { id: 5, title: 'No Date', dueDate: null, completed: 0 }
    ];

    const { container } = render(
      <TodoList todos={mixedTodos} {...mockHandlers} isLoading={false} />
    );

    const overdueCards = container.querySelectorAll('.todo-card.overdue');
    expect(overdueCards).toHaveLength(1);
    
    const overdueIcons = screen.queryAllByLabelText('Overdue');
    expect(overdueIcons).toHaveLength(1);
  });
});

describe('TodoList Component - Real-Time Updates', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should trigger periodic overdue checks with setInterval', () => {
    jest.setSystemTime(new Date('2025-11-13T12:00:00Z'));

    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    const todos = [
      { id: 1, title: 'Todo 1', dueDate: '2025-11-10', completed: 0 }
    ];

    render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

    // Verify setInterval was called
    expect(setIntervalSpy).toHaveBeenCalled();

    setIntervalSpy.mockRestore();
  });

  it('should clean up interval on unmount', () => {
    jest.setSystemTime(new Date('2025-11-13T12:00:00Z'));

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const todos = [
      { id: 1, title: 'Todo 1', dueDate: '2025-11-10', completed: 0 }
    ];

    const { unmount } = render(
      <TodoList todos={todos} {...mockHandlers} isLoading={false} />
    );

    // Verify clearInterval is called on unmount
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });
});
