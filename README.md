# 🎓 Spendly — Campus Expense & Budgeting Platform

A modern, responsive, and privacy-focused financial management platform built specifically for college and university students.

---

## 🏛️ Architecture & Views

```text
Spendly
│
├── 📊 Dashboard        # Allowance metrics, Safe-to-Spend, Roommate Splitter, Recent Activity
├── ➕ Add Expense       # Dedicated expense logger, quick presets, friend bill split
├── 📜 Expense History   # Comprehensive transaction ledger, advanced search, filters, CSV export
├── 🎯 Budget            # Overall monthly allowance + category-specific budgets
├── 📈 Analytics         # Visual spending donut, 7-day pace bars, payment method breakdown
├── 🐷 Savings Goals     # Target funds (laptops, trips, emergency) with deposit/withdraw tracking
└── ⚙️ Settings          # Student profile, multi-currency, theme mode & JSON backups
```

---

## 🌟 Key Features

1. **Dashboard**:
   - **Monthly Budget**: Visual limit progress bar with real-time health indicator.
   - **Daily "Safe-to-Spend"**: Automatically computes your remaining daily allowance for the rest of the month.
   - **Roommate & Group Splitter**: Instant group calculations with tip percent and 1-click expense logging.
   - **Recent Activity**: Quick snapshot of latest campus spending.

2. **Add Expense**:
   - High-speed logging with popular student presets (Canteen Lunch, Coffee, Books, Metro Pass, Laundry).
   - Category picker with student badges.
   - Friend/Roommate bill split integration.

3. **Expense History**:
   - Multi-filter search (by text, month, category, payment method).
   - Edit and delete transaction records.
   - 1-click CSV spreadsheet export.

4. **Budget & Category Limits**:
   - Set monthly allowances for individual categories (Food, Rent, Books, Transport, Outings, Utilities, etc.).
   - Visual progress bars with status badges (`On Track`, `Approaching Limit`, `Critical`, `Over Budget`).

5. **Analytics**:
   - Interactive SVG Donut chart with category legend and percentages.
   - 7-Day & 30-Day spending pace bar chart.
   - Payment method breakdown (UPI, Card, Cash, Online).
   - Top 5 largest spending leaderboard.

6. **Savings Goals**:
   - Create custom targets (e.g. *MacBook Air*, *Semester Trip*, *Emergency Buffer*).
   - Visual progress bars and countdown deadlines.
   - Deposit and withdraw funds directly.

7. **Settings & Portability**:
   - Student Profile customization (Name, University, Semester).
   - Multi-currency switcher (`$`, `₹`, `€`, `£`, `C$`, `A$`, `¥`).
   - Dark Mode / Light Mode with automatic persistence.
   - Full JSON backup & restore functionality.

---

## 🚀 How to Run

### Method 1: Using the Python Server (Recommended)
```powershell
py run.py
```
This automatically starts the local server and opens `http://127.0.0.1:8000` in your default web browser.

### Method 2: Direct Browser Open
Double-click `index.html` or open it with any web browser.
