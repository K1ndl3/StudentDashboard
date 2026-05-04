# Project Structure

This repository contains the ScholarSync full-stack study productivity app. The project is split into a Spring Boot backend, a React frontend, diagram documentation, and README image assets.

## Root Files

| Path | Purpose |
|------|---------|
| `README.md` | Main project overview, setup steps, features, architecture summary, and screenshots. |
| `DYNAMIC_SIZING_TUTORIAL.md` | Notes and examples for responsive sizing used while developing the frontend. |
| `PROJECT_STRUCTURE.md` | High-level map of the repository layout. |

## Backend

Path: `backend/`

The backend is a Spring Boot application that handles authentication, Canvas calendar parsing, user context loading, task persistence, and notepad persistence.

Important areas:

| Path | Purpose |
|------|---------|
| `backend/pom.xml` | Maven configuration and backend dependencies. |
| `backend/src/main/java/com/ScholarSync/backend/BackendApplication.java` | Spring Boot entry point. |
| `backend/src/main/resources/application.properties` | Local backend configuration, including database settings. |
| `backend/src/test/` | Backend test source directory. |
| `backend/backlog.txt` | Backend notes and planned fixes. |

Main backend modules:

| Module | Purpose |
|--------|---------|
| `authentication_module/` | Registration, login, JWT handling, and Spring Security configuration. |
| `parser_module/` | Canvas calendar `.ics` link parsing and event sync endpoints. |
| `global_context_module/` | Loads and saves user dashboard state, including tasks and notepad content. |
| `model_module/` | JPA entities and repositories for users, Canvas events, tasks, and notepad data. |

## Frontend

Path: `frontEnd/studentDashboard_frontEnd/`

The frontend is a Vite React app. It provides the login/register pages, guest dashboard, protected user dashboard, task list, timer, notepad, calendar, and layout components.

Important areas:

| Path | Purpose |
|------|---------|
| `package.json` | Frontend scripts and dependencies. |
| `src/App.jsx` | Main frontend route layout. |
| `src/main.jsx` | React app entry point. |
| `src/index.css` and `src/App.css` | Global app styling. |
| `bugs_tofix.txt` | Frontend bug notes. |

Main frontend component areas:

| Path | Purpose |
|------|---------|
| `src/components/auth/` | Login and registration pages. |
| `src/components/context/` | Auth and user dashboard context providers. |
| `src/components/guest-component/` | Guest dashboard tools, including calendar, task list, timer, and notepad. |
| `src/components/user-component/` | Signed-in user dashboard features. |
| `src/components/dashboard/` | Dashboard page container. |
| `src/components/header/` and `src/components/sidebar/` | Shared navigation and layout pieces. |
| `src/components/protected-route/` | Route protection for authenticated pages. |

## Diagrams

Path: `ScholarSyncDiagrams/`

This folder stores system design diagrams in both Markdown source form and exported PNG form.

| File | Purpose |
|------|---------|
| `ScholarSyncERDiagram.md` / `.png` | Entity relationship view of the app data model. |
| `ScholarSyncClassDiagram.md` / `.png` | Class-level structure of the project. |
| `ScholarSyncSequenceDiagram.md` / `.png` | Sequence flow for major app behavior. |
| `ScholarSyncActivityDiagram.md` / `.png` | Activity flow for user interactions. |

## Assets

Path: `README_asset/`

This folder contains screenshots used by the main README:

| File | Purpose |
|------|---------|
| `login.png` | Login screen screenshot. |
| `focus-tasks.png` | Focus tasks page screenshot. |
| `calendar.png` | Calendar page screenshot. |

## Common Development Flow

Run the backend from `backend/`:

```bash
./mvnw spring-boot:run
```

Run the frontend from `frontEnd/studentDashboard_frontEnd/`:

```bash
npm install
npm run dev
```

The backend usually runs on `http://localhost:8080`, and the frontend usually runs on `http://localhost:5173`.
