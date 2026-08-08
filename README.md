# Loan Eligibility & Lead Management System

Internal loan-officer platform for MoneyBeing Pvt Ltd: customers (or officers on their
behalf) submit loan applications, the system fetches a credit score, runs a fully
database-driven Business Rule Engine (BRE), and stores the resulting lead with its
eligibility outcome. Admins manage leads, dashboard KPIs, and BRE rules through a
JWT-authenticated Next.js console.

## Tech Stack

**Backend**
- Django 5 + Django REST Framework
- PostgreSQL
- JWT auth via `djangorestframework-simplejwt`
- `django-filter` for lead search/filtering
- `openpyxl` for the leads Excel export
- `drf-yasg` for Swagger docs

**Frontend**
- Next.js 16 (App Router) + Tailwind CSS v4
- React Hook Form + Zod for form validation
- Axios (loan application submission) and a fetch wrapper (admin console)
- Recharts (dashboard charts) + Lucide React (icons)

## Project Structure

```
├── apps/                    # Django apps
│   ├── core/                 # base model, permissions, pagination, exceptions
│   ├── accounts/              # AdminUser model, JWT login/refresh/logout, RBAC
│   ├── credit_score/           # CreditScoreService + provider abstraction (Mock/CRIF)
│   ├── bre/                     # BusinessRule model, BREEngine, rule CRUD API
│   ├── leads/                    # Lead model, LeadCreationService, list/detail/export API
│   └── dashboard/                 # aggregated stats endpoint
├── config/                  # Django project settings (base/development/production)
├── frontend/                # Next.js admin console + public application form
│   ├── app/                  # pages (admin/dashboard, admin/leads, admin/bre-rules, ...)
│   ├── components/            # feature-organized React components
│   └── lib/                    # API clients, Zod schemas, shared utilities
├── requirements.txt
└── manage.py
```

## Business Rule Engine — rules are data, not code

Every eligibility rule (age, income, credit score, loan-to-property ratio, etc.) is a row
in the `bre_businessrule` table — never hardcoded. `BREEngine` (`apps/bre/engine.py`) reads
active rules fresh from PostgreSQL on every lead evaluation, so adding, editing, or
disabling a rule via the admin console (or the API) takes effect on the *next* submission
with zero code changes or redeploys. Every rule evaluation (pass or fail) is written to
`RuleEvaluationLog` for audit purposes.

## Credit Score integration — how the mock score is configured

There is no genuine free/public credit bureau API — CRIF, CIBIL, Equifax, and Experian all
require a paid bureau-membership agreement (confirmed by testing an actual CRIF endpoint
listed in a partner platform's own API catalog: it doesn't resolve in DNS, and its
credentials are Stripe-style placeholder values, not real secrets). `CreditScoreService`
(`apps/credit_score/`) is built behind a provider interface so switching to a real bureau
later is a config change, not a rewrite:

```
CreditScoreService → CRIFProvider (real integration shape, unwired — no live sandbox credential exists)
                   → MockCreditScoreProvider (active default)
```

**How the mock score is generated** (`apps/credit_score/providers/mock_provider.py`):

- The score is **deterministic per applicant, not random per request**. It seeds Python's
  `random.Random` with the applicant's **mobile number** as the seed, then draws one integer
  in the range **300–900**.
- This means the *same mobile number always produces the same score*, on every submission,
  forever — it is not re-rolled on retry. Two different mobile numbers almost always produce
  two different scores.
- This is intentional, not a bug: it makes the demo reproducible (you can predict/reuse a
  known "Eligible" or "Not Eligible" test number) without needing a real bureau.
- Example (from testing): mobile `9876543210` → score `608` (fails the BRE's `credit_score >=
  700` rule → Not Eligible). Mobile `9800000001` → score `865` (passes → Eligible, assuming
  other rules also pass).
- Switch providers via `.env`: `CREDIT_SCORE_PROVIDER=mock|crif`. If the primary provider
  throws (e.g. a real CRIF call times out), `CreditScoreService` automatically falls back to
  the mock provider so lead creation never hard-fails on a bureau outage. Every fetch attempt
  — mock or real, success or failure — is logged to `CreditScoreRecord` for audit.

## Backend Setup

Requires Python 3.12+ and PostgreSQL 16+.

```bash
cd Loan_Lead_Management
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt

cp .env.example .env
# edit .env: set SECRET_KEY, DATABASE_* to match your local Postgres
```

Create the database and a dedicated app role (adjust password):

```sql
CREATE ROLE loan_app_user LOGIN PASSWORD 'your-password';
CREATE DATABASE loan_lead_management OWNER loan_app_user;
```

```bash
python manage.py migrate
python manage.py seed_bre_rules        # seeds the 5 rules from the assessment spec

python manage.py createsuperuser       # create your first admin
# then, in the Django shell, promote them if you need delete access to BRE rules:
#   python manage.py shell
#   >>> from apps.accounts.models import AdminUser
#   >>> u = AdminUser.objects.get(username="<your-username>")
#   >>> u.role = "SUPER_ADMIN"; u.save()

python manage.py runserver 127.0.0.1:8000
```

- API base URL: `http://127.0.0.1:8000/api`
- Swagger docs: `http://127.0.0.1:8000/api/docs/`
- Django admin: `http://127.0.0.1:8000/admin/`

## Frontend Setup

Requires Node.js 20+.

```bash
cd Loan_Lead_Management/frontend
npm install

# .env.local already points at the local backend by default:
# NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api

npm run dev
```

- App: `http://localhost:3000` (redirects into `/admin/login`)
- Log in with the superuser you created above.

## Core API Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/login/` | Public | Admin login → JWT access + refresh |
| `POST` | `/api/auth/refresh/` | Public | Refresh access token |
| `POST` | `/api/auth/logout/` | JWT | Blacklist refresh token |
| `POST` | `/api/leads/` | Public (throttled) | Submit application → credit score → BRE → store lead |
| `GET` | `/api/leads/list/` | JWT | List leads — search, filter, pagination |
| `GET` | `/api/leads/{id}/` | JWT | Lead detail incl. BRE reasons + credit score history |
| `GET` | `/api/leads/export/` | JWT | Export all leads to `.xlsx` |
| `GET` | `/api/dashboard/stats/` | JWT | Total / eligible / rejected leads, avg credit score |
| `GET/POST` | `/api/bre/rules/` | JWT | List / create BRE rules |
| `PATCH/DELETE` | `/api/bre/rules/{id}/` | JWT (delete requires `SUPER_ADMIN`) | Edit / delete a rule |

`POST /api/leads/` response:
```json
{ "status": "success", "lead_id": 101, "credit_score": 742, "bre_status": "Eligible", "reasons": [] }
```
Duplicate mobile number → `409` `{ "status": "error", "message": "Lead already exists" }`.

## Postman Collection

`postman/Loan-Lead-Management.postman_collection.json` — import into Postman along with an
environment defining `base_url` (`http://127.0.0.1:8000/api`) and `access_token` (populate
via the Login request's saved test script).

## SQL Dump

`db/loan_lead_management_dump.sql` — a `pg_dump` of the schema and seed data. Restore with:
```bash
psql -U loan_app_user -d loan_lead_management -f db/loan_lead_management_dump.sql
```

## Notes on scope

- Role-based access is basic: `ADMIN` can view everything; only `SUPER_ADMIN` can delete BRE
  rules.
- Docker, unit tests, and dashboard chart export were intentionally left out of scope for
  this submission.
