/**
 * tracker.js - Core financial calculations and budgeting logic for Spendly
 */

const Tracker = {
  /**
   * Calculates overall metrics for the chosen month (or current month)
   */
  calculateSummary(expenses, monthlyBudget, targetYearMonth) {
    const filteredExpenses = targetYearMonth 
      ? expenses.filter(e => e.date && e.date.startsWith(targetYearMonth))
      : expenses;

    const totalSpent = filteredExpenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    const budget = parseFloat(monthlyBudget) || 0;
    const remaining = budget - totalSpent;
    const percentUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

    // Student "Safe-to-Spend Daily" calculation
    const now = new Date();
    let daysRemaining = 1;
    
    if (targetYearMonth) {
      const [year, month] = targetYearMonth.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      
      if (year === now.getFullYear() && month === (now.getMonth() + 1)) {
        daysRemaining = Math.max(1, (daysInMonth - now.getDate()) + 1);
      } else if (new Date(year, month - 1, 1) < new Date(now.getFullYear(), now.getMonth(), 1)) {
        daysRemaining = 1;
      } else {
        daysRemaining = daysInMonth;
      }
    } else {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      daysRemaining = Math.max(1, (daysInMonth - now.getDate()) + 1);
    }

    const safeDailySpend = remaining > 0 ? (remaining / daysRemaining) : 0;

    // Status level
    let status = 'safe';
    if (percentUsed >= 100) {
      status = 'exceeded';
    } else if (percentUsed >= 85) {
      status = 'danger';
    } else if (percentUsed >= 70) {
      status = 'warning';
    }

    return {
      budget,
      totalSpent,
      remaining,
      percentUsed: Math.min(percentUsed, 100),
      isOverBudget: remaining < 0,
      daysRemaining,
      safeDailySpend,
      status,
      count: filteredExpenses.length
    };
  },

  /**
   * Group expenses by category with percentages and colors
   */
  calculateCategoryBreakdown(expenses, targetYearMonth) {
    const filteredExpenses = targetYearMonth 
      ? expenses.filter(e => e.date && e.date.startsWith(targetYearMonth))
      : expenses;

    const total = filteredExpenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    const groups = {};

    filteredExpenses.forEach(e => {
      const catId = e.category || 'misc';
      if (!groups[catId]) {
        groups[catId] = {
          id: catId,
          name: CATEGORIES[catId]?.name || catId,
          icon: CATEGORIES[catId]?.icon || '📌',
          color: CATEGORIES[catId]?.color || '#64748b',
          badgeClass: CATEGORIES[catId]?.badgeClass || 'badge-misc',
          amount: 0,
          count: 0
        };
      }
      groups[catId].amount += parseFloat(e.amount) || 0;
      groups[catId].count += 1;
    });

    const result = Object.values(groups).map(item => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0
    }));

    return result.sort((a, b) => b.amount - a.amount);
  },

  /**
   * Compare Category Spending vs Category Budgets
   */
  calculateCategoryBudgets(expenses, categoryBudgets = {}, targetYearMonth) {
    const filteredExpenses = targetYearMonth 
      ? expenses.filter(e => e.date && e.date.startsWith(targetYearMonth))
      : expenses;

    // Calculate spent per category
    const spentMap = {};
    filteredExpenses.forEach(e => {
      spentMap[e.category] = (spentMap[e.category] || 0) + (parseFloat(e.amount) || 0);
    });

    const categoriesList = Object.values(CATEGORIES);
    return categoriesList.map(cat => {
      const spent = spentMap[cat.id] || 0;
      const budgetLimit = parseFloat(categoryBudgets[cat.id]) || 0;
      const remaining = budgetLimit - spent;
      const percentUsed = budgetLimit > 0 ? (spent / budgetLimit) * 100 : (spent > 0 ? 100 : 0);

      let status = 'safe'; // 'safe', 'warning', 'danger', 'exceeded'
      if (budgetLimit > 0) {
        if (spent > budgetLimit) status = 'exceeded';
        else if (percentUsed >= 85) status = 'danger';
        else if (percentUsed >= 70) status = 'warning';
      }

      return {
        ...cat,
        spent,
        budgetLimit,
        remaining,
        percentUsed: Math.min(percentUsed, 100),
        status
      };
    });
  },

  /**
   * Savings Goals Summary
   */
  calculateSavingsSummary(goals = []) {
    let totalTarget = 0;
    let totalSaved = 0;
    let completedCount = 0;

    const detailedGoals = (goals || []).map(g => {
      const target = parseFloat(g.targetAmount) || 0;
      const saved = parseFloat(g.savedAmount) || 0;
      totalTarget += target;
      totalSaved += saved;
      const percent = target > 0 ? Math.min(100, (saved / target) * 100) : 0;
      const isCompleted = saved >= target && target > 0;
      if (isCompleted) completedCount++;

      // Days remaining to target date
      let daysLeft = null;
      if (g.targetDate) {
        const targetD = new Date(g.targetDate);
        const nowD = new Date();
        const diffTime = targetD - nowD;
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        ...g,
        target,
        saved,
        remaining: Math.max(0, target - saved),
        percent,
        isCompleted,
        daysLeft
      };
    });

    const overallPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return {
      totalTarget,
      totalSaved,
      overallPercent: Math.min(100, overallPercent),
      completedCount,
      totalGoals: detailedGoals.length,
      goals: detailedGoals
    };
  },

  /**
   * Payment Method Distribution
   */
  calculatePaymentMethods(expenses, targetYearMonth) {
    const filteredExpenses = targetYearMonth 
      ? expenses.filter(e => e.date && e.date.startsWith(targetYearMonth))
      : expenses;

    const methods = {
      'UPI/Card': { label: 'UPI / Debit Card', amount: 0, count: 0, color: '#6366f1' },
      'Cash': { label: 'Cash', amount: 0, count: 0, color: '#10b981' },
      'Online': { label: 'Online / Net Banking', amount: 0, count: 0, color: '#f59e0b' },
      'Bank Transfer': { label: 'Bank Transfer', amount: 0, count: 0, color: '#8b5cf6' },
      'Other': { label: 'Other', amount: 0, count: 0, color: '#64748b' }
    };

    let total = 0;
    filteredExpenses.forEach(e => {
      const method = methods[e.paymentMethod] ? e.paymentMethod : 'Other';
      const amt = parseFloat(e.amount) || 0;
      methods[method].amount += amt;
      methods[method].count += 1;
      total += amt;
    });

    return Object.entries(methods).map(([key, val]) => ({
      key,
      ...val,
      percentage: total > 0 ? (val.amount / total) * 100 : 0
    })).filter(m => m.count > 0);
  },

  /**
   * Calculate spending for each of the last N days (default 7 days)
   */
  calculateDailyTrends(expenses, daysCount = 7) {
    const days = [];
    const today = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' });
      
      const dayTotal = expenses
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

      days.push({
        date: dateStr,
        label: dayLabel,
        amount: dayTotal
      });
    }

    const maxAmount = Math.max(...days.map(d => d.amount), 1);
    return days.map(d => ({
      ...d,
      heightPercent: (d.amount / maxAmount) * 100
    }));
  },

  /**
   * Roommate / Student Bill Splitter calculation
   */
  calculateBillSplit(totalBill, peopleCount, tipPercent = 0) {
    const bill = Math.max(0, parseFloat(totalBill) || 0);
    const people = Math.max(1, parseInt(peopleCount, 10) || 1);
    const tipRate = Math.max(0, parseFloat(tipPercent) || 0) / 100;

    const tipTotal = bill * tipRate;
    const grandTotal = bill + tipTotal;
    const perPerson = grandTotal / people;
    const tipPerPerson = tipTotal / people;

    return {
      bill,
      people,
      tipTotal,
      grandTotal,
      perPerson,
      tipPerPerson
    };
  },

  /**
   * Filter and sort transactions
   */
  filterAndSort(expenses, { searchQuery = '', category = 'all', paymentMethod = 'all', sortBy = 'date_desc' } = {}) {
    let result = [...expenses];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(e => {
        const titleMatch = (e.title || '').toLowerCase().includes(q);
        const notesMatch = (e.notes || '').toLowerCase().includes(q);
        const catName = (CATEGORIES[e.category]?.name || '').toLowerCase();
        const catMatch = catName.includes(q);
        return titleMatch || notesMatch || catMatch;
      });
    }

    // Category filter
    if (category && category !== 'all') {
      result = result.filter(e => e.category === category);
    }

    // Payment method filter
    if (paymentMethod && paymentMethod !== 'all') {
      result = result.filter(e => e.paymentMethod === paymentMethod);
    }

    // Sort order
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return (a.date || '').localeCompare(b.date || '');
        case 'amount_desc':
          return (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0);
        case 'amount_asc':
          return (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
        case 'date_desc':
        default:
          return (b.date || '').localeCompare(a.date || '');
      }
    });

    return result;
  }
};
