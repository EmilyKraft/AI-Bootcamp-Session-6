---
description: "Task list for Overdue Todo Items Visual Indicator feature"
---

# Tasks: Overdue Todo Items Visual Indicator

**Input**: Design documents from `/workspaces/AI-Bootcamp-Session-6/specs/001-overdue-todos/`  
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), contracts/ (complete), quickstart.md (complete)

**Tests**: Per Constitution Principle II (Test-Driven Development), tests are MANDATORY and must be written FIRST before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (monorepo)**: `packages/frontend/src/`, `packages/backend/src/`
- This feature: Frontend-only changes in `packages/frontend/`
- All paths are absolute from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure for date utilities

- [ ] T001 Create utils directory at packages/frontend/src/utils/
- [ ] T002 Create test directory at packages/frontend/src/utils/__tests__/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core date utility that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Write unit tests for isOverdue function in packages/frontend/src/utils/__tests__/dateUtils.test.js (TDD: write first, ensure FAIL)
- [ ] T004 Implement isOverdue utility function in packages/frontend/src/utils/dateUtils.js (TDD: implement to make tests PASS)
- [ ] T005 Verify all dateUtils tests pass with npm test -- dateUtils.test.js

**Checkpoint**: Foundation ready - isOverdue utility tested and working. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Visual Identification of Overdue Todos (Priority: P1) 🎯 MVP

**Goal**: Users can immediately see which incomplete tasks are overdue through visual styling (color + icon), allowing them to quickly identify tasks that require immediate attention without manually comparing due dates to today's date.

**Independent Test**: Create todos with past due dates and verify they display with distinct visual styling (red text, warning icon) while future-dated and completed todos do not.

**Acceptance Criteria**:
1. Incomplete todo with due date of yesterday displays with overdue visual styling
2. Incomplete todo with due date of today does NOT display with overdue styling
3. Incomplete todo with due date in future does NOT display with overdue styling
4. Completed todo with due date in past does NOT display with overdue styling
5. Multiple overdue todos display with consistent overdue visual styling

### Tests for User Story 1 (MANDATORY) ✅

> **TDD REQUIRED: Write these tests FIRST, ensure they FAIL before implementation**
> Per Constitution Principle II, all features require test coverage before implementation.

- [ ] T006 [P] [US1] Write TodoCard overdue styling tests in packages/frontend/src/components/__tests__/TodoCard.test.js (TDD: test overdue visual indicators, ensure FAIL)
- [ ] T007 [P] [US1] Write TodoList overdue integration tests in packages/frontend/src/components/__tests__/TodoList.test.js (TDD: test multiple overdue todos, ensure FAIL)

### Implementation for User Story 1

- [ ] T008 [US1] Add overdue color variables and icon styles to packages/frontend/src/styles/theme.css
- [ ] T009 [US1] Update TodoCard component to import and use isOverdue utility in packages/frontend/src/components/TodoCard.js
- [ ] T010 [US1] Add conditional CSS classes for overdue styling in packages/frontend/src/components/TodoCard.js
- [ ] T011 [US1] Add warning icon element for overdue todos in packages/frontend/src/components/TodoCard.js
- [ ] T012 [US1] Ensure WCAG AA color contrast (4.5:1 minimum) in packages/frontend/src/styles/theme.css
- [ ] T013 [US1] Verify TodoCard tests pass with npm test -- TodoCard.test.js
- [ ] T014 [US1] Verify TodoList integration tests pass with npm test -- TodoList.test.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Overdue todos display with red color and warning icon. Manually test by creating todos with past due dates in the running app (http://localhost:3000).

---

## Phase 4: User Story 2 - Overdue Status Updates in Real-Time (Priority: P2)

**Goal**: Users who have the todo list open see todos automatically update to overdue styling when their due date passes (e.g., when midnight occurs), without needing to refresh the page.

**Independent Test**: Have a todo due at a specific time/date, keep the app open, and verify it changes to overdue styling at the appropriate moment (can simulate by mocking timers).

**Acceptance Criteria**:
1. Todo due today at 3:00 PM automatically displays with overdue styling when time reaches 3:01 PM without page refresh
2. Multiple todos with different due dates/times each update to overdue styling at the correct moment
3. System recalculates overdue status on user interaction if timer fails

### Tests for User Story 2 (MANDATORY) ✅

> **TDD REQUIRED: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US2] Write TodoCard real-time update tests with mock timers in packages/frontend/src/components/__tests__/TodoCard.test.js (TDD: test midnight boundary, ensure FAIL)
- [ ] T016 [P] [US2] Write TodoList periodic update tests in packages/frontend/src/components/__tests__/TodoList.test.js (TDD: test setInterval behavior, ensure FAIL)

### Implementation for User Story 2

- [ ] T017 [US2] Add useEffect hook with setInterval for periodic overdue checks in packages/frontend/src/components/TodoList.js
- [ ] T018 [US2] Implement midnight boundary detection logic in packages/frontend/src/components/TodoList.js
- [ ] T019 [US2] Add event listeners for user interactions (click, keypress, focus) to trigger recalculation in packages/frontend/src/components/TodoList.js
- [ ] T020 [US2] Add cleanup logic for interval and event listeners in useEffect return in packages/frontend/src/components/TodoList.js
- [ ] T021 [US2] Add console warnings for edge cases (invalid dates, calculation errors) in packages/frontend/src/utils/dateUtils.js
- [ ] T022 [US2] Verify real-time update tests pass with npm test -- TodoCard.test.js TodoList.test.js

**Checkpoint**: All user stories should now be independently functional. Todos automatically update to overdue when their due date passes. Test by setting system time or waiting for midnight boundary.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T023 [P] Run full test suite and verify 80%+ coverage with npm test -- --coverage
- [ ] T024 [P] Run ESLint and fix any warnings with npm run lint (if available) in packages/frontend/
- [ ] T025 Manual accessibility audit: verify color contrast meets WCAG AA (4.5:1) using browser DevTools
- [ ] T026 Manual performance test: create 500+ todos and verify overdue calculation completes within 500ms
- [ ] T027 Code review: verify all files follow 2-space indentation and <100 character line length
- [ ] T028 Update documentation if needed in docs/ (only if project documentation requires feature notes)
- [ ] T029 Verify quickstart.md scenarios work end-to-end by following the guide

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (US1) can start after Phase 2
  - User Story 2 (US2) depends on User Story 1 completion (uses same components)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (isOverdue utility) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (modifies same TodoCard/TodoList components) - Must complete US1 first

### Within Each User Story

1. Tests MUST be written first and FAIL before implementation (TDD)
2. Styles before component modifications
3. Component logic before integration
4. Verify tests PASS after implementation
5. Manual testing before moving to next story

### Parallel Opportunities

- **Phase 1 (Setup)**: T001 and T002 can run in parallel (different directories)
- **Phase 2 (Foundational)**: T003 and T004 must be sequential (TDD flow)
- **User Story 1 Tests**: T006 and T007 can run in parallel (different test files)
- **User Story 2 Tests**: T015 and T016 can run in parallel (different test files)
- **Polish Phase**: T023, T024, T025, T026, T027 can all run in parallel (independent checks)

---

## Parallel Example: User Story 1

```bash
# Step 1: Write both test files in parallel
Terminal A: Work on packages/frontend/src/components/__tests__/TodoCard.test.js
Terminal B: Work on packages/frontend/src/components/__tests__/TodoList.test.js

# Step 2: Implement changes sequentially (same files)
Work on packages/frontend/src/styles/theme.css
Work on packages/frontend/src/components/TodoCard.js (multiple tasks T009-T011)

# Step 3: Verify both test files in parallel
npm test -- TodoCard.test.js
npm test -- TodoList.test.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup (T001-T002)
2. ✅ Complete Phase 2: Foundational (T003-T005) - CRITICAL
3. ✅ Complete Phase 3: User Story 1 (T006-T014)
4. **STOP and VALIDATE**: 
   - Run tests: `npm test -- TodoCard.test.js TodoList.test.js`
   - Manual test: Start app, create todos with past dates, verify red styling + icon
   - Check accessibility: Verify color contrast in DevTools
5. Deploy/demo if ready - Users can now see overdue todos at a glance

### Incremental Delivery

1. **Setup + Foundational (T001-T005)** → Foundation ready
2. **Add User Story 1 (T006-T014)** → Test independently → Deploy/Demo (MVP! Core value delivered)
3. **Add User Story 2 (T015-T022)** → Test independently → Deploy/Demo (Enhanced UX with real-time updates)
4. **Polish (T023-T029)** → Final validation → Production ready

Each story adds value without breaking previous stories.

### Single Developer Strategy

1. Complete tasks in strict order: T001 → T002 → T003 → ... → T029
2. Follow TDD: Write test, watch it fail, implement, watch it pass
3. Commit after each completed task or logical group
4. Stop at checkpoints to validate story independently
5. Estimated timeline:
   - Phase 1: 15 minutes
   - Phase 2: 1-2 hours (includes comprehensive tests)
   - Phase 3 (US1): 3-4 hours (includes tests, styling, component updates)
   - Phase 4 (US2): 2-3 hours (includes timer logic and tests)
   - Phase 5: 1 hour (validation and polish)
   - **Total: 7.5-10.5 hours**

### Parallel Team Strategy

Not recommended for this feature due to small scope and component overlap. If needed:

1. **Developer A**: Complete Setup + Foundational (T001-T005)
2. **Developer A**: Complete User Story 1 (T006-T014)
3. **Developer A or B**: Complete User Story 2 (T015-T022) - depends on US1
4. **Both**: Polish tasks in parallel (T023-T029)

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **TDD enforced**: All test tasks (T003, T006, T007, T015, T016) MUST be completed and failing before implementation tasks
- **File paths**: All paths are absolute from repository root
- **No backend changes**: All tasks are in packages/frontend/ only
- **Constitution compliance**: 
  - ✅ Documentation-First: All design docs complete before tasks
  - ✅ TDD: Tests written first for all features
  - ✅ Code Quality: ESLint check included (T024)
  - ✅ Simplicity: Frontend-only, no complexity
  - ✅ User-Centric: Accessibility validation (T025)
  - ✅ Architecture: Monorepo structure maintained

**Verification checklist before considering complete**:
- [ ] All tests pass (npm test)
- [ ] Coverage ≥80% (npm test -- --coverage)
- [ ] No ESLint warnings
- [ ] WCAG AA color contrast verified (4.5:1 minimum)
- [ ] Performance: 500 todos render with overdue check in <500ms
- [ ] Manual test: Overdue todos show red + icon
- [ ] Manual test: Completed todos never show overdue styling
- [ ] Manual test: Real-time update works (or recalculates on interaction)
- [ ] quickstart.md scenarios validated

---

**Generated**: 2025-11-13  
**Feature Branch**: 001-overdue-todos  
**Total Tasks**: 29  
**User Stories**: 2 (US1: Visual Identification, US2: Real-Time Updates)
