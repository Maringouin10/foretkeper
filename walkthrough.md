# Forest Keeper App - Walkthrough

## Overview
The Forest Keeper App allows users to report fallen trees by clicking on a map. Administrators can view these reports and mark them as resolved.

## Features
- **Interactive Map**: Users can click anywhere on the forest map to drop a pin.
- **Reporting System**: Simple form to add a description to the report.
- **Admin Dashboard**: Protected area to view all active reports.
- **Management**: Admins can delete reports once the tree is removed.

## How to Run
1. Open a terminal in the project directory.
2. Run `npm run dev`.
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Guide

### Public Reporting (Home Page)
1. Click the **"Signaler un arbre tombé"** button in the header.
2. The page will scroll to the map.
3. Click on the map where the tree is located.
4. A form will appear **below the map**.
5. Enter a description and click "Envoyer le signalement".
5. Enter a description (optional) in the form that pops up.
6. Click "Envoyer".
7. A success message will confirm the report.

### Admin Dashboard
1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).
2. Enter the password: `admin123`.
3. You will see the map with all reports and trails.
4. Click on a marker to see details.
5. Click "Cliquez pour supprimer" to remove the report.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: SQLite
- **ORM**: Prisma
