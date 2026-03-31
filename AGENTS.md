# AGENTS.md

## Project
This is a restaurant operation system called "Lá na Calçada".

It manages:
- counter orders
- delivery orders
- WhatsApp messaging
- order flow and status

## Stack
- Next.js (frontend + backend)
- Database: Supabase


## Important concepts
- Orders can be counter or delivery
- Delivery may have fees and time restrictions
- Orders have lifecycle statuses
- WhatsApp is used to communicate orders

## Guidelines
- Do not break existing order flow
- Prefer simple and readable solutions
- Keep logic separated from UI
- Always consider future SaaS (multi-tenant)