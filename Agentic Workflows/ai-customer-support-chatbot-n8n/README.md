# AI Customer Support Chatbot — n8n Workflow

> An agentic customer support chatbot that handles inbound queries, classifies intent, resolves common issues autonomously, and escalates complex cases to human agents.

## What It Does
- Receives customer messages via webhook
- Classifies intent (billing, technical, general, escalation)
- Resolves common queries autonomously using AI
- Escalates when confidence is low or sentiment is negative
- Logs all interactions for QA review

## How to Import
1. Import `N8n Workflow chatbot.json` into your n8n instance
2. Connect your messaging channel (WhatsApp, Slack, email)
3. Add your OpenAI/Gemini credentials
4. Activate

## Tech Stack
- n8n · OpenAI / Gemini · Webhook trigger

---
**Built by Rochak Singhal** — [Portfolio](https://github.com/rochaksinghal01/AI-PM-Portfolio)
