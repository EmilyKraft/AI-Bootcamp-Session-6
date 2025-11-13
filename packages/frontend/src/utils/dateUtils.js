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
      console.warn(
        `Invalid due date format for todo ${todo.id}: ${todo.dueDate}`
      );
      return false;
    }

    // Set to end of day (11:59:59.999 PM)
    endOfDueDate.setHours(23, 59, 59, 999);

    // Rule 4: Overdue if current time > end of due date
    return now > endOfDueDate;
  } catch (error) {
    console.warn(
      `Error calculating overdue status for todo ${todo.id}:`,
      error
    );
    return false;
  }
}
