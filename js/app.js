/**
 * app.js - Main Application Controller for Spendly
 */

(function () {
  'use strict';

  // Global State
  let currentView = 'dashboard';
  let expenses = [];
  let budget = DEFAULT_BUDGET;
  let categoryBudgets = {};
  let savingsGoals = [];
  let profile = { studentName: 'Alex Student', university: 'State University', semester: 'Fall Semester' };
  let currency = DEFAULT_CURRENCY;
  let theme = 'light';
  let selectedMonth = ''; // 'YYYY-MM' or 'all'
  let filters = {
    searchQuery: '',
    category: 'all',
    paymentMethod: 'all',
    sortBy: 'date_desc'
  };
  let editingExpenseId = null;

  // View configuration
  const VIEW_TITLES = {
    'dashboard': { title: 'Dashboard', subtitle: 'Your student finances, allowance pace & roommate expenses' },
    'add-expense': { title: 'Add Expense', subtitle: 'Record an expense or split a bill with friends' },
    'history': { title: 'Expense History', subtitle: 'Complete ledger of all campus transactions & receipts' },
    'budget': { title: 'Budgets & Limits', subtitle: 'Set spending limits for mess, rent, books, and outings' },
    'analytics': { title: 'Spending Analytics', subtitle: 'Visual breakdown and patterns of your college spending' },
    'savings': { title: 'Savings Goals', subtitle: 'Allocate allowance savings for laptops, trips, and emergency funds' },
    'settings': { title: 'Settings & Data', subtitle: 'Manage your student profile, region, and data backups' }
  };

  // DOM Elements Cache
  const el = {
    // Navigation & Shell
    appSidebar: document.getElementById('appSidebar'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    btnQuickAddMobile: document.getElementById('btnQuickAddMobile'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    pageTitle: document.getElementById('pageTitle'),
    pageSubtitle: document.getElementById('pageSubtitle'),
    monthSelect: document.getElementById('monthSelect'),
    currencySelect: document.getElementById('currencySelect'),
    btnOpenAddModal: document.getElementById('btnOpenAddModal'),
    sidebarAvatar: document.getElementById('sidebarAvatar'),
    sidebarUserName: document.getElementById('sidebarUserName'),
    sidebarUniversity: document.getElementById('sidebarUniversity'),

    // Views
    viewDashboard: document.getElementById('view-dashboard'),
    viewAddExpense: document.getElementById('view-add-expense'),
    viewHistory: document.getElementById('view-history'),
    viewBudget: document.getElementById('view-budget'),
    viewAnalytics: document.getElementById('view-analytics'),
    viewSavings: document.getElementById('view-savings'),
    viewSettings: document.getElementById('view-settings'),

    // Dashboard Cards & Tools
    cardBudgetVal: document.getElementById('cardBudgetVal'),
    cardSpentVal: document.getElementById('cardSpentVal'),
    cardRemainingVal: document.getElementById('cardRemainingVal'),
    cardSafeSpendVal: document.getElementById('cardSafeSpendVal'),
    budgetProgress: document.getElementById('budgetProgress'),
    budgetPercentText: document.getElementById('budgetPercentText'),
    safeSpendSubtext: document.getElementById('safeSpendSubtext'),
    remainingSubtext: document.getElementById('remainingSubtext'),
    btnOpenBudgetModal: document.getElementById('btnOpenBudgetModal'),
    btnGoToHistory: document.getElementById('btnGoToHistory'),
    dashboardRecentTableBody: document.getElementById('dashboardRecentTableBody'),

    // Splitter
    splitBillInput: document.getElementById('splitBillInput'),
    splitPeopleInput: document.getElementById('splitPeopleInput'),
    splitTipSelect: document.getElementById('splitTipSelect'),
    splitResultText: document.getElementById('splitResultText'),
    btnAddSplitAsExpense: document.getElementById('btnAddSplitAsExpense'),

    // Quick Add on Dashboard
    quickTitleInput: document.getElementById('quickTitleInput'),
    quickAmountInput: document.getElementById('quickAmountInput'),
    quickCategorySelect: document.getElementById('quickCategorySelect'),
    quickAddForm: document.getElementById('quickAddForm'),

    // Dedicated Add Expense View
    dedicatedExpenseForm: document.getElementById('dedicatedExpenseForm'),
    dedicatedAmountInput: document.getElementById('dedicatedAmountInput'),
    dedicatedCurrencySymbol: document.getElementById('dedicatedCurrencySymbol'),
    dedicatedTitleInput: document.getElementById('dedicatedTitleInput'),
    categoryPickerGrid: document.getElementById('categoryPickerGrid'),
    dedicatedSelectedCategory: document.getElementById('dedicatedSelectedCategory'),
    dedicatedDateInput: document.getElementById('dedicatedDateInput'),
    dedicatedPaymentSelect: document.getElementById('dedicatedPaymentSelect'),
    dedicatedNotesInput: document.getElementById('dedicatedNotesInput'),
    splitBillCheckbox: document.getElementById('splitBillCheckbox'),
    splitCalculationDetails: document.getElementById('splitCalculationDetails'),
    dedicatedSplitPeople: document.getElementById('dedicatedSplitPeople'),
    dedicatedSharePreview: document.getElementById('dedicatedSharePreview'),

    // History View
    searchInput: document.getElementById('searchInput'),
    categoryFilterSelect: document.getElementById('categoryFilterSelect'),
    paymentFilterSelect: document.getElementById('paymentFilterSelect'),
    sortSelect: document.getElementById('sortSelect'),
    btnExportCSV: document.getElementById('btnExportCSV'),
    expensesTableBody: document.getElementById('expensesTableBody'),
    emptyStateContainer: document.getElementById('emptyStateContainer'),
    transactionCountBadge: document.getElementById('transactionCountBadge'),

    // Budget View
    budgetViewTotalVal: document.getElementById('budgetViewTotalVal'),
    btnOpenBudgetModal2: document.getElementById('btnOpenBudgetModal2'),
    categoryBudgetsGrid: document.getElementById('categoryBudgetsGrid'),

    // Analytics View
    analyticsTopExpensesContainer: document.getElementById('analyticsTopExpensesContainer'),

    // Savings Goals View
    savingsTotalSavedVal: document.getElementById('savingsTotalSavedVal'),
    savingsTotalPercentText: document.getElementById('savingsTotalPercentText'),
    savingsTotalTargetVal: document.getElementById('savingsTotalTargetVal'),
    savingsGoalCountText: document.getElementById('savingsGoalCountText'),
    btnOpenAddGoalModal: document.getElementById('btnOpenAddGoalModal'),
    savingsGoalsGrid: document.getElementById('savingsGoalsGrid'),

    // Settings View
    profileForm: document.getElementById('profileForm'),
    settingStudentName: document.getElementById('settingStudentName'),
    settingUniversity: document.getElementById('settingUniversity'),
    settingSemester: document.getElementById('settingSemester'),
    settingCurrencySelect: document.getElementById('settingCurrencySelect'),
    btnThemeLight: document.getElementById('btnThemeLight'),
    btnThemeDark: document.getElementById('btnThemeDark'),
    btnExportJSON: document.getElementById('btnExportJSON'),
    btnImportBackup: document.getElementById('btnImportBackup'),
    importFileInput: document.getElementById('importFileInput'),
    btnLoadDemo: document.getElementById('btnLoadDemo'),
    btnResetData: document.getElementById('btnResetData'),

    // Modals
    expenseModalOverlay: document.getElementById('expenseModalOverlay'),
    expenseModalTitle: document.getElementById('expenseModalTitle'),
    expenseForm: document.getElementById('expenseForm'),
    expenseIdInput: document.getElementById('expenseIdInput'),
    expenseTitleInput: document.getElementById('expenseTitleInput'),
    expenseAmountInput: document.getElementById('expenseAmountInput'),
    expenseCategorySelect: document.getElementById('expenseCategorySelect'),
    expenseDateInput: document.getElementById('expenseDateInput'),
    expensePaymentSelect: document.getElementById('expensePaymentSelect'),
    expenseNotesInput: document.getElementById('expenseNotesInput'),
    btnCancelExpenseModal: document.getElementById('btnCancelExpenseModal'),
    btnCloseExpenseModal: document.getElementById('btnCloseExpenseModal'),

    budgetModalOverlay: document.getElementById('budgetModalOverlay'),
    budgetInput: document.getElementById('budgetInput'),
    btnSaveBudget: document.getElementById('btnSaveBudget'),
    btnCancelBudgetModal: document.getElementById('btnCancelBudgetModal'),
    btnCloseBudgetModal: document.getElementById('btnCloseBudgetModal'),

    catBudgetModalOverlay: document.getElementById('catBudgetModalOverlay'),
    editCatBudgetId: document.getElementById('editCatBudgetId'),
    editCatBudgetNameLabel: document.getElementById('editCatBudgetNameLabel'),
    editCatBudgetAmountInput: document.getElementById('editCatBudgetAmountInput'),
    btnSaveCatBudget: document.getElementById('btnSaveCatBudget'),
    btnCancelCatBudgetModal: document.getElementById('btnCancelCatBudgetModal'),
    btnCloseCatBudgetModal: document.getElementById('btnCloseCatBudgetModal'),

    savingsGoalModalOverlay: document.getElementById('savingsGoalModalOverlay'),
    goalModalTitle: document.getElementById('goalModalTitle'),
    goalForm: document.getElementById('goalForm'),
    goalEmojiInput: document.getElementById('goalEmojiInput'),
    goalTitleInput: document.getElementById('goalTitleInput'),
    goalTargetInput: document.getElementById('goalTargetInput'),
    goalInitialSavedInput: document.getElementById('goalInitialSavedInput'),
    goalDateInput: document.getElementById('goalDateInput'),
    btnCancelGoalModal: document.getElementById('btnCancelGoalModal'),
    btnCloseGoalModal: document.getElementById('btnCloseGoalModal'),

    goalFundModalOverlay: document.getElementById('goalFundModalOverlay'),
    goalFundModalTitle: document.getElementById('goalFundModalTitle'),
    fundGoalId: document.getElementById('fundGoalId'),
    fundActionType: document.getElementById('fundActionType'),
    fundGoalSubtitle: document.getElementById('fundGoalSubtitle'),
    fundAmountInput: document.getElementById('fundAmountInput'),
    btnConfirmGoalFund: document.getElementById('btnConfirmGoalFund'),
    btnCancelGoalFundModal: document.getElementById('btnCancelGoalFundModal'),
    btnCloseGoalFundModal: document.getElementById('btnCloseGoalFundModal'),

    toastContainer: document.getElementById('toastContainer')
  };

  /**
   * Toast notification helper
   */
  function showToast(message, type = 'info') {
    if (!el.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<span class="toast-icon success"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></span>`;
    } else if (type === 'danger') {
      iconSvg = `<span class="toast-icon danger"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span>`;
    } else {
      iconSvg = `<span class="toast-icon info"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /**
   * View Routing
   */
  function switchView(viewName) {
    if (!VIEW_TITLES[viewName]) viewName = 'dashboard';
    currentView = viewName;

    // Update nav links active states (sidebar & bottom bar)
    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
      if (link.dataset.view === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle view containers
    const containers = {
      'dashboard': el.viewDashboard,
      'add-expense': el.viewAddExpense,
      'history': el.viewHistory,
      'budget': el.viewBudget,
      'analytics': el.viewAnalytics,
      'savings': el.viewSavings,
      'settings': el.viewSettings
    };

    Object.entries(containers).forEach(([name, container]) => {
      if (container) {
        if (name === viewName) {
          container.classList.add('active');
        } else {
          container.classList.remove('active');
        }
      }
    });

    // Update Top Bar titles
    el.pageTitle.textContent = VIEW_TITLES[viewName].title;
    el.pageSubtitle.textContent = VIEW_TITLES[viewName].subtitle;

    // Close mobile menu if open
    if (el.appSidebar.classList.contains('open')) {
      el.appSidebar.classList.remove('open');
    }

    // Refresh view data
    refreshCurrentView();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Populate month dropdown (All Time + Current & past 5 months)
   */
  function populateMonthSelector() {
    const today = new Date();
    const currentYearMonth = today.toISOString().slice(0, 7);
    selectedMonth = currentYearMonth;

    el.monthSelect.innerHTML = '';
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = '📅 All Time';
    el.monthSelect.appendChild(allOpt);

    for (let i = 0; i < 6; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const val = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = `${label}${i === 0 ? ' (Current)' : ''}`;
      if (i === 0) opt.selected = true;
      el.monthSelect.appendChild(opt);
    }
  }

  /**
   * Populate Category Dropdowns & Category Picker Cards
   */
  function populateCategories() {
    const catList = Object.values(CATEGORIES);

    // 1. Quick Add Dropdown
    el.quickCategorySelect.innerHTML = '';
    catList.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.icon} ${c.name}`;
      el.quickCategorySelect.appendChild(opt);
    });

    // 2. Modal Category Select
    el.expenseCategorySelect.innerHTML = '';
    catList.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.icon} ${c.name}`;
      el.expenseCategorySelect.appendChild(opt);
    });

    // 3. History Filter Category Select
    el.categoryFilterSelect.innerHTML = '<option value="all">All Categories</option>';
    catList.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.icon} ${c.name}`;
      el.categoryFilterSelect.appendChild(opt);
    });

    // 4. Dedicated Add Expense Category Picker Cards
    el.categoryPickerGrid.innerHTML = '';
    catList.forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = `category-picker-item ${idx === 0 ? 'selected' : ''}`;
      card.dataset.categoryId = c.id;
      card.innerHTML = `
        <span class="cat-icon">${c.icon}</span>
        <span>${c.name}</span>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.category-picker-item').forEach(x => x.classList.remove('selected'));
        card.classList.add('selected');
        el.dedicatedSelectedCategory.value = c.id;
      });
      el.categoryPickerGrid.appendChild(card);
    });
  }

  /**
   * Render Dashboard View
   */
  function renderDashboard() {
    const targetMonth = selectedMonth === 'all' ? null : selectedMonth;
    const summary = Tracker.calculateSummary(expenses, budget, targetMonth);

    // Cards
    el.cardBudgetVal.textContent = `${currency}${summary.budget.toFixed(2)}`;
    el.cardSpentVal.textContent = `${currency}${summary.totalSpent.toFixed(2)}`;
    el.budgetPercentText.textContent = `${summary.percentUsed.toFixed(0)}% of budget used`;

    el.budgetProgress.style.width = `${Math.min(summary.percentUsed, 100)}%`;
    if (summary.status === 'exceeded' || summary.status === 'danger') {
      el.budgetProgress.style.backgroundColor = 'var(--danger)';
    } else if (summary.status === 'warning') {
      el.budgetProgress.style.backgroundColor = 'var(--warning)';
    } else {
      el.budgetProgress.style.backgroundColor = 'var(--primary)';
    }

    el.cardRemainingVal.textContent = `${currency}${summary.remaining.toFixed(2)}`;
    if (summary.isOverBudget) {
      el.cardRemainingVal.style.color = 'var(--danger)';
      el.remainingSubtext.innerHTML = `<span class="card-subtext highlight-red">⚠️ Over budget by ${currency}${Math.abs(summary.remaining).toFixed(2)}</span>`;
    } else {
      el.cardRemainingVal.style.color = 'var(--text-primary)';
      el.remainingSubtext.innerHTML = `<span class="card-subtext highlight-green">✓ You have ${currency}${summary.remaining.toFixed(2)} left</span>`;
    }

    el.cardSafeSpendVal.textContent = `${currency}${summary.safeDailySpend.toFixed(2)}`;
    el.safeSpendSubtext.textContent = selectedMonth !== 'all' 
      ? `Based on ${summary.daysRemaining} days left this month` 
      : 'Calculated for current month pace';

    // Charts
    const breakdown = Tracker.calculateCategoryBreakdown(expenses, targetMonth);
    Charts.renderDonutChart('donutChartContainer', breakdown, summary.totalSpent, currency);

    const dailyTrends = Tracker.calculateDailyTrends(expenses, 7);
    Charts.renderBarChart('barChartContainer', dailyTrends, currency);

    // Recent 5 Transactions
    let recent = [...expenses];
    if (selectedMonth !== 'all') {
      recent = recent.filter(e => e.date && e.date.startsWith(selectedMonth));
    }
    recent.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const top5 = recent.slice(0, 5);

    if (top5.length === 0) {
      el.dashboardRecentTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted); padding: 20px;">No recent expenses found</td></tr>`;
    } else {
      el.dashboardRecentTableBody.innerHTML = top5.map(exp => {
        const cat = CATEGORIES[exp.category] || CATEGORIES.misc;
        return `
          <tr>
            <td style="white-space: nowrap; color: var(--text-secondary); font-size: 0.85rem;">${exp.date || '—'}</td>
            <td><strong>${escapeHtml(exp.title)}</strong></td>
            <td><span class="badge ${cat.badgeClass}">${cat.icon} ${cat.name}</span></td>
            <td><span class="payment-method-chip">${escapeHtml(exp.paymentMethod || 'Cash')}</span></td>
            <td class="expense-amount">-${currency}${parseFloat(exp.amount || 0).toFixed(2)}</td>
          </tr>
        `;
      }).join('');
    }
  }

  /**
   * Render History View
   */
  function renderHistory() {
    let list = [...expenses];

    if (selectedMonth !== 'all') {
      list = list.filter(e => e.date && e.date.startsWith(selectedMonth));
    }

    list = Tracker.filterAndSort(list, {
      searchQuery: filters.searchQuery,
      category: filters.category,
      paymentMethod: filters.paymentMethod,
      sortBy: filters.sortBy
    });

    el.transactionCountBadge.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;

    if (list.length === 0) {
      el.expensesTableBody.innerHTML = '';
      el.emptyStateContainer.style.display = 'block';
      return;
    }

    el.emptyStateContainer.style.display = 'none';

    el.expensesTableBody.innerHTML = list.map(exp => {
      const cat = CATEGORIES[exp.category] || CATEGORIES.misc;
      const formattedDate = exp.date ? new Date(exp.date + 'T00:00:00').toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : '—';

      return `
        <tr data-id="${exp.id}">
          <td style="white-space: nowrap; color: var(--text-secondary); font-size: 0.85rem;">${formattedDate}</td>
          <td>
            <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(exp.title)}</div>
            ${exp.notes ? `<div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">${escapeHtml(exp.notes)}</div>` : ''}
          </td>
          <td>
            <span class="badge ${cat.badgeClass}">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
            </span>
          </td>
          <td><span class="payment-method-chip">${escapeHtml(exp.paymentMethod || 'Cash')}</span></td>
          <td class="expense-amount">-${currency}${parseFloat(exp.amount || 0).toFixed(2)}</td>
          <td>
            <div class="row-actions">
              <button class="action-btn edit" data-action="edit" data-id="${exp.id}" title="Edit Expense">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button class="action-btn delete" data-action="delete" data-id="${exp.id}" title="Delete Expense">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Render Budget View
   */
  function renderBudgetView() {
    const targetMonth = selectedMonth === 'all' ? null : selectedMonth;
    el.budgetViewTotalVal.textContent = `${currency}${budget.toFixed(2)}`;

    const catBudgetStats = Tracker.calculateCategoryBudgets(expenses, categoryBudgets, targetMonth);

    el.categoryBudgetsGrid.innerHTML = catBudgetStats.map(c => {
      let statusClass = 'safe';
      let statusLabel = 'On Track';
      if (c.status === 'exceeded') {
        statusClass = 'exceeded';
        statusLabel = 'Over Budget';
      } else if (c.status === 'danger') {
        statusClass = 'danger';
        statusLabel = 'Critical';
      } else if (c.status === 'warning') {
        statusClass = 'warning';
        statusLabel = 'Approaching';
      }

      const barWidth = Math.min(100, c.percentUsed);
      const barColor = c.status === 'exceeded' || c.status === 'danger' ? 'var(--danger)' : (c.status === 'warning' ? 'var(--warning)' : 'var(--primary)');

      return `
        <div class="cat-budget-card">
          <div class="cat-budget-top">
            <div class="cat-budget-title">
              <span>${c.icon}</span>
              <span>${c.name}</span>
            </div>
            <span class="status-pill ${statusClass}">${statusLabel}</span>
          </div>

          <div class="cat-budget-amounts">
            <span>Spent: <strong>${currency}${c.spent.toFixed(2)}</strong></span>
            <span>Limit: <strong>${c.budgetLimit > 0 ? currency + c.budgetLimit.toFixed(2) : 'Not set'}</strong></span>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${barWidth}%; background-color: ${barColor};"></div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
            <span style="font-size: 0.78rem; color: var(--text-muted);">${c.percentUsed.toFixed(0)}% used</span>
            <button class="btn btn-secondary btn-edit-cat-budget" data-cat-id="${c.id}" data-cat-name="${c.name}" data-limit="${c.budgetLimit}" style="font-size: 0.78rem; padding: 4px 10px;">
              Edit Limit
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Analytics View
   */
  function renderAnalyticsView() {
    const targetMonth = selectedMonth === 'all' ? null : selectedMonth;
    const summary = Tracker.calculateSummary(expenses, budget, targetMonth);

    // Donut Chart
    const breakdown = Tracker.calculateCategoryBreakdown(expenses, targetMonth);
    Charts.renderDonutChart('analyticsDonutContainer', breakdown, summary.totalSpent, currency);

    // Bar Chart
    const dailyTrends = Tracker.calculateDailyTrends(expenses, 7);
    Charts.renderBarChart('analyticsBarContainer', dailyTrends, currency);

    // Payment Methods
    const methods = Tracker.calculatePaymentMethods(expenses, targetMonth);
    Charts.renderPaymentMethodChart('analyticsPaymentContainer', methods, currency);

    // Top 5 Expenses Leaderboard
    let sortedExpenses = [...expenses];
    if (targetMonth) {
      sortedExpenses = sortedExpenses.filter(e => e.date && e.date.startsWith(targetMonth));
    }
    sortedExpenses.sort((a, b) => (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0));
    const top5 = sortedExpenses.slice(0, 5);

    if (top5.length === 0) {
      el.analyticsTopExpensesContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">No expenses recorded yet.</p>`;
    } else {
      el.analyticsTopExpensesContainer.innerHTML = top5.map((item, idx) => {
        const cat = CATEGORIES[item.category] || CATEGORIES.misc;
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-card-subtle); border-radius: var(--radius-sm);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 800; color: var(--text-muted); font-size: 0.85rem;">#${idx + 1}</span>
              <div>
                <div style="font-weight: 600; font-size: 0.88rem;">${escapeHtml(item.title)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${item.date} • ${cat.name}</div>
              </div>
            </div>
            <span style="font-weight: 800; color: var(--danger); font-size: 0.95rem;">
              -${currency}${parseFloat(item.amount).toFixed(2)}
            </span>
          </div>
        `;
      }).join('');
    }
  }

  /**
   * Render Savings Goals View
   */
  function renderSavingsView() {
    const summary = Tracker.calculateSavingsSummary(savingsGoals);

    el.savingsTotalSavedVal.textContent = `${currency}${summary.totalSaved.toFixed(2)}`;
    el.savingsTotalTargetVal.textContent = `${currency}${summary.totalTarget.toFixed(2)}`;
    el.savingsTotalPercentText.textContent = `${summary.overallPercent.toFixed(0)}% of total targets saved`;
    el.savingsGoalCountText.textContent = `${summary.totalGoals} goal${summary.totalGoals === 1 ? '' : 's'} (${summary.completedCount} completed)`;

    if (summary.totalGoals === 0) {
      el.savingsGoalsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 10px;">🎯</div>
          <h3>No Savings Goals Yet</h3>
          <p style="font-size: 0.85rem; margin-top: 4px;">Set a goal for your next laptop, holiday trip, or emergency buffer!</p>
        </div>
      `;
      return;
    }

    el.savingsGoalsGrid.innerHTML = summary.goals.map(g => {
      const isCompleted = g.isCompleted;
      const barColor = isCompleted ? 'var(--success)' : 'var(--primary)';

      let daysText = '';
      if (g.daysLeft !== null) {
        if (g.daysLeft > 0) daysText = `📅 ${g.daysLeft} days left`;
        else if (g.daysLeft === 0) daysText = `📅 Due today!`;
        else daysText = `📅 Passed deadline`;
      }

      return `
        <div class="goal-card">
          <div class="goal-top">
            <div class="goal-emoji">${escapeHtml(g.emoji || '🎯')}</div>
            <div style="flex: 1;">
              <h3 class="goal-title">${escapeHtml(g.title)}</h3>
              ${daysText ? `<div class="goal-target-date">${daysText}</div>` : ''}
            </div>
            ${isCompleted ? `<span class="status-pill safe">Completed! 🎉</span>` : ''}
          </div>

          <div class="goal-amounts">
            <span class="goal-saved">${currency}${g.saved.toFixed(2)}</span>
            <span class="goal-target">of ${currency}${g.target.toFixed(2)}</span>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${g.percent}%; background-color: ${barColor};"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">
            <span>${g.percent.toFixed(0)}% achieved</span>
            <span>${currency}${g.remaining.toFixed(2)} remaining</span>
          </div>

          <div class="goal-actions">
            <button class="btn btn-primary btn-fund-goal" data-id="${g.id}" data-action="deposit" style="flex: 1; padding: 7px 10px; font-size: 0.82rem;">
              + Add Funds
            </button>
            <button class="btn btn-secondary btn-fund-goal" data-id="${g.id}" data-action="withdraw" style="padding: 7px 10px; font-size: 0.82rem;">
              Withdraw
            </button>
            <button class="btn btn-secondary btn-delete-goal" data-id="${g.id}" style="padding: 7px 10px; font-size: 0.82rem; color: var(--danger);">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Settings View
   */
  function renderSettingsView() {
    el.settingStudentName.value = profile.studentName || '';
    el.settingUniversity.value = profile.university || '';
    el.settingSemester.value = profile.semester || '';
    el.settingCurrencySelect.value = currency;
  }

  /**
   * Refresh current active view
   */
  function refreshCurrentView() {
    renderProfileHeader();
    switch (currentView) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'history':
        renderHistory();
        break;
      case 'budget':
        renderBudgetView();
        break;
      case 'analytics':
        renderAnalyticsView();
        break;
      case 'savings':
        renderSavingsView();
        break;
      case 'settings':
        renderSettingsView();
        break;
      case 'add-expense':
      default:
        break;
    }
  }

  function renderProfileHeader() {
    el.sidebarUserName.textContent = profile.studentName || 'Student';
    el.sidebarUniversity.textContent = profile.university || 'Campus';
    
    // Avatar initials
    const parts = (profile.studentName || 'Alex Student').split(' ');
    const initials = parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
    el.sidebarAvatar.textContent = initials || 'AS';
    el.dedicatedCurrencySymbol.textContent = currency;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Update Roommate Splitter
   */
  function updateBillSplit() {
    const bill = parseFloat(el.splitBillInput.value) || 0;
    const people = parseInt(el.splitPeopleInput.value, 10) || 1;
    const tip = parseFloat(el.splitTipSelect.value) || 0;
    const result = Tracker.calculateBillSplit(bill, people, tip);

    if (bill <= 0) {
      el.splitResultText.innerHTML = `Enter amount to calculate each roommate's share`;
      el.btnAddSplitAsExpense.disabled = true;
      return;
    }

    el.splitResultText.innerHTML = `Each pays: <strong>${currency}${result.perPerson.toFixed(2)}</strong> <span style="font-size:0.8rem; color: var(--text-muted);">(Total: ${currency}${result.grandTotal.toFixed(2)})</span>`;
    el.btnAddSplitAsExpense.disabled = false;
  }

  /**
   * Update Dedicated Add Expense Split Preview
   */
  function updateDedicatedSplit() {
    const amount = parseFloat(el.dedicatedAmountInput.value) || 0;
    const people = Math.max(1, parseInt(el.dedicatedSplitPeople.value, 10) || 1);
    const isSplit = el.splitBillCheckbox.checked;

    if (isSplit) {
      el.splitCalculationDetails.style.display = 'block';
      const share = amount / people;
      el.dedicatedSharePreview.textContent = `${currency}${share.toFixed(2)}`;
    } else {
      el.splitCalculationDetails.style.display = 'none';
    }
  }

  /**
   * Modals handling
   */
  function openExpenseModal(expenseToEdit = null) {
    editingExpenseId = expenseToEdit ? expenseToEdit.id : null;
    el.expenseModalTitle.textContent = expenseToEdit ? 'Edit Expense' : 'Add New Expense';

    if (expenseToEdit) {
      el.expenseIdInput.value = expenseToEdit.id;
      el.expenseTitleInput.value = expenseToEdit.title || '';
      el.expenseAmountInput.value = expenseToEdit.amount || '';
      el.expenseCategorySelect.value = expenseToEdit.category || 'food';
      el.expenseDateInput.value = expenseToEdit.date || new Date().toISOString().slice(0, 10);
      el.expensePaymentSelect.value = expenseToEdit.paymentMethod || 'UPI/Card';
      el.expenseNotesInput.value = expenseToEdit.notes || '';
    } else {
      el.expenseForm.reset();
      el.expenseIdInput.value = '';
      el.expenseDateInput.value = new Date().toISOString().slice(0, 10);
      el.expenseCategorySelect.value = 'food';
    }

    el.expenseModalOverlay.classList.add('active');
    el.expenseTitleInput.focus();
  }

  function closeExpenseModal() {
    el.expenseModalOverlay.classList.remove('active');
    editingExpenseId = null;
  }

  function openBudgetModal() {
    el.budgetInput.value = budget;
    el.budgetModalOverlay.classList.add('active');
    el.budgetInput.focus();
  }

  function closeBudgetModal() {
    el.budgetModalOverlay.classList.remove('active');
  }

  function openCatBudgetModal(catId, catName, currentLimit) {
    el.editCatBudgetId.value = catId;
    el.editCatBudgetNameLabel.textContent = `${catName} Limit (${currency})`;
    el.editCatBudgetAmountInput.value = currentLimit > 0 ? currentLimit : '';
    el.catBudgetModalOverlay.classList.add('active');
    el.editCatBudgetAmountInput.focus();
  }

  function closeCatBudgetModal() {
    el.catBudgetModalOverlay.classList.remove('active');
  }

  function openGoalModal() {
    el.goalForm.reset();
    el.goalEmojiInput.value = '🎯';
    el.goalDateInput.value = '';
    el.savingsGoalModalOverlay.classList.add('active');
    el.goalTitleInput.focus();
  }

  function closeGoalModal() {
    el.savingsGoalModalOverlay.classList.remove('active');
  }

  function openFundGoalModal(goalId, actionType) {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;

    el.fundGoalId.value = goalId;
    el.fundActionType.value = actionType;
    el.goalFundModalTitle.textContent = actionType === 'deposit' ? `Add Money to "${goal.title}"` : `Withdraw from "${goal.title}"`;
    el.fundGoalSubtitle.textContent = `Current saved: ${currency}${(parseFloat(goal.savedAmount) || 0).toFixed(2)} of ${currency}${(parseFloat(goal.targetAmount) || 0).toFixed(2)}`;
    el.fundAmountInput.value = '';
    el.goalFundModalOverlay.classList.add('active');
    el.fundAmountInput.focus();
  }

  function closeFundGoalModal() {
    el.goalFundModalOverlay.classList.remove('active');
  }

  /**
   * Bind Events
   */
  function bindEvents() {
    // Navigation routing (Sidebar & Bottom Nav)
    document.querySelectorAll('[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewName = item.dataset.view;
        if (viewName) switchView(viewName);
      });
    });

    // Mobile navigation toggle
    el.mobileMenuToggle.addEventListener('click', () => {
      el.appSidebar.classList.toggle('open');
    });

    el.btnQuickAddMobile.addEventListener('click', () => {
      switchView('add-expense');
    });

    // Theme Toggle
    const toggleTheme = (targetTheme) => {
      theme = targetTheme || (theme === 'light' ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
      StorageService.saveTheme(theme);
    };
    el.themeToggleBtn.addEventListener('click', () => toggleTheme());
    el.btnThemeLight.addEventListener('click', () => toggleTheme('light'));
    el.btnThemeDark.addEventListener('click', () => toggleTheme('dark'));

    // Currency Switcher
    const onCurrencyChange = (newVal) => {
      currency = newVal;
      StorageService.saveCurrency(currency);
      el.currencySelect.value = currency;
      el.settingCurrencySelect.value = currency;
      el.dedicatedCurrencySymbol.textContent = currency;
      updateBillSplit();
      refreshCurrentView();
      showToast(`Currency changed to ${currency}`, 'info');
    };
    el.currencySelect.addEventListener('change', (e) => onCurrencyChange(e.target.value));
    el.settingCurrencySelect.addEventListener('change', (e) => onCurrencyChange(e.target.value));

    // Month Selector
    el.monthSelect.addEventListener('change', (e) => {
      selectedMonth = e.target.value;
      refreshCurrentView();
    });

    // Roommate Bill Splitter (Dashboard)
    el.splitBillInput.addEventListener('input', updateBillSplit);
    el.splitPeopleInput.addEventListener('input', updateBillSplit);
    el.splitTipSelect.addEventListener('change', updateBillSplit);

    el.btnAddSplitAsExpense.addEventListener('click', () => {
      const bill = parseFloat(el.splitBillInput.value) || 0;
      const people = parseInt(el.splitPeopleInput.value, 10) || 1;
      const tip = parseFloat(el.splitTipSelect.value) || 0;
      const result = Tracker.calculateBillSplit(bill, people, tip);

      if (result.perPerson <= 0) return;

      const newExpense = {
        id: 'exp_' + Date.now(),
        title: `Bill Split (${people} people)`,
        amount: parseFloat(result.perPerson.toFixed(2)),
        category: 'food',
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: 'UPI/Card',
        notes: `Total bill ${currency}${result.grandTotal.toFixed(2)} split between ${people} friends`
      };

      expenses.unshift(newExpense);
      StorageService.saveExpenses(expenses);
      refreshCurrentView();
      showToast(`Added ${currency}${result.perPerson.toFixed(2)} share to expenses!`, 'success');
      el.splitBillInput.value = '';
      updateBillSplit();
    });

    // Quick Add on Dashboard
    el.quickAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = el.quickTitleInput.value.trim();
      const amount = parseFloat(el.quickAmountInput.value);
      const category = el.quickCategorySelect.value;

      if (!title || isNaN(amount) || amount <= 0) {
        showToast('Please enter description and valid amount', 'danger');
        return;
      }

      const newExpense = {
        id: 'exp_' + Date.now(),
        title,
        amount,
        category,
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: 'Cash',
        notes: ''
      };

      expenses.unshift(newExpense);
      StorageService.saveExpenses(expenses);
      el.quickTitleInput.value = '';
      el.quickAmountInput.value = '';
      refreshCurrentView();
      showToast(`Added "${title}" (-${currency}${amount.toFixed(2)})`, 'success');
    });

    // Dashboard "View Full History"
    el.btnGoToHistory.addEventListener('click', () => switchView('history'));

    // Dedicated Add Expense Page Presets
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        el.dedicatedTitleInput.value = chip.dataset.title || '';
        el.dedicatedAmountInput.value = chip.dataset.amt || '';
        const catId = chip.dataset.cat;
        if (catId) {
          el.dedicatedSelectedCategory.value = catId;
          document.querySelectorAll('.category-picker-item').forEach(x => {
            if (x.dataset.categoryId === catId) x.classList.add('selected');
            else x.classList.remove('selected');
          });
        }
        updateDedicatedSplit();
      });
    });

    // Dedicated Add Expense Split Toggle
    el.splitBillCheckbox.addEventListener('change', updateDedicatedSplit);
    el.dedicatedAmountInput.addEventListener('input', updateDedicatedSplit);
    el.dedicatedSplitPeople.addEventListener('input', updateDedicatedSplit);

    // Dedicated Add Expense Form Submit
    el.dedicatedExpenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = el.dedicatedTitleInput.value.trim();
      let amount = parseFloat(el.dedicatedAmountInput.value);
      const category = el.dedicatedSelectedCategory.value || 'food';
      const date = el.dedicatedDateInput.value || new Date().toISOString().slice(0, 10);
      const paymentMethod = el.dedicatedPaymentSelect.value;
      let notes = el.dedicatedNotesInput.value.trim();

      if (!title || isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid description and amount', 'danger');
        return;
      }

      // Handle split logic
      if (el.splitBillCheckbox.checked) {
        const people = Math.max(1, parseInt(el.dedicatedSplitPeople.value, 10) || 1);
        const myShare = amount / people;
        notes = `${notes ? notes + ' | ' : ''}Total bill was ${currency}${amount.toFixed(2)} split with ${people} people`;
        amount = parseFloat(myShare.toFixed(2));
      }

      const newExp = {
        id: 'exp_' + Date.now(),
        title,
        amount,
        category,
        date,
        paymentMethod,
        notes
      };

      expenses.unshift(newExp);
      StorageService.saveExpenses(expenses);

      // Reset form
      el.dedicatedExpenseForm.reset();
      el.dedicatedDateInput.value = new Date().toISOString().slice(0, 10);
      el.splitCalculationDetails.style.display = 'none';
      showToast(`Expense saved! (-${currency}${amount.toFixed(2)})`, 'success');
      switchView('dashboard');
    });

    // Top Bar "Add Expense" Button opens Modal
    el.btnOpenAddModal.addEventListener('click', () => openExpenseModal());
    el.btnCloseExpenseModal.addEventListener('click', closeExpenseModal);
    el.btnCancelExpenseModal.addEventListener('click', closeExpenseModal);

    // Expense Modal Form Submit (Edit / Add)
    el.expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = el.expenseTitleInput.value.trim();
      const amount = parseFloat(el.expenseAmountInput.value);
      const category = el.expenseCategorySelect.value;
      const date = el.expenseDateInput.value;
      const paymentMethod = el.expensePaymentSelect.value;
      const notes = el.expenseNotesInput.value.trim();

      if (!title || isNaN(amount) || amount <= 0) {
        showToast('Please provide valid description and amount', 'danger');
        return;
      }

      if (editingExpenseId) {
        const idx = expenses.findIndex(x => x.id === editingExpenseId);
        if (idx !== -1) {
          expenses[idx] = { ...expenses[idx], title, amount, category, date, paymentMethod, notes };
          showToast(`Updated "${title}"`, 'success');
        }
      } else {
        expenses.unshift({ id: 'exp_' + Date.now(), title, amount, category, date, paymentMethod, notes });
        showToast(`Added "${title}"`, 'success');
      }

      StorageService.saveExpenses(expenses);
      closeExpenseModal();
      refreshCurrentView();
    });

    // History Table Actions (Edit & Delete)
    el.expensesTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.action-btn');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const item = expenses.find(x => x.id === id);
      if (!item) return;

      if (action === 'edit') {
        openExpenseModal(item);
      } else if (action === 'delete') {
        if (confirm(`Delete "${item.title}"?`)) {
          expenses = expenses.filter(x => x.id !== id);
          StorageService.saveExpenses(expenses);
          refreshCurrentView();
          showToast(`Deleted "${item.title}"`, 'info');
        }
      }
    });

    // History Filters
    el.searchInput.addEventListener('input', (e) => {
      filters.searchQuery = e.target.value;
      renderHistory();
    });
    el.categoryFilterSelect.addEventListener('change', (e) => {
      filters.category = e.target.value;
      renderHistory();
    });
    el.paymentFilterSelect.addEventListener('change', (e) => {
      filters.paymentMethod = e.target.value;
      renderHistory();
    });
    el.sortSelect.addEventListener('change', (e) => {
      filters.sortBy = e.target.value;
      renderHistory();
    });

    // Export CSV
    el.btnExportCSV.addEventListener('click', () => {
      StorageService.exportToCSV(expenses, currency);
      showToast('CSV downloaded successfully!', 'success');
    });

    // Budget Modals
    el.btnOpenBudgetModal.addEventListener('click', openBudgetModal);
    el.btnOpenBudgetModal2.addEventListener('click', openBudgetModal);
    el.btnCloseBudgetModal.addEventListener('click', closeBudgetModal);
    el.btnCancelBudgetModal.addEventListener('click', closeBudgetModal);

    el.btnSaveBudget.addEventListener('click', () => {
      const val = parseFloat(el.budgetInput.value);
      if (isNaN(val) || val < 0) {
        showToast('Please enter a valid monthly budget amount', 'danger');
        return;
      }
      budget = val;
      StorageService.saveBudget(budget);
      closeBudgetModal();
      refreshCurrentView();
      showToast(`Monthly budget set to ${currency}${budget.toFixed(2)}`, 'success');
    });

    // Category Budgets Edit Button click
    el.categoryBudgetsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-edit-cat-budget');
      if (!btn) return;
      openCatBudgetModal(btn.dataset.catId, btn.dataset.catName, parseFloat(btn.dataset.limit) || 0);
    });

    el.btnCloseCatBudgetModal.addEventListener('click', closeCatBudgetModal);
    el.btnCancelCatBudgetModal.addEventListener('click', closeCatBudgetModal);

    el.btnSaveCatBudget.addEventListener('click', () => {
      const catId = el.editCatBudgetId.value;
      const limit = parseFloat(el.editCatBudgetAmountInput.value) || 0;
      categoryBudgets[catId] = limit;
      StorageService.saveCategoryBudgets(categoryBudgets);
      closeCatBudgetModal();
      renderBudgetView();
      showToast(`Updated ${CATEGORIES[catId]?.name || catId} budget limit`, 'success');
    });

    // Savings Goals Handlers
    el.btnOpenAddGoalModal.addEventListener('click', openGoalModal);
    el.btnCloseGoalModal.addEventListener('click', closeGoalModal);
    el.btnCancelGoalModal.addEventListener('click', closeGoalModal);

    el.goalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = el.goalTitleInput.value.trim();
      const targetAmount = parseFloat(el.goalTargetInput.value);
      const savedAmount = parseFloat(el.goalInitialSavedInput.value) || 0;
      const emoji = el.goalEmojiInput.value.trim() || '🎯';
      const targetDate = el.goalDateInput.value || '';

      if (!title || isNaN(targetAmount) || targetAmount <= 0) {
        showToast('Please provide a valid goal title and target amount', 'danger');
        return;
      }

      const newGoal = {
        id: 'goal_' + Date.now(),
        title,
        targetAmount,
        savedAmount,
        emoji,
        targetDate
      };

      savingsGoals.push(newGoal);
      StorageService.saveSavingsGoals(savingsGoals);
      closeGoalModal();
      renderSavingsView();
      showToast(`Created savings goal "${title}"!`, 'success');
    });

    // Savings Goal Actions (Deposit / Withdraw / Delete)
    el.savingsGoalsGrid.addEventListener('click', (e) => {
      const fundBtn = e.target.closest('.btn-fund-goal');
      if (fundBtn) {
        openFundGoalModal(fundBtn.dataset.id, fundBtn.dataset.action);
        return;
      }

      const delBtn = e.target.closest('.btn-delete-goal');
      if (delBtn) {
        const id = delBtn.dataset.id;
        const g = savingsGoals.find(x => x.id === id);
        if (g && confirm(`Delete savings goal "${g.title}"?`)) {
          savingsGoals = savingsGoals.filter(x => x.id !== id);
          StorageService.saveSavingsGoals(savingsGoals);
          renderSavingsView();
          showToast(`Deleted goal "${g.title}"`, 'info');
        }
      }
    });

    el.btnCloseGoalFundModal.addEventListener('click', closeFundGoalModal);
    el.btnCancelGoalFundModal.addEventListener('click', closeFundGoalModal);

    el.btnConfirmGoalFund.addEventListener('click', () => {
      const id = el.fundGoalId.value;
      const action = el.fundActionType.value;
      const amt = parseFloat(el.fundAmountInput.value);

      if (isNaN(amt) || amt <= 0) {
        showToast('Please enter a valid amount', 'danger');
        return;
      }

      const goal = savingsGoals.find(g => g.id === id);
      if (!goal) return;

      if (action === 'deposit') {
        goal.savedAmount = (parseFloat(goal.savedAmount) || 0) + amt;
        showToast(`Added ${currency}${amt.toFixed(2)} to "${goal.title}"!`, 'success');
      } else {
        goal.savedAmount = Math.max(0, (parseFloat(goal.savedAmount) || 0) - amt);
        showToast(`Withdrew ${currency}${amt.toFixed(2)} from "${goal.title}"`, 'info');
      }

      StorageService.saveSavingsGoals(savingsGoals);
      closeFundGoalModal();
      renderSavingsView();
    });

    // Profile Settings Form
    el.profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      profile = {
        studentName: el.settingStudentName.value.trim() || 'Alex Student',
        university: el.settingUniversity.value.trim() || 'State University',
        semester: el.settingSemester.value.trim() || 'Fall Semester'
      };
      StorageService.saveProfile(profile);
      renderProfileHeader();
      showToast('Profile updated successfully!', 'success');
    });

    // Data Export JSON
    el.btnExportJSON.addEventListener('click', () => {
      StorageService.exportToJSON(expenses, budget, categoryBudgets, savingsGoals, profile, currency);
      showToast('JSON backup exported!', 'success');
    });

    // Data Import JSON
    el.btnImportBackup.addEventListener('click', () => el.importFileInput.click());
    el.importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed.expenses)) {
            expenses = parsed.expenses;
            StorageService.saveExpenses(expenses);
            if (parsed.budget) {
              budget = parseFloat(parsed.budget) || budget;
              StorageService.saveBudget(budget);
            }
            if (parsed.categoryBudgets) {
              categoryBudgets = parsed.categoryBudgets;
              StorageService.saveCategoryBudgets(categoryBudgets);
            }
            if (Array.isArray(parsed.savingsGoals)) {
              savingsGoals = parsed.savingsGoals;
              StorageService.saveSavingsGoals(savingsGoals);
            }
            if (parsed.profile) {
              profile = parsed.profile;
              StorageService.saveProfile(profile);
            }
            if (parsed.currency) {
              currency = parsed.currency;
              StorageService.saveCurrency(currency);
              el.currencySelect.value = currency;
              el.settingCurrencySelect.value = currency;
            }
            refreshCurrentView();
            showToast('Backup restored successfully!', 'success');
          } else {
            showToast('Invalid backup file format.', 'danger');
          }
        } catch (err) {
          showToast('Failed to parse backup JSON file.', 'danger');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // Load Demo Data
    el.btnLoadDemo.addEventListener('click', () => {
      if (confirm('Load demo student data? This will load realistic student expenses, category budgets, and savings goals.')) {
        const demo = StorageService.generateSampleData();
        expenses = demo.expenses;
        budget = demo.budget;
        categoryBudgets = demo.categoryBudgets;
        savingsGoals = demo.savingsGoals;
        profile = demo.profile;

        StorageService.saveExpenses(expenses);
        StorageService.saveBudget(budget);
        StorageService.saveCategoryBudgets(categoryBudgets);
        StorageService.saveSavingsGoals(savingsGoals);
        StorageService.saveProfile(profile);

        refreshCurrentView();
        showToast('Sample student data loaded!', 'success');
      }
    });

    // Reset Data
    el.btnResetData.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        StorageService.resetAll();
        expenses = [];
        budget = DEFAULT_BUDGET;
        categoryBudgets = {};
        savingsGoals = [];
        refreshCurrentView();
        showToast('All data cleared.', 'info');
      }
    });

    // Close Modals on Overlay or Escape
    window.addEventListener('click', (e) => {
      if (e.target === el.expenseModalOverlay) closeExpenseModal();
      if (e.target === el.budgetModalOverlay) closeBudgetModal();
      if (e.target === el.catBudgetModalOverlay) closeCatBudgetModal();
      if (e.target === el.savingsGoalModalOverlay) closeGoalModal();
      if (e.target === el.goalFundModalOverlay) closeFundGoalModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeExpenseModal();
        closeBudgetModal();
        closeCatBudgetModal();
        closeGoalModal();
        closeFundGoalModal();
      }
    });
  }

  /**
   * App Initializer
   */
  function init() {
    // 1. Theme
    theme = StorageService.getTheme();
    document.documentElement.setAttribute('data-theme', theme);

    // 2. Preferences & Profile
    currency = StorageService.getCurrency();
    el.currencySelect.value = currency;
    el.settingCurrencySelect.value = currency;
    budget = StorageService.getBudget();
    categoryBudgets = StorageService.getCategoryBudgets();
    profile = StorageService.getProfile();

    // 3. Load or seed data
    const storedExpenses = StorageService.getExpenses();
    const storedGoals = StorageService.getSavingsGoals();

    if (storedExpenses !== null) {
      expenses = storedExpenses;
    } else {
      const demo = StorageService.generateSampleData();
      expenses = demo.expenses;
      categoryBudgets = demo.categoryBudgets;
      StorageService.saveExpenses(expenses);
      StorageService.saveCategoryBudgets(categoryBudgets);
    }

    if (storedGoals !== null) {
      savingsGoals = storedGoals;
    } else {
      const demo = StorageService.generateSampleData();
      savingsGoals = demo.savingsGoals;
      StorageService.saveSavingsGoals(savingsGoals);
    }

    // 4. Populate controls
    populateMonthSelector();
    populateCategories();
    el.dedicatedDateInput.value = new Date().toISOString().slice(0, 10);
    renderProfileHeader();

    // 5. Bind events
    bindEvents();
    updateBillSplit();
    updateDedicatedSplit();

    // 6. Start at Dashboard
    switchView('dashboard');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
