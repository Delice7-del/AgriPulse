# AgriPulse

Real-time agricultural market intelligence for smallholder farmers in Rwanda — accessible on any mobile phone via USSD, no smartphone or internet required.

## What it does

AgriPulse helps farmers make better selling decisions by putting two things in their hands, right from a basic phone:

- **Live market prices** — dial in and check today's price for a crop across nearby markets
- **AI-powered selling advice** — a short-term prediction telling the farmer whether to *sell now* or *wait*, based on recent price trends

Agricultural officers manage the underlying data and monitor usage through a web-based admin dashboard.

## How farmers use it

No app to install. Farmers dial a USSD shortcode from any phone (feature phone or smartphone), navigate a simple text menu, and get their answer in a few seconds — in Kinyarwanda or English.

```
1. Check Prices
2. AI Advice
3. Language
```

## Who it's for

| User | How they interact |
|---|---|
| Smallholder farmers | USSD menu on any phone |
| Farmer cooperatives / traders | USSD menu |
| Agricultural officers | Web admin dashboard — manage crops, markets, and daily prices |
| System administrators | Dashboard advanced views, backend tooling |

## System overview

AgriPulse has four main pieces:

1. **USSD gateway integration** — receives farmer input via a telecom/USSD aggregator and returns menu responses
2. **Backend API** — core business logic: price data, session handling, prediction requests, admin operations
3. **AI prediction service** — analyzes recent price history for a crop/market and returns a sell-now/wait recommendation
4. **Admin dashboard** — web interface for officers to manage crops, markets, prices, and view usage analytics

## Tech stack

- **Backend**: NestJS, PostgreSQL, Prisma ORM
- **Frontend (admin dashboard + landing page)**: React
- **USSD delivery**: telecom USSD aggregator (e.g. Africa's Talking) integration
- **AI**: time-series based short-term price trend prediction

## Project structure

```
agripulse/
├── backend/          # NestJS API, Prisma schema, USSD + AI logic
├── dashboard/         # Admin web dashboard
├── landing/           # Public landing page
└── docs/              # SRS and supporting documentation
```

## Getting started

### Prerequisites
- Node.js (LTS)
- PostgreSQL
- npm or yarn

### Setup

```bash
# clone the repo
git clone https://github.com/<your-org>/agripulse.git
cd agripulse

# install dependencies
npm install

# copy the example environment file and fill in your own values
cp .env.example .env
```

Environment variables you'll need to provide in your own `.env` (see `.env.example` for the full list — no real values are committed to this repo):

- Database connection string
- JWT secret for admin authentication
- USSD aggregator credentials (obtained from your aggregator's dashboard)

### Running locally

```bash
# run database migrations
npx prisma migrate dev

# start the backend
npm run start:dev

# start the dashboard (in a separate terminal, from the dashboard directory)
npm run dev
```

API documentation is available at `/api/docs` (Swagger) once the backend is running.

## Testing

- Unit tests: `npm run test`
- Before connecting to a real telecom shortcode, the USSD flow should be tested against your aggregator's sandbox/simulator environment first
- The AI prediction logic should be backtested against historical data before relying on it in a pilot with real users

See `docs/` for the full testing and rollout plan.

## Project scope

**In scope for the current prototype:**
- USSD menu covering at least 3 crops across 2 markets
- AI-generated sell/wait advice based on historical trends
- Admin dashboard for price updates and basic analytics

**Out of scope for now:**
- Mobile money integration
- Weather or crop disease alerts
- A dedicated smartphone app
- Large-scale multi-region deployment

## Team

- UWUMUGISHA Heloise Rugie — CEO
- KEZA Delice — CFO
- WIHOGORA Florissa — CMO
- RUKUNDO IGIHOZO Benise — COO

## License

TBD
