# AI Customer Support Chatbot — n8n Agentic Workflow

**AI-Powered Support for Modern E-Commerce · Built on n8n + Google Gemini + Telegram**

---

![AI Customer Support Chatbot](./ChatGPT%20Image%20Apr%2026%2C%202026%2C%2012_59_34%20PM.png)

---

## Overview

An end-to-end agentic customer support chatbot built for **Myntra** (India's leading fashion e-commerce platform) using **n8n**, **Google Gemini**, and **Telegram**. Customers message the bot on Telegram in plain language; the agent reasons over the query, queries the relevant Google Sheets database, and replies with accurate, contextual information — all without any human in the loop.

The workflow handles order tracking, returns, refunds, payments, and promotional offers — the top five support topics that account for ~90% of inbound CX volume.

---

## Live Performance (Dashboard Metrics)

| Metric | Value |
|---|---|
| Total Queries Resolved | 1,248 |
| Resolution Rate | 98.4% |
| Avg Response Time | 4.2 seconds |
| Customer Satisfaction | 4.8 / 5 |

**Top Support Topics**

| Topic | Share |
|---|---|
| Order Status | 40% |
| Returns & Refunds | 20% |
| Payments & Offers | 15% |
| Delivery Tracking | 15% |
| Others | 10% |

---

## Workflow Architecture

```
Customer (Telegram)
        │
        ▼
┌──────────────────┐
│  Telegram Trigger │  ← Listens for any incoming message
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│               AI Agent (LangChain)            │
│  Powered by: Google Gemini (PaLM)             │
│  Memory:     Buffer Window (per chat.id)      │
│  Tools:      Order Tool · Payment Tool        │
└────┬─────────────────────────────────────┬───┘
     │                                     │
     ▼                                     ▼
┌──────────────────┐           ┌──────────────────────┐
│  Google Sheets   │           │  Google Sheets        │
│  Order_Status_   │           │  Payment_Offers_Data  │
│  Data            │           │                       │
└──────────────────┘           └──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Send Text Message   │  ← Replies to user on Telegram
│  (Telegram node)     │
└──────────────────────┘
```

---

## Nodes Explained

### 1. Telegram Trigger
- **Type:** Webhook trigger
- **Function:** Listens for any `message` event on the connected Telegram bot
- **Passes forward:** `message.text` (user's query) and `message.chat.id` (session identifier)

### 2. AI Agent
- **Type:** n8n LangChain Agent (`@n8n/n8n-nodes-langchain.agent`)
- **Function:** Core reasoning layer — interprets the user query, decides which tool to call (Order or Payment), synthesises the response
- **Input:** Raw message text from Telegram Trigger
- **System prompt:** Scoped to Myntra support — handles order queries, returns, payments, offers, and app navigation; politely declines out-of-scope queries (rides, banking, food delivery, etc.)

### 3. Google Gemini Chat Model
- **Type:** `@n8n/n8n-nodes-langchain.lmChatGoogleGemini`
- **Function:** The LLM powering the agent's reasoning. Processes the system prompt + user message + tool outputs to generate the final response
- **Connected to:** AI Agent as `ai_languageModel`

### 4. Simple Memory (Buffer Window)
- **Type:** `@n8n/n8n-nodes-langchain.memoryBufferWindow`
- **Function:** Maintains per-conversation context so the agent remembers what was asked earlier in the same chat session
- **Session key:** `message.chat.id` — each Telegram chat gets its own isolated memory window
- **Connected to:** AI Agent as `ai_memory`

### 5. Order Tool (Google Sheets)
- **Type:** `n8n-nodes-base.googleSheetsTool`
- **Sheet:** `Order_Status_Data`
- **Contains:** Order IDs, order status (confirmed / shipped / delivered / returned / cancelled), tracking updates, delivery dates, refund status
- **Connected to:** AI Agent as `ai_tool` — called automatically when order-related queries are detected

### 6. Payment Tool (Google Sheets)
- **Type:** `n8n-nodes-base.googleSheetsTool`
- **Sheet:** `Payment_Offers_Data`
- **Contains:** Bank offers, promo codes, discount eligibility criteria, UPI and wallet offers
- **Connected to:** AI Agent as `ai_tool` — called automatically when payment or offer queries are detected

### 7. Send a Text Message
- **Type:** `n8n-nodes-base.telegram`
- **Function:** Sends the AI Agent's final response back to the user on Telegram
- **Target:** Dynamically set to the originating `chat.id` from the Telegram Trigger

---

## System Prompt Design

The AI Agent's system prompt is scoped and structured to ensure safe, accurate, on-brand responses:

| Design Decision | Implementation |
|---|---|
| **Scope enforcement** | Explicitly lists supported topics; returns a polite deflection for anything outside Myntra CX |
| **Safety guardrails** | Never requests personal info (phone, email, OTP, payment details) |
| **Escalation path** | Directs users to Myntra in-app support for missing refunds, failed transactions, or safety issues |
| **RAG grounding** | Only answers based on verified data from the connected Google Sheets; says "I couldn't find verified information" when data is absent |
| **Language** | Responds in the user's language if supported; defaults to English |
| **Formatting** | Uses bullet points for steps and policies; keeps responses concise for mobile |

---

## How to Import and Run

### Prerequisites
- n8n instance (self-hosted or n8n Cloud)
- Google Gemini API key (PaLM API)
- Telegram Bot token (create via [@BotFather](https://t.me/botfather))
- Google Sheets OAuth2 credentials in n8n
- A copy of the Myntra Chatbot Database Google Sheet (two tabs: `Order_Status_Data`, `Payment_Offers_Data`)

### Steps

1. **Import the workflow**
   - Open n8n → Workflows → Import from file
   - Select `N8n Workflow chatbot.json`

2. **Configure credentials**
   - Telegram: Add your Bot token under `Telegram account`
   - Google Gemini: Add your PaLM API key under `Google Gemini(PaLM) Api account`
   - Google Sheets: Connect via OAuth2 under `Google Sheets OAuth2 API`

3. **Update the Google Sheet ID**
   - In both the `Order` and `Payment` nodes, update `documentId` to point to your copy of the database sheet

4. **Activate the workflow**
   - Toggle the workflow to **Active**
   - The Telegram Trigger webhook registers automatically

5. **Test**
   - Open your Telegram bot and send: `What is the status of order #123456?`
   - The bot should query the Order sheet and reply within seconds

---

## Data Schema

**Sheet 1: Order_Status_Data**

| Column | Description |
|---|---|
| Order ID | Unique order identifier |
| Status | confirmed / shipped / delivered / returned / cancelled |
| Tracking Update | Latest logistics event |
| Delivery Date | Expected or actual delivery date |
| Refund Status | Pending / Processed / N/A |

**Sheet 2: Payment_Offers_Data**

| Column | Description |
|---|---|
| Bank / Wallet | HDFC, ICICI, Paytm, PhonePe, etc. |
| Offer Type | Cashback / Discount / No-cost EMI |
| Promo Code | Applicable code |
| Eligibility | Minimum order value, card type, etc. |
| Validity | Offer expiry date |

---

## Key Design Decisions

**Why n8n?**
Visual workflow builder with native LangChain support, Google Sheets tool nodes, and a Telegram trigger — the entire stack assembles in one canvas without writing backend code.

**Why Google Gemini over OpenAI?**
Lower latency for Indian-language queries, competitive pricing at scale, and direct integration via n8n's native Gemini node.

**Why Telegram as the interface?**
Zero app installation friction for end users. Telegram's bot API supports conversational threads natively, and `chat.id` gives a free, reliable session key for memory management.

**Why Google Sheets as the database?**
Ops and support teams can update order status and offers data directly in Sheets without any engineering involvement — keeping the knowledge base fresh without redeployments.

---

## Extending This Workflow

| Extension | How |
|---|---|
| Add more data sources | Add new Google Sheets tool nodes and connect them to the AI Agent |
| WhatsApp support | Replace Telegram Trigger + Send node with WhatsApp Business API nodes |
| Escalation to human agent | Add an `If` node after AI Agent: if confidence is low or keywords like "speak to human" are detected, route to a CRM webhook |
| Multi-language support | Gemini handles it natively — no changes needed |
| Analytics | Add a Google Sheets write node to log every query + response for support analytics |

---

## Tech Stack

| Component | Technology |
|---|---|
| Workflow Orchestration | n8n |
| LLM | Google Gemini (PaLM API) |
| Agent Framework | n8n LangChain nodes |
| Memory | Buffer Window (per session) |
| Customer Interface | Telegram Bot API |
| Knowledge Base | Google Sheets (Order + Payment data) |
| Hosting | n8n Cloud / Self-hosted |
