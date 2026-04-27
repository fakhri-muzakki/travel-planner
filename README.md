# Travel Planner ✈️

Travel Planner is an AI-powered web application that helps users create personalized travel itineraries quickly and easily. Simply enter your destination, travel dates, budget, traveler count, interests, dietary preferences, and travel pace — then the app generates a realistic day-by-day travel plan complete with activities, food recommendations, and budget estimates.

---

## ✨ Features

- ✅ Trip input form (destination, dates, travelers, budget, style, pace)
- ✅ AI-generated day-by-day itinerary (1–7 days)
- ✅ Daily planning: morning, afternoon, lunch, dinner, optional evening
- ✅ Activity details (name, duration, estimated cost)
- ✅ Budget breakdown:
  - Accommodation
  - Food
  - Activities
  - Transport
  - Miscellaneous
- ✅ Budget comparison (estimated vs user budget)
- ✅ Customize preferences:
  - Interests
  - Dietary preferences
  - Travel pace
- ✅ Edit itinerary:
  - Add activity
  - Edit activity
  - Remove activity
  - Drag & drop reorder activity
- ✅ Regenerate specific day with AI
- ✅ Save itinerary to database
- ✅ Shareable read-only trip link
- ✅ Export itinerary as printable PDF
- ✅ Fully responsive for mobile & desktop

---

## 🛠 Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- React Hook Form
- Valibot

### Backend / Services

- Next.js App Router API Routes
- Supabase (Database + Auth)
- Google Gemini AI (`@ai-sdk/google`)
- Vercel AI SDK

### UI / UX

- Radix UI
- Lucide Icons
- React Hot Toast
- React Day Picker

### Extra Features

- Drag & Drop: `@dnd-kit`
- PDF Export: `@react-pdf/renderer`

---

## 📸 Main Use Case

1. User fills trip form
2. AI generates personalized itinerary
3. User edits activities if needed
4. User saves trip
5. User shares trip link or exports PDF

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/your-username/travel-planner.git
cd travel-planner
```
