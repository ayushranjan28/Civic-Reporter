## Civic Reporter Monorepo

Apps and packages:
- apps/api: Node.js + Express + Prisma API
- apps/admin: Next.js admin portal
- apps/mobile: Expo React Native app
- packages/shared: Shared TypeScript types

### Quick start
1) Node 18+ and npm 9+ required.
2) Install deps: `npm install`
3) API env: copy `apps/api/.env.example` to `apps/api/.env` and set `DATABASE_URL`.
4) Start API: `npm run dev:api` (http://localhost:4000)
5) Start Admin: `npm run dev:admin` (http://localhost:3000)
6) Start Mobile: `npm run dev:mobile` and use Expo Go or emulator.

### API routes (initial)
- POST /auth/register
- GET /reports
- POST /reports (multipart form-data: media)
- PATCH /reports/:id/status
- POST /assignments

### Data models
- User(id, email, passwordHash, name, role)
- Department(id, name, categories[])
- Report(id, citizenId, title, description, category, status, lat/lng, mediaUrl)
- TaskAssignment(id, reportId, departmentId, assigneeId?, priority, notes)

### Suggested libraries
- Maps: Mapbox GL / Leaflet (web), react-native-maps (mobile)
- Notifications: Firebase Cloud Messaging
- Voice-to-text: Platform APIs or react-native-voice; Web Speech API (web)
- Storage: AWS S3 or GCP Storage (replace local uploads)


