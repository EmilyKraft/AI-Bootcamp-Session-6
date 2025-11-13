<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Created: 2025-11-13
Rationale: Initial constitution created from existing project guidelines

Modified Principles:
- Created all 6 core principles from project documentation

Added Sections:
- Core Principles (6 principles)
- Code Quality Standards
- Development Workflow
- Governance

Templates Alignment:
✅ plan-template.md - Constitution Check section aligns with all principles
✅ spec-template.md - User scenarios and requirements align with principles
✅ tasks-template.md - Test-first workflow aligns with TDD principle

Follow-up Items:
- None - all placeholders filled with concrete values
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Documentation-First Development

Every feature MUST begin with clear, written specifications before implementation:
- Requirements documented in functional-requirements.md format
- User scenarios defined with acceptance criteria
- Design guidelines specified before UI work begins
- All decisions captured in markdown documentation

**Rationale**: Documentation-first ensures shared understanding, enables better planning, and creates a knowledge base that outlives individual developers. It prevents costly rework from misaligned expectations.

### II. Test-Driven Development (NON-NEGOTIABLE)

Testing is mandatory and follows strict TDD workflow:
- Target: 80%+ code coverage across all packages
- Tests MUST be written before or alongside implementation
- Red-Green-Refactor cycle: failing test → minimal implementation → refactor
- Three test levels: Unit tests (isolated), Integration tests (component interaction), E2E tests (future scope)
- All tests MUST pass before pull request approval

**Rationale**: TDD catches bugs early, creates living documentation, ensures code remains testable, and builds confidence in refactoring. This is non-negotiable because quality and maintainability depend on it.

### III. Code Quality & Consistency

Code MUST adhere to defined standards for maintainability:
- Follow DRY principle: extract common code into shared utilities
- Apply KISS principle: prefer simple, readable solutions over complex ones
- Implement SOLID principles: single responsibility, open/closed, dependency inversion
- Naming conventions: camelCase (variables/functions), PascalCase (components/classes), UPPER_SNAKE_CASE (constants)
- Formatting: 2-space indentation, <100 character lines, LF line endings
- All code MUST pass linting before commit

**Rationale**: Consistent, high-quality code reduces cognitive load, prevents bugs, facilitates collaboration, and makes the codebase easier to maintain and extend over time.

### IV. Simplicity & Scope Control

Features MUST remain simple and clearly scoped:
- Define "Out of Scope" explicitly in requirements
- Follow YAGNI (You Aren't Gonna Need It): only build what's needed now
- Single-user focus: no premature multi-user complexity
- Desktop-focused UI: no mobile optimization unless required
- Each component has single, well-defined responsibility

**Rationale**: Scope creep kills projects. Explicitly limiting scope and complexity ensures we deliver working software quickly and can iterate based on real feedback rather than assumptions.

### V. User-Centric Design

All features MUST serve clear user needs:
- Every feature starts with user scenarios and acceptance criteria
- UI follows established guidelines (ui-guidelines.md)
- Features are independently testable and deliverable
- User feedback is captured through acceptance scenarios
- Success criteria defined before implementation begins

**Rationale**: Building for users, not technical elegance, ensures we create value. Clear user scenarios prevent over-engineering and keep the team focused on outcomes that matter.

### VI. Monorepo Architecture & Separation of Concerns

Project structure MUST maintain clear boundaries:
- Monorepo with npm workspaces: packages/frontend, packages/backend
- Frontend: React components, services, utilities
- Backend: Express API, controllers, services
- Each package has independent tests and can be developed separately
- Shared dependencies managed at root level
- Clear API contracts between frontend and backend

**Rationale**: Separation of concerns enables parallel development, makes testing easier, prevents tight coupling, and allows different parts of the system to evolve independently.

## Code Quality Standards

All code submitted MUST meet these standards:

**Formatting**:
- 2-space indentation for all files (JS, JSON, CSS, Markdown)
- Lines kept under 100 characters where practical
- No trailing whitespace
- LF (Unix) line endings

**Organization**:
- Imports ordered: external libraries → internal modules → styles
- One blank line between import groups
- Logical grouping of related code
- Single responsibility per module/component

**Error Handling**:
- Try-catch blocks around operations that can fail
- Meaningful, actionable error messages
- User feedback when errors occur
- Errors logged appropriately

**Comments & Documentation**:
- Comment "why", not "what"
- JSDoc for public functions and components
- No outdated or obvious comments
- Clear explanations for complex logic

## Development Workflow

All development MUST follow this workflow:

1. **Specification Phase**:
   - Document feature in specs/[###-feature-name]/spec.md
   - Define user scenarios with acceptance criteria
   - Get user/stakeholder approval before proceeding

2. **Planning Phase**:
   - Create implementation plan in specs/[###-feature-name]/plan.md
   - Identify technical approach and dependencies
   - Break down into independently testable tasks

3. **Implementation Phase**:
   - Write tests first (or alongside code)
   - Implement minimal code to pass tests
   - Refactor while keeping tests green
   - Run linting and fix all errors/warnings

4. **Review Phase**:
   - All tests passing
   - Linting clean
   - Code review checklist completed
   - Atomic commits with clear messages

5. **Integration Phase**:
   - Feature branch merged after approval
   - All tests passing in integration
   - Documentation updated

**Git Practices**:
- Feature branches: `feature/[descriptive-name]`
- Atomic commits: one logical change per commit
- Commit messages: `type: description` (e.g., `feat: add todo editing`)
- Pull requests required for all changes

## Governance

**Constitutional Authority**:
- This constitution supersedes all other development practices
- All pull requests MUST verify compliance with core principles
- Violations require explicit justification and approval

**Amendment Process**:
- Amendments require documentation of rationale
- Major changes (new/removed principles): MAJOR version bump
- New sections or expanded guidance: MINOR version bump
- Clarifications and fixes: PATCH version bump
- All amendments documented in sync impact report

**Compliance Review**:
- Code reviews MUST check adherence to principles
- Testing coverage monitored and enforced
- Linting enforced via pre-commit validation
- Documentation completeness verified before merge

**Living Documentation**:
- Guidelines updated as patterns emerge
- Team feedback incorporated into process improvements
- Regular review of constitution effectiveness
- Refer to docs/ folder for detailed implementation guidance

**Version**: 1.0.0 | **Ratified**: 2025-11-13 | **Last Amended**: 2025-11-13
