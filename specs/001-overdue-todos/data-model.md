# Data Model: Overdue Todo Items Visual Indicator

**Feature**: 001-overdue-todos  
**Date**: 2025-11-13  
**Status**: Complete

## Overview

This feature does NOT modify the existing data model or introduce new stored entities. The overdue status is a **derived/calculated property** based on existing todo attributes and current date/time. This document describes the logical data model and computation rules.

## Existing Entities

### Todo Item (Unchanged)

**Source**: Existing backend entity, frontend representation

**Attributes**:
- `id` (string): Unique identifier
- `title` (string): Todo description
- `dueDate` (string|null): ISO 8601 date string (e.g., "2025-11-13"), optional
- `completed` (boolean): Completion status
- `createdAt` (string): ISO 8601 timestamp (not used for overdue calculation)

**Storage**: Backend persistence (Express.js API + in-memory or file storage)

**Example**:
```json
{
  "id": "todo-123",
  "title": "Submit project report",
  "dueDate": "2025-11-12",
  "completed": false,
  "createdAt": "2025-11-01T10:00:00Z"
}
```

**Validation Rules** (existing):
- `id`: Required, unique
- `title`: Required, max 255 characters
- `dueDate`: Optional, valid ISO 8601 date if provided
- `completed`: Required, boolean

---

## Derived Properties (Not Stored)

### Overdue Status (Calculated)

**Type**: Computed boolean property

**Calculation Logic**:
```javascript
function isOverdue(todo) {
  // Rule 1: No due date = not overdue
  if (!todo.dueDate) return false;
  
  // Rule 2: Completed todos = not overdue (regardless of due date)
  if (todo.completed) return false;
  
  // Rule 3: Compare current time to end of due date
  const now = new Date();
  const endOfDueDate = new Date(todo.dueDate);
  endOfDueDate.setHours(23, 59, 59, 999); // Set to end of day
  
  // Rule 4: Overdue if current time is after end of due date
  return now > endOfDueDate;
}
```

**Computation Rules**:
1. **No Due Date**: `dueDate === null` → `overdue = false`
2. **Completed**: `completed === true` → `overdue = false` (regardless of date)
3. **Incomplete + Past Due Date**: `completed === false AND currentDateTime > endOf(dueDate)` → `overdue = true`
4. **Incomplete + Today or Future**: `completed === false AND currentDateTime <= endOf(dueDate)` → `overdue = false`

**Dependencies**:
- Current date/time (client-side, browser local timezone)
- Todo.dueDate (string, ISO 8601 format)
- Todo.completed (boolean)

**Recalculation Triggers**:
- Initial component render
- Todo completion status changes (`completed` toggled)
- Todo due date changes (`dueDate` updated)
- Time passes (midnight boundary, interaction events, periodic checks)
- Component re-render (React state/props change)

---

## Data Flow

### Frontend Rendering Flow

```
1. TodoList receives todos[] from API
   ↓
2. For each todo, TodoCard component renders
   ↓
3. isOverdue(todo) calculated on render
   ↓
4. If overdue === true:
   - Apply .overdue CSS class
   - Show warning icon
   - Apply red color styling
   ↓
5. Accessibility attributes added:
   - aria-label="Overdue" on icon
   - Semantic styling maintains text readability
```

### State Management

**Location**: React component state (no global state needed)

**Pattern**: Stateless functional components with hooks

```javascript
// TodoCard.js - Component receives todo as prop
function TodoCard({ todo, onToggleComplete, onUpdateDueDate }) {
  // Derived property calculated on each render
  const overdue = isOverdue(todo);
  
  return (
    <div className={`todo-card ${overdue ? 'overdue' : ''}`}>
      {overdue && <WarningIcon aria-label="Overdue" />}
      <span className="todo-title">{todo.title}</span>
      {/* ... */}
    </div>
  );
}
```

**No State Persistence**: Overdue status is never stored, always calculated fresh.

---

## Time Handling

### Timezone Considerations

**Decision**: Use client's local timezone for all date calculations

**Rationale**:
- Single-user application
- User's context is their local time
- No coordination across users needed

**Implementation**:
```javascript
// Browser automatically uses local timezone
const now = new Date(); // Local time
const dueDate = new Date("2025-11-13"); // Parsed in local timezone
```

### End-of-Day Logic

**Rule**: A todo due on date "D" becomes overdue at 00:00:00 on date "D+1"

**Example**:
- Due date: 2025-11-13
- End of due date: 2025-11-13 23:59:59.999
- Becomes overdue at: 2025-11-14 00:00:00.000

**Precision**: Millisecond-level (JavaScript Date supports this natively)

---

## Validation & Error Handling

### Invalid Date Handling

**Scenarios**:
- Malformed date string (e.g., "not-a-date")
- Invalid ISO format
- Out-of-range dates

**Behavior**:
```javascript
function isOverdue(todo) {
  if (!todo.dueDate || todo.completed) return false;
  
  try {
    const date = new Date(todo.dueDate);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid due date for todo ${todo.id}: ${todo.dueDate}`);
      return false; // Treat as not overdue
    }
    // ... rest of logic
  } catch (error) {
    console.warn(`Error calculating overdue status for todo ${todo.id}:`, error);
    return false; // Fail safely
  }
}
```

**Principle**: Fail gracefully - invalid dates default to "not overdue" with warning logged

---

## Performance Characteristics

### Computational Complexity

- **Per-todo calculation**: O(1) - constant time
- **Full list**: O(n) where n = number of todos
- **Expected performance**: <0.1ms per todo, <50ms for 500 todos

### Memory Footprint

- **No additional storage**: Overdue status not cached
- **No memory overhead**: Calculated on-demand during render
- **React memoization**: Component-level via React.memo(), not data-level

---

## API Contract (No Changes)

**Important**: This feature does NOT modify the existing API.

**Existing Endpoints** (used as-is):
- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo (completion, due date)
- `DELETE /api/todos/:id` - Delete todo

**Response Format** (unchanged):
```json
{
  "id": "string",
  "title": "string",
  "dueDate": "string|null",
  "completed": "boolean",
  "createdAt": "string"
}
```

**No New Fields**: The `overdue` property is NEVER sent to/from the API.

---

## Relationships

### Entity Relationship Diagram

```
┌─────────────────────┐
│   Todo (Existing)   │
├─────────────────────┤
│ id: string          │
│ title: string       │
│ dueDate: string?    │─────┐
│ completed: boolean  │     │
│ createdAt: string   │     │
└─────────────────────┘     │
                            │ Input to
                            ▼
┌─────────────────────────────────────────┐
│   Overdue Status (Derived/Calculated)   │
├─────────────────────────────────────────┤
│ Inputs:                                 │
│  - todo.dueDate                         │
│  - todo.completed                       │
│  - currentDateTime (client)             │
│                                         │
│ Output: boolean (true/false)            │
│                                         │
│ Not stored - recalculated on every use │
└─────────────────────────────────────────┘
```

**Key**: ─── represents "input to" relationship

---

## Future Considerations (Out of Scope)

Items NOT included in current design but could be added later:

1. **Overdue persistence**: Store calculated overdue status in backend (requires API changes)
2. **Overdue age**: Track "how many days overdue" (currently binary yes/no)
3. **Severity levels**: Different styling for 1 day vs 1 week overdue
4. **Backend calculation**: Move overdue logic to API responses
5. **Historical tracking**: Log when todos became overdue

These are explicitly deferred per constitution Principle IV (Simplicity & Scope Control).

---

## Testing Data Scenarios

Test cases for data validation:

| Scenario | dueDate | completed | Current Date | Expected isOverdue |
|----------|---------|-----------|--------------|-------------------|
| Past due, incomplete | 2025-11-10 | false | 2025-11-13 | true |
| Today, incomplete | 2025-11-13 | false | 2025-11-13 | false |
| Future, incomplete | 2025-11-15 | false | 2025-11-13 | false |
| Past due, completed | 2025-11-10 | true | 2025-11-13 | false |
| No due date | null | false | 2025-11-13 | false |
| Invalid date | "invalid" | false | 2025-11-13 | false (+ warning) |
| End of day boundary | 2025-11-12 | false | 2025-11-13 00:00:00 | true |
| Start of day boundary | 2025-11-13 | false | 2025-11-13 00:00:00 | false |

---

## Summary

- **No schema changes**: Existing Todo entity remains unchanged
- **Derived property**: Overdue status calculated on-demand, never stored
- **Client-side only**: All computation happens in browser
- **Performance**: O(1) per todo, suitable for expected scale
- **Error handling**: Defensive programming with console warnings
- **Testable**: Pure function with clear input/output contract
