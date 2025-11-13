import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

describe('TodoCard Component - Overdue Visual Indicators', () => {
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

  it('should display overdue styling for incomplete todo with past due date', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue Todo',
      dueDate: '2025-11-10',
      completed: 0
    };

    const { container } = render(
      <TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />
    );

    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('overdue');
  });

  it('should display overdue icon for incomplete todo with past due date', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue Todo',
      dueDate: '2025-11-10',
      completed: 0
    };

    render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

    const icon = screen.getByLabelText('Overdue');
    expect(icon).toBeInTheDocument();
  });

  it('should NOT display overdue styling for todo due today', () => {
    const todayTodo = {
      id: 2,
      title: 'Due Today',
      dueDate: '2025-11-13',
      completed: 0
    };

    const { container } = render(
      <TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />
    );

    const card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });

  it('should NOT display overdue styling for incomplete todo with future due date', () => {
    const futureTodo = {
      id: 3,
      title: 'Future Todo',
      dueDate: '2025-11-20',
      completed: 0
    };

    const { container } = render(
      <TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />
    );

    const card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });

  it('should NOT display overdue styling for completed todo with past due date', () => {
    const completedOverdueTodo = {
      id: 4,
      title: 'Completed Overdue',
      dueDate: '2025-11-10',
      completed: 1
    };

    const { container } = render(
      <TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />
    );

    const card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });

  it('should NOT display overdue styling for todo with no due date', () => {
    const noDueDateTodo = {
      id: 5,
      title: 'No Due Date',
      dueDate: null,
      completed: 0
    };

    const { container } = render(
      <TodoCard todo={noDueDateTodo} {...mockHandlers} isLoading={false} />
    );

    const card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });

  it('should have accessible color contrast for overdue styling', () => {
    const overdueTodo = {
      id: 6,
      title: 'Overdue Todo',
      dueDate: '2025-11-10',
      completed: 0
    };

    const { container } = render(
      <TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />
    );

    const card = container.querySelector('.todo-card.overdue');
    expect(card).toBeInTheDocument();
    // Color contrast will be verified in manual testing (T025)
  });
});

describe('TodoCard Component - Real-Time Overdue Updates', () => {
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

  it('should update to overdue when midnight boundary is crossed', () => {
    // Start at 11:59 PM on Nov 12 (todo due Nov 12)
    jest.setSystemTime(new Date('2025-11-12T23:59:00Z'));

    const todoToday = {
      id: 1,
      title: 'Due Today',
      dueDate: '2025-11-12',
      completed: 0
    };

    const { container, rerender } = render(
      <TodoCard todo={todoToday} {...mockHandlers} isLoading={false} />
    );

    // Should NOT be overdue yet
    expect(container.querySelector('.todo-card.overdue')).not.toBeInTheDocument();

    // Advance to 12:00 AM on Nov 13 (next day)
    jest.setSystemTime(new Date('2025-11-13T00:00:01Z'));

    // Force re-render to trigger overdue recalculation
    rerender(<TodoCard todo={todoToday} {...mockHandlers} isLoading={false} />);

    // Should NOW be overdue
    expect(container.querySelector('.todo-card.overdue')).toBeInTheDocument();
  });
});
