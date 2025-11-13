# Quickstart Guide: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2025-11-13  
**For**: Developers implementing this feature

## Overview

This guide helps you implement visual indicators for overdue todos in the React frontend. Follow these steps in order for a smooth TDD (Test-Driven Development) workflow.

## Prerequisites

- ✅ Feature specification reviewed (`spec.md`)
- ✅ Implementation plan reviewed (`plan.md`)
- ✅ Research document reviewed (`research.md`)
- ✅ Data model understood (`data-model.md`)
- ✅ Development environment set up (Node.js 16+, npm 7+)

## Quick Start (5 Minutes)

### 1. Checkout Feature Branch

```bash
git checkout 001-overdue-todos
```

### 2. Install Dependencies (if needed)

```bash
npm install
```

### 3. Run Existing Tests (Baseline)

```bash
npm test
```

All tests should pass before starting. Expected output:
```
Test Suites: X passed, X total
Tests:       X passed, X total
```

### 4. Start Development Servers

Open two terminal windows:

**Terminal 1 - Frontend**:
```bash
npm run start:frontend
```
Frontend runs at: http://localhost:3000

**Terminal 2 - Backend**:
```bash
npm run start:backend
```
Backend runs at: http://localhost:3001

---

## Implementation Phases

### Phase 1: Create Date Utility (TDD)

**Location**: `packages/frontend/src/utils/dateUtils.js`

#### Step 1.1: Write Tests First

Create `packages/frontend/src/utils/__tests__/dateUtils.test.js`:

```javascript
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

  test('returns false for completed todo with past due date', () => {
    const todo = {
      id: '3',
      dueDate: '2025-11-10',
      completed: true
    };
    expect(isOverdue(todo)).toBe(false);
  });

  test('returns false for todo with no due date', () => {
    const todo = {
      id: '4',
      dueDate: null,
      completed: false
    };
    expect(isOverdue(todo)).toBe(false);
  });

  // Add more tests from data-model.md test scenarios
});
```

**Run tests** (should fail - Red):
```bash
npm test -- dateUtils.test.js
```

#### Step 1.2: Implement isOverdue Function

Create `packages/frontend/src/utils/dateUtils.js`:

```javascript
/**
 * Determines if a todo is overdue based on current date/time.
 * 
 * Rules:
 * - No due date → not overdue
 * - Completed → not overdue (regardless of date)
 * - Current time > end of due date (11:59:59 PM) → overdue
 * 
 * @param {Object} todo - Todo object with dueDate and completed properties
 * @returns {boolean} - True if overdue, false otherwise
 */
export function isOverdue(todo) {
  // Rule 1: No due date = not overdue
  if (!todo.dueDate) return false;
  
  // Rule 2: Completed todos are never overdue
  if (todo.completed) return false;
  
  try {
    // Rule 3: Check if past end of due date
    const now = new Date();
    const endOfDueDate = new Date(todo.dueDate);
    
    // Validate date
    if (isNaN(endOfDueDate.getTime())) {
      console.warn(`Invalid due date format for todo ${todo.id}: ${todo.dueDate}`);
      return false;
    }
    
    // Set to end of day (11:59:59.999 PM)
    endOfDueDate.setHours(23, 59, 59, 999);
    
    // Rule 4: Overdue if current time > end of due date
    return now > endOfDueDate;
    
  } catch (error) {
    console.warn(`Error calculating overdue status for todo ${todo.id}:`, error);
    return false;
  }
}
```

**Run tests** (should pass - Green):
```bash
npm test -- dateUtils.test.js
```

---

### Phase 2: Update TodoCard Component (TDD)

**Location**: `packages/frontend/src/components/TodoCard.js`

#### Step 2.1: Write Component Tests

Update `packages/frontend/src/components/__tests__/TodoCard.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard - Overdue Visual Indicators', () => {
  const mockHandlers = {
    onToggleComplete: jest.fn(),
    onUpdateDueDate: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-11-13T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('displays overdue styling for past-due incomplete todo', () => {
    const todo = {
      id: '1',
      title: 'Overdue Task',
      dueDate: '2025-11-10',
      completed: false
    };
    
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} />);
    
    // Check for overdue class
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('overdue');
    
    // Check for warning icon
    const icon = screen.getByLabelText('Overdue');
    expect(icon).toBeInTheDocument();
  });

  test('does NOT display overdue styling for future-due todo', () => {
    const todo = {
      id: '2',
      title: 'Future Task',
      dueDate: '2025-11-20',
      completed: false
    };
    
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });

  test('does NOT display overdue styling for completed todo', () => {
    const todo = {
      id: '3',
      title: 'Completed Task',
      dueDate: '2025-11-10',
      completed: true
    };
    
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} />);
    
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  // Add more tests...
});
```

**Run tests** (should fail):
```bash
npm test -- TodoCard.test.js
```

#### Step 2.2: Update TodoCard Component

Modify `packages/frontend/src/components/TodoCard.js`:

```javascript
import React from 'react';
import { isOverdue } from '../utils/dateUtils';
import './TodoCard.css';

function TodoCard({ todo, onToggleComplete, onUpdateDueDate, onDelete }) {
  // Calculate overdue status
  const overdue = isOverdue(todo);

  return (
    <div className={`todo-card ${overdue ? 'overdue' : ''}`}>
      {overdue && (
        <span className="overdue-icon" aria-label="Overdue" role="img">
          ⚠️
        </span>
      )}
      
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      
      <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
        {todo.title}
      </span>
      
      {todo.dueDate && (
        <span className="todo-due-date">
          Due: {new Date(todo.dueDate).toLocaleDateString()}
        </span>
      )}
      
      {/* Existing edit/delete buttons */}
    </div>
  );
}

export default React.memo(TodoCard);
```

**Run tests** (should pass):
```bash
npm test -- TodoCard.test.js
```

---

### Phase 3: Add Styling

**Location**: `packages/frontend/src/styles/theme.css`

Add overdue styles:

```css
/* Overdue Todo Styling */
.todo-card.overdue {
  border-left: 3px solid var(--danger-color);
}

.overdue-icon {
  color: var(--danger-color);
  margin-right: 8px;
  font-size: 1.2em;
}

.todo-card.overdue .todo-title {
  color: var(--danger-color);
}

/* Light Mode Colors */
:root {
  --danger-color: #c62828; /* WCAG AA: 7.4:1 contrast on white */
}

/* Dark Mode Colors */
@media (prefers-color-scheme: dark) {
  :root {
    --danger-color: #ef5350; /* WCAG AA: 5.2:1 contrast on dark bg */
  }
}

/* High Contrast Accessibility */
@media (prefers-contrast: high) {
  .todo-card.overdue {
    border-left-width: 5px;
    font-weight: 600;
  }
}
```

**Test visually**: Check the app in browser with overdue todos.

---

### Phase 4: Add Real-Time Updates (Optional P2)

**Location**: `packages/frontend/src/components/TodoList.js`

Add periodic refresh for midnight boundary:

```javascript
import React, { useEffect, useState } from 'react';

function TodoList({ todos, ...handlers }) {
  const [, forceUpdate] = useState();

  useEffect(() => {
    // Check every minute for midnight crossing
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        forceUpdate({}); // Trigger re-render at midnight
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Also recalculate on user interaction (fallback)
  const handleInteraction = () => {
    forceUpdate({});
  };

  return (
    <div onClick={handleInteraction} onFocus={handleInteraction}>
      {todos.map(todo => (
        <TodoCard key={todo.id} todo={todo} {...handlers} />
      ))}
    </div>
  );
}
```

---

## Testing Checklist

Run all these before considering feature complete:

### Unit Tests
```bash
# Date utility tests
npm test -- dateUtils.test.js

# Should see: 10+ tests passing
```

### Component Tests
```bash
# TodoCard component tests
npm test -- TodoCard.test.js

# TodoList component tests (if modified)
npm test -- TodoList.test.js
```

### Coverage Check
```bash
npm test -- --coverage

# Target: 80%+ coverage on modified files
```

### Manual Testing

1. **Create overdue todo**:
   - Set due date to yesterday
   - Verify red color + warning icon appear

2. **Create future todo**:
   - Set due date to next week
   - Verify NO overdue styling

3. **Complete overdue todo**:
   - Check the checkbox
   - Verify overdue styling disappears immediately

4. **Edge cases**:
   - Create todo with no due date → no overdue styling
   - Create todo due today → no overdue styling (until tomorrow)

---

## Performance Validation

### Check Render Performance

```javascript
// In browser console:
console.time('render');
// Trigger re-render by toggling a todo
console.timeEnd('render');

// Should be < 500ms even with 500 todos
```

### Bundle Size Check

```bash
npm run build

# Check build output:
# main.js should increase by ~2KB only
```

---

## Accessibility Validation

### Screen Reader Test

1. Use NVDA/JAWS (Windows) or VoiceOver (Mac)
2. Navigate to overdue todo
3. Should announce: "Warning, Overdue" + todo title

### Contrast Check

1. Use browser DevTools (Inspect element)
2. Check computed color values
3. Verify 4.5:1 minimum contrast ratio

### Keyboard Navigation

1. Tab through todos
2. Verify focus indicators visible on overdue todos

---

## Common Issues & Solutions

### Issue: Tests failing with "isOverdue is not a function"

**Solution**: Ensure export in dateUtils.js:
```javascript
export function isOverdue(todo) { ... }
```

### Issue: Overdue styling not appearing

**Solution**: Check CSS import in component:
```javascript
import './TodoCard.css'; // or '../styles/theme.css'
```

### Issue: Warning icon not accessible

**Solution**: Add proper aria-label:
```jsx
<span aria-label="Overdue" role="img">⚠️</span>
```

### Issue: Real-time updates not working

**Solution**: Use jest.useFakeTimers() in tests:
```javascript
jest.useFakeTimers();
jest.advanceTimersByTime(60000); // Fast-forward 1 minute
```

---

## Definition of Done

Before marking feature complete:

- [ ] All unit tests passing (dateUtils.test.js)
- [ ] All component tests passing (TodoCard.test.js)
- [ ] Code coverage ≥80% on modified files
- [ ] Visual regression test passed (screenshot comparison)
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Manual testing checklist completed
- [ ] No console errors or warnings
- [ ] Code review completed
- [ ] Documentation updated (if needed)

---

## Next Steps

After implementation:

1. **Create Pull Request**:
   ```bash
   git add .
   git commit -m "feat: add overdue visual indicators to todos"
   git push origin 001-overdue-todos
   ```

2. **Code Review**: Request review from team

3. **Merge**: After approval, merge to main branch

4. **Deploy**: Follow standard deployment process

---

## Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Timer Mocks](https://jestjs.io/docs/timer-mocks)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Date Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

---

## Questions?

- Check `research.md` for design decisions
- Check `data-model.md` for overdue calculation logic
- Check `spec.md` for requirements
- Ask in team chat or create discussion issue
