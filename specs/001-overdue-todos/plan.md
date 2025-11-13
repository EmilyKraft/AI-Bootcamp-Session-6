# Implementation Plan: Overdue Todo Items Visual Indicator

**Branch**: `001-overdue-todos` | **Date**: 2025-11-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add visual indicators (color + icon) to incomplete todos that are past their due date. The system will calculate overdue status client-side by comparing current date/time against todo due dates (end-of-day logic). Visual styling must meet WCAG AA accessibility standards and update dynamically when todo status changes. Real-time updates with graceful degradation on interaction events. No backend changes required - purely frontend enhancement to existing todo display logic.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18.2.0  
**Primary Dependencies**: React, React-DOM, existing axios for API calls  
**Storage**: N/A (uses existing backend todo storage, no schema changes)  
**Testing**: Jest with React Testing Library (react-scripts test framework)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - desktop-focused)  
**Project Type**: Web application (monorepo: packages/frontend + packages/backend)  
**Performance Goals**: <500ms visual update response time, handle 500+ todos efficiently  
**Constraints**: WCAG AA color contrast (4.5:1 minimum), client-side only, no backend modifications  
**Scale/Scope**: Single-user desktop application, expected <1000 todos per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [Constitution](../../.specify/memory/constitution.md):

- [x] **Documentation-First**: Feature spec written and approved before planning? ✅ spec.md complete with clarifications
- [x] **Test-Driven Development**: Testing strategy defined (unit/integration)? ✅ React Testing Library, Jest, 80%+ coverage target
- [x] **Code Quality**: Linting rules and formatting standards identified? ✅ ESLint (react-app), 2-space indent, <100 char lines
- [x] **Simplicity & Scope**: "Out of Scope" explicitly defined? ✅ 8 items listed (notifications, filtering, backend changes, etc.)
- [x] **User-Centric**: User scenarios with acceptance criteria documented? ✅ 2 user stories with 7 acceptance scenarios
- [x] **Architecture**: Frontend/Backend separation maintained per monorepo structure? ✅ Frontend-only changes, no backend modifications

*All checks must pass to proceed with implementation.*

**Gate Status**: ✅ PASS - All constitutional requirements met

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── spec.md              # Feature specification
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js          # MODIFY: Add overdue visual indicators
│   │   ├── TodoList.js          # MODIFY: Pass overdue check utility
│   │   └── __tests__/
│   │       ├── TodoCard.test.js # MODIFY: Add overdue styling tests
│   │       └── TodoList.test.js # MODIFY: Add overdue tests
│   ├── utils/                   # NEW: Create utils directory
│   │   ├── dateUtils.js         # NEW: Overdue calculation logic
│   │   └── __tests__/
│   │       └── dateUtils.test.js # NEW: Date utility tests
│   ├── styles/
│   │   └── theme.css            # MODIFY: Add overdue color/icon styles
│   └── App.js                   # NO CHANGE: Uses existing components
└── tests/                        # Existing test structure

packages/backend/
└── [NO CHANGES REQUIRED]        # Backend unchanged - frontend-only feature
```

**Structure Decision**: This is a web application using the monorepo structure. Changes are isolated to the frontend package only, specifically the TodoCard and TodoList components. A new utils directory will be created for date comparison logic to maintain separation of concerns. No backend modifications needed since overdue status is calculated client-side and not persisted.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
