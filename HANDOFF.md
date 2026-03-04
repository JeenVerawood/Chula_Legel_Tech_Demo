# PACTA — Backend Developer Handoff Guide

> **ระบบจัดการประชุมทางกฎหมาย** (Legal Meeting Management System)
> Prepared for CP Group / Chula Legal Tech

---

## 1. Quick Start

```bash
npm install       # or: bun install
npm run dev       # starts at http://localhost:3000
```

**Stack:** Next.js 16.1 · React 19 · TypeScript 5 · Tailwind CSS v4 · Framer Motion

---

## 2. Project Structure

```
Chula_Legel_Tech/
├── app/
│   ├── layout.tsx              # Root layout — renders Navbar + {children}
│   ├── page.tsx                # "/" — Live Meeting broadcast page
│   ├── globals.css             # Full design system (1400 lines, CSS vars)
│   │
│   ├── components/
│   │   ├── Navbar.tsx          # Top nav — dropdown page switcher + "New Meeting"
│   │   ├── MeetingCard.tsx     # Compact meeting card (left panel on "/")
│   │   ├── MeetingDetails.tsx  # Full detail panel (right panel on "/", with waveform)
│   │   ├── CalendarView.tsx    # Calendar widget on /dashboard
│   │   ├── MeetingSummaryCard.tsx # Card variant for /summary page
│   │   └── CreateMeetingForm.tsx  # 13-field form on /create-meeting
│   │
│   ├── create-meeting/
│   │   └── page.tsx            # Just renders <CreateMeetingForm />
│   │
│   ├── dashboard/
│   │   └── page.tsx            # Overview page — calendar + upcoming meetings
│   │
│   ├── summary/
│   │   └── page.tsx            # Past meetings grid
│   │
│   └── types/
│       ├── index.ts            # Barrel export
│       └── meeting.ts          # ★ ALL shared TypeScript types & data contracts
│
├── public/                     # Static assets (SVGs)
├── package.json
└── tsconfig.json
```

---

## 3. Current State

| Area | Status | Notes |
|---|---|---|
| Pages & routing | ✅ Done | 4 routes working |
| Components | ✅ Done | 6 components, all rendered |
| Design system | ✅ Done | CSS vars, spacing, shadows, all in `globals.css` |
| Animations | ✅ Done | Framer Motion on all transitions |
| TypeScript types | ✅ Done | `app/types/meeting.ts` — shared contracts |
| API routes | ❌ Not started | No `app/api/` directory exists yet |
| Data fetching | ❌ Not started | All data is hardcoded mock constants |
| Auth | ❌ Not started | No user/session management |
| State management | ⚠️ Local only | `useState` per component, no global store |
| Database | ❌ Not started | No Supabase/Prisma integration |
| Env config | ❌ Not started | No `.env` file |

---

## 4. Data Contracts

All TypeScript types live in **`app/types/meeting.ts`**. Key types the backend must implement:

### `MeetingCard` — used in listings
```ts
interface MeetingCard {
  id: string;
  title: string;
  company: string;
  type: MeetingType;
  no: string;
  date: string;
  time: string;
  location: string;
  tags: TagColor[];
  status: MeetingStatus;
  isLive?: boolean;
  attendees?: number;
}
```

### `MeetingDetail` — extends `MeetingCard`
```ts
interface MeetingDetail extends MeetingCard {
  agendas: Agenda[];
  resolution?: string;
}
```

### `CreateMeetingPayload` — form submission body
```ts
interface CreateMeetingPayload {
  companyType: CompanyType;
  meetingType: MeetingType;
  meetingSubType: MeetingSubType;
  callerName: string;
  subject: string;
  meetingNo: string;
  attendees: string;
  location: string;
  meetingDate: string;
  dateSent: string;
  agendas: string[];
  signerName: string;
  signerPosition: string;
  signatureDataUrl: string;  // base64 PNG from canvas
}
```

### `ApiResponse<T>` — standardized wrapper
```ts
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
```

---

## 5. API Routes to Implement

These are the endpoints the frontend expects. Create them under `app/api/`.

| Method | Route | Request Body | Response | Used By |
|---|---|---|---|---|
| `GET` | `/api/meetings` | — | `ApiResponse<MeetingCard[]>` | `page.tsx`, `dashboard/page.tsx`, `summary/page.tsx` |
| `GET` | `/api/meetings/[id]` | — | `ApiResponse<MeetingDetail>` | `page.tsx` (live meeting detail) |
| `POST` | `/api/meetings` | `CreateMeetingPayload` | `ApiResponse<CreateMeetingResponse>` | `CreateMeetingForm.tsx` |
| `GET` | `/api/meetings/live` | — | `ApiResponse<MeetingDetail | null>` | `page.tsx` (live broadcast) |
| `GET` | `/api/calendar-events` | `?month=2&year=2569` | `ApiResponse<CalendarEvent[]>` | `CalendarView.tsx` |

---

## 6. Where to Wire Up Data

Each page currently has **hardcoded mock data** at the top of the file. Here's where to replace them:

### `app/page.tsx` (Live Meeting)
- **Lines 7–17:** `liveMeeting` — replace with `GET /api/meetings/live`
- **Lines 19–53:** `meetingDetails` — replace with `GET /api/meetings/[id]`

### `app/dashboard/page.tsx`
- **Lines 7–31:** `upcomingMeetings` — replace with `GET /api/meetings?status=upcoming`
- **Lines 34–38:** `calendarEvents` — replace with `GET /api/calendar-events`

### `app/summary/page.tsx`
- **Lines 8–39:** `meetingItems` — replace with `GET /api/meetings?status=completed`

### `app/components/CreateMeetingForm.tsx`
- **Line 140:** `handleSave()` currently returns early after validation. This is the hook point for `POST /api/meetings`. The signature image can be extracted via: `sigCanvas.current?.toDataURL("image/png")`

---

## 7. Suggested `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# App config
NEXT_PUBLIC_APP_NAME=PACTA
```

---

## 8. Known Decisions & Edge Cases

1. **Thai Buddhist calendar** — all dates display in พ.ศ. format (year + 543). The `CalendarView` component already handles this conversion. Backend should store dates in standard ISO-8601 and let the frontend format them.

2. **Signature capture** — uses `react-signature-canvas`. The form collects a base64 PNG data URL. Backend should store this as a file (e.g., in Supabase Storage) and keep only the URL reference in the database.

3. **Meeting invitation date rule** — the create form has a hint: "ต้องส่งไม่น้อยกว่า 7 วัน ก่อนวันประชุม (14 วันถ้ามติพิเศษ)". This is currently a visual hint only — **backend should validate this constraint**.

4. **Tag colors** — `red`, `yellow`, `green`, `blue` are the only supported values. Both `MeetingCard` and `MeetingSummaryCard` map them to the same hex values.

5. **Waveform visualization** — purely decorative (canvas animation). No audio/data is needed from the backend.

6. **Dropdown options** — company types, meeting types, and sub-types are hardcoded in `CreateMeetingForm.tsx` (lines 20–22). If these need to be configurable, create an enum endpoint or move them to a shared config.

---

## 9. Component Prop Reference

| Component | Props | Source |
|---|---|---|
| `Navbar` | none | Self-contained, uses `usePathname()` |
| `MeetingCard` | `meeting: MeetingCard, isSelected?, onClick?` | parent page |
| `MeetingDetails` | `meeting: MeetingDetail` | parent page |
| `CalendarView` | `events: CalendarEvent[], onDateSelect?` | dashboard page |
| `MeetingSummaryCard` | `meeting: MeetingCard, index: number` | summary page |
| `CreateMeetingForm` | none | Self-contained form |

---

## 10. Recommended Next Steps (Priority Order)

1. **Set up Supabase project** — create `meetings` table matching `MeetingDetail` schema
2. **Create `POST /api/meetings`** — wire up `CreateMeetingForm.handleSave()`  
3. **Create `GET /api/meetings`** — replace all hardcoded arrays
4. **Add auth** — Supabase Auth or custom, gate meeting creation
5. **Add real-time** — Supabase Realtime for the live meeting broadcast
6. **File storage** — Supabase Storage for signature images
7. **PDF generation** — generate the formal invitation document (หนังสือเชิญประชุม)

---

*Last updated: March 2026 — Frontend handoff by Thirat*
