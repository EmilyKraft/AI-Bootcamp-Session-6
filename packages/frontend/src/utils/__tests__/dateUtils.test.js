import { isOverdue } from '../dateUtils';

describe('isOverdue', () => {
  const mockCurrentDate = new Date('2025-11-13T12:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockCurrentDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns true for incomplete todo with past due date', () => {
    const todo = {
      id: '1',
      dueDate: '2025-11-10',
      completed: false
    };
    expect(isOverdue(todo)).toBe(true);
  });

  test('returns false for todo due today', () => {
    const todo = {
      id: '2',
      dueDate: '2025-11-13',
      completed: false
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for incomplete todo with future due date', () => {
    const todo = {
      id: '3',
      dueDate: '2025-11-20',
      completed: false
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for completed todo with past due date', () => {
    const todo = {
      id: '4',
      dueDate: '2025-11-10',
      completed: true
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for todo with no due date', () => {
    const todo = {
      id: '5',
      dueDate: null,
      completed: false
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for todo with undefined due date', () => {
    const todo = {
      id: '6',
      completed: false
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('handles midnight boundary correctly - todo due yesterday at end of day', () => {
    // Set current time to just after midnight on Nov 13
    jest.setSystemTime(new Date('2025-11-13T00:00:01Z'));
    
    const todo = {
      id: '7',
      dueDate: '2025-11-12', // Yesterday
      completed: false
    };
    expect(isOverdue(todo)).toBe(true);
  });

  test('handles end of day correctly - todo due today should not be overdue', () => {
    // Set current time to 11:59 PM on Nov 13
    jest.setSystemTime(new Date('2025-11-13T23:59:00Z'));
    
    const todo = {
      id: '8',
      dueDate: '2025-11-13', // Today
      completed: false
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false and logs warning for invalid date format', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const todo = {
      id: '9',
      dueDate: 'invalid-date',
      completed: false
    };
    
    expect(isOverdue(todo)).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid due date format for todo 9')
    );
    
    consoleWarnSpy.mockRestore();
  });

  test('handles multiple todos with different states correctly', () => {
    const todos = [
      { id: '10', dueDate: '2025-11-10', completed: false }, // overdue
      { id: '11', dueDate: '2025-11-13', completed: false }, // not overdue (today)
      { id: '12', dueDate: '2025-11-20', completed: false }, // not overdue (future)
      { id: '13', dueDate: '2025-11-10', completed: true },  // not overdue (completed)
      { id: '14', dueDate: null, completed: false }          // not overdue (no date)
    ];

    expect(isOverdue(todos[0])).toBe(true);
    expect(isOverdue(todos[1])).toBe(false);
    expect(isOverdue(todos[2])).toBe(false);
    expect(isOverdue(todos[3])).toBe(false);
    expect(isOverdue(todos[4])).toBe(false);
  });
});
