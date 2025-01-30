# 📊 Analytics Tasks Manager

This is a **task management application** with a **Kanban board** and **productivity analytics**.

## 🚀 Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS  
- **Backend**: Node.js, Express.js, Sequelize, MySQL  
- **Authentication**: JSON Web Tokens (JWT)  
- **Drag & Drop**: DnDKit  
- **Charts & Metrics**: Recharts  

## 📌 Features
- **Kanban Board**: Drag-and-drop task management  
- **Authentication**: Secure login and signup with JWT  
- **Analytics Dashboard**: Track productivity trends  
- **Responsive UI**: Styled with TailwindCSS  

## ⚙️ Installation & Setup

``sh
git clone https://github.com/your-username/analytics-tasks-manager.git
cd analytics-tasks-manager
``


## Explanation of Metrics and Technical Decisions

Below is a summary of how we approached the **analytics** and **technical** design:

1. **Metrics Computation**:
   - **Total Tasks**: The total count of tasks created by the user.  
   - **Abandoned Tasks**: Count of tasks that were logically deleted without being completed (have `deletedAt` but no `completedAt`).  
   - **Completed Tasks**: Tasks that have a `completedAt` timestamp.  
   - **Pending Tasks**: `totalTasks - completedTasks - abandonedTasks`.  
   - **Completion Rate**: Percentage of tasks completed (excluding abandoned): `(completedTasks / (totalTasks - abandonedTasks)) * 100\`.  
   - **Avg Completion Time**: The average time from `createdAt` to `completedAt` in hours or days, based on user preference.  
   - **Productivity By Day**: How many tasks are completed each day of the week (e.g., Monday, Tuesday, etc.).  
   - **Tasks by Category**: The number of tasks assigned to each category (Work, Personal, etc.).  
   - **Abandonment Rate**: `(abandonedTasks / totalTasks) * 100`.  
   - **Weekly Trends**: The number of tasks completed each of the last 6 weeks.  
   - **Predicted Time**: A naive approach to estimate how long new tasks might take (either by category or general average) based on user history.

2. **Technical Decisions**:
   - **React + DnDKit**: Provides a smooth drag-and-drop experience on the Kanban board.  
   - **Sequelize + MySQL**: Easy modeling of tasks with fields like `createdAt, completedAt, deletedAt`. Also supports flexible queries.  
   - **JWT Authentication**: Simplifies secure routes in Express. Users must include `Authorization: Bearer <token>`.  
   - **TailwindCSS**: Rapid styling with utility classes, ensuring a responsive UI.  
   - **Recharts**: Quick creation of bar, pie, and line charts for analytics.  
   - **Logical Delete**: We store `deletedAt` instead of permanently removing tasks. This helps track abandoned tasks for analytics.  
   - **Analytics**: Either computed in the frontend (for simpler logic) or delegated to the backend (for better performance and single-source-of-truth).

With these metrics and decisions, the app provides a comprehensive view of task management **and** productivity insights, while maintaining a **clean** architecture and scalable design.

