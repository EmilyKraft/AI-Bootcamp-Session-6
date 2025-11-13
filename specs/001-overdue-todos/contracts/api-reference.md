# API Contracts: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2025-11-13  
**Status**: No API changes required

## Overview

This feature is entirely frontend-focused and does **NOT require any backend API modifications**. This document serves as a reference to existing API endpoints that the feature will consume.

## Existing API Endpoints (No Changes)

### GET /api/todos

**Purpose**: Retrieve all todos for the user

**Request**:
```http
GET /api/todos HTTP/1.1
Host: localhost:3001
```

**Response** (200 OK):
```json
[
  {
    "id": "todo-1",
    "title": "Complete project report",
    "dueDate": "2025-11-15",
    "completed": false,
    "createdAt": "2025-11-01T10:00:00Z"
  },
  {
    "id": "todo-2",
    "title": "Review pull requests",
    "dueDate": null,
    "completed": true,
    "createdAt": "2025-11-10T14:30:00Z"
  }
]
```

**Notes**:
- Overdue status is NOT included in response
- Frontend calculates overdue based on `dueDate` and `completed` fields
- No pagination (single-user app with expected <1000 todos)

---

### POST /api/todos

**Purpose**: Create a new todo

**Request**:
```http
POST /api/todos HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "title": "New todo item",
  "dueDate": "2025-11-20"
}
```

**Response** (201 Created):
```json
{
  "id": "todo-3",
  "title": "New todo item",
  "dueDate": "2025-11-20",
  "completed": false,
  "createdAt": "2025-11-13T16:45:00Z"
}
```

**Validation**:
- `title`: Required, string, max 255 characters
- `dueDate`: Optional, string (ISO 8601 date format)

---

### PUT /api/todos/:id

**Purpose**: Update an existing todo (toggle completion, change due date, edit title)

**Request**:
```http
PUT /api/todos/todo-1 HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "title": "Updated title",
  "dueDate": "2025-11-18",
  "completed": true
}
```

**Response** (200 OK):
```json
{
  "id": "todo-1",
  "title": "Updated title",
  "dueDate": "2025-11-18",
  "completed": true,
  "createdAt": "2025-11-01T10:00:00Z"
}
```

**Notes**:
- All fields in request body are optional (partial updates allowed)
- Frontend will recalculate overdue status after receiving updated todo

---

### DELETE /api/todos/:id

**Purpose**: Delete a todo

**Request**:
```http
DELETE /api/todos/todo-1 HTTP/1.1
Host: localhost:3001
```

**Response** (204 No Content):
```
(empty body)
```

---

## Frontend Interface Contract

### Utility Function: isOverdue

**Purpose**: Calculate if a todo is overdue (frontend-only, not an API)

**Signature**:
```typescript
function isOverdue(todo: Todo): boolean
```

**Input** (Todo object):
```typescript
interface Todo {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
}
```

**Output**: boolean
- `true`: Todo is incomplete AND past its due date (end-of-day logic)
- `false`: Todo is completed, has no due date, or not yet past due date

**Example Usage**:
```javascript
import { isOverdue } from './utils/dateUtils';

const todo = {
  id: "todo-1",
  title: "Submit report",
  dueDate: "2025-11-10",
  completed: false,
  createdAt: "2025-11-01T10:00:00Z"
};

const overdue = isOverdue(todo); // true (if current date > Nov 10, 2025 11:59:59 PM)
```

---

## Component Props Contract

### TodoCard Component

**Modified Props** (no breaking changes):

```typescript
interface TodoCardProps {
  todo: Todo;                    // Existing: todo object from API
  onToggleComplete: (id: string) => void;  // Existing: completion handler
  onUpdateDueDate: (id: string, dueDate: string) => void;  // Existing: due date handler
  onDelete: (id: string) => void;  // Existing: delete handler
  
  // NO NEW PROPS ADDED - overdue status calculated internally
}
```

**Internal Behavior**:
- Component calls `isOverdue(todo)` during render
- Applies `.overdue` CSS class and icon if true
- No prop changes = backward compatible

---

### TodoList Component

**Props** (unchanged):

```typescript
interface TodoListProps {
  todos: Todo[];                 // Array of todos from API
  onToggleComplete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate: string) => void;
  onDelete: (id: string) => void;
}
```

**No contract changes**: Component passes existing props to TodoCard

---

## CSS Class Contract

### New CSS Classes

```css
/* Overdue container styling */
.todo-card.overdue {
  color: var(--danger-color);  /* Red/warning color */
  border-left: 3px solid var(--danger-color);
}

/* Overdue icon */
.overdue-icon {
  color: var(--danger-color);
  margin-right: 8px;
}

/* Accessibility: High contrast mode */
@media (prefers-contrast: high) {
  .todo-card.overdue {
    border-left-width: 5px;
    font-weight: 600;
  }
}
```

**Color Variables** (defined in theme.css):
- Light mode: `--danger-color: #c62828` (contrast 7.4:1 on white)
- Dark mode: `--danger-color: #ef5350` (contrast 5.2:1 on dark bg)

---

## Error Handling Contract

### Console Warnings (Non-Breaking)

When invalid date formats are encountered:

```javascript
console.warn(`Invalid due date for todo ${todo.id}: ${todo.dueDate}`);
// Feature continues to work - treats as "not overdue"
```

**Guarantee**: No thrown exceptions that break UI rendering

---

## Performance Contract

### Guarantees

- **Response Time**: Overdue calculation <0.1ms per todo
- **Rendering**: Visual update <500ms after state change (per SC-003)
- **Bundle Size**: +2KB to frontend bundle (date utility + styles)
- **API Load**: Zero additional API requests

### No Performance Degradation

- Existing todo operations remain unchanged
- No new network requests
- No database queries added

---

## Backward Compatibility

**100% Backward Compatible**:
- ✅ No API changes - existing clients unaffected
- ✅ No schema migrations required
- ✅ No breaking prop changes to components
- ✅ Additive-only CSS classes (no style overrides)
- ✅ Feature can be disabled by simply not applying `.overdue` class

---

## Future API Extensions (Out of Scope)

Potential future enhancements that would require API changes:

1. **Server-side overdue calculation**:
   ```json
   GET /api/todos → { "id": "...", "overdue": true }
   ```

2. **Overdue filtering**:
   ```
   GET /api/todos?filter=overdue
   ```

3. **Overdue count endpoint**:
   ```
   GET /api/todos/overdue/count → { "count": 5 }
   ```

These are explicitly out of scope per feature requirements.

---

## Testing Contract

### Mock API Responses

For testing, use these mock todos:

```javascript
// Mock data for tests
export const mockTodos = [
  {
    id: "overdue-1",
    title: "Past due incomplete",
    dueDate: "2025-11-01",  // Past
    completed: false,
    createdAt: "2025-10-15T10:00:00Z"
  },
  {
    id: "today-1",
    title: "Due today",
    dueDate: "2025-11-13",  // Today
    completed: false,
    createdAt: "2025-11-10T10:00:00Z"
  },
  {
    id: "future-1",
    title: "Future due",
    dueDate: "2025-11-20",  // Future
    completed: false,
    createdAt: "2025-11-12T10:00:00Z"
  },
  {
    id: "completed-1",
    title: "Past due but completed",
    dueDate: "2025-11-01",  // Past
    completed: true,
    createdAt: "2025-10-20T10:00:00Z"
  },
  {
    id: "no-date-1",
    title: "No due date",
    dueDate: null,
    completed: false,
    createdAt: "2025-11-11T10:00:00Z"
  }
];
```

---

## Summary

- **No API modifications required**: Existing endpoints used as-is
- **Frontend-only feature**: All logic in React components and utilities
- **Backward compatible**: Additive changes only, no breaking changes
- **Performance neutral**: No additional API calls or server load
- **Well-defined contracts**: Clear interfaces for components and utilities
