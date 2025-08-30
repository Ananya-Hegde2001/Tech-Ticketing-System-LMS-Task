# Tech Ticketing System (PERN)

A simple tech ticketing system built with PostgreSQL, Express, React, and Node.

Features
- Login/Register with basic mocked auth (no JWT). Role is returned by backend.
- Roles: Employee, Admin, Resolver
  - Employee: create tickets and view only their own
  - Admin: view all tickets, assign resolver, set priority and deadline
- Forms use Formik + Yup validations
- Backend unit tests with Jest + Supertest

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL installed and running (you mentioned pgAdmin 4 is installed)

## Database Setup (pgAdmin 4)
1. Open pgAdmin 4 and connect to your local server.
2. Right-click Databases → Create → Database…
   - Name: `ticketing_db`
   - Owner: your Postgres user (e.g., `postgres`)
   - Save.
3. Create a dedicated user (optional but recommended):
   - Expand your server → Login/Group Roles → Right-click → Create → Login/Group Role…
   - General: Name `ticket_user`
   - Definition: Set password (e.g., `ticket_pass`)
   - Privileges: Can login = Yes
   - Save.
4. Grant privileges:
   - Open Query Tool on `ticketing_db` and run:
     ```sql
     GRANT ALL PRIVILEGES ON DATABASE ticketing_db TO ticket_user;
     ```
5. Create tables and seed data:
   - In pgAdmin Query Tool for `ticketing_db`, open and run the contents of:
     - `server/db/schema.sql`
     - `server/db/seed.sql`
   - Or run the Node seeder (after installing server deps): see "How to run" below.

## How to run

### 1) Backend (server)
- Copy `server/.env.example` to `server/.env` and update variables if needed.
- Install deps and run:

```powershell
cd "c:\Users\anany\OneDrive\ドキュメント\LMS Task\server"
npm install
npm run dev
```

Server runs on http://localhost:4000

Run tests:
```powershell
cd "c:\Users\anany\OneDrive\ドキュメント\LMS Task\server"
npm test
```

Optional: seed via Node (runs schema + seed scripts):
```powershell
npm run db:reset
```

### 2) Frontend (client)
```powershell
cd "c:\Users\anany\OneDrive\ドキュメント\LMS Task\client"
npm install
npm run dev
```

Open the printed local URL (typically http://localhost:5173).

## Demo Users (seeded)
- Admin: admin@example.com / password123
- Employee: employee1@example.com / password123
- Employee: employee2@example.com / password123
- Resolver: resolver1@example.com / password123

## Notes
- Authentication is simplified. After login, the client stores the returned user in localStorage and sends headers `x-user-id` and `x-user-role` with requests.
- Adjust CORS origin in the server if using a different frontend URL.

## Scripts
- Server: `npm run dev` (nodemon), `npm test`, `npm run db:reset` (recreate schema + seed)
- Client: `npm run dev`
