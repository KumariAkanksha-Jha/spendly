/**
 * storage.js - LocalStorage management and data import/export for Spendly
 */

const STORAGE_KEYS = {
  EXPENSES: 'spendly_expenses',
  BUDGET: 'spendly_budget',
  CATEGORY_BUDGETS: 'spendly_category_budgets',
  SAVINGS_GOALS: 'spendly_savings_goals',
  PROFILE: 'spendly_profile',
  CURRENCY: 'spendly_currency',
  THEME: 'spendly_theme'
};

const DEFAULT_BUDGET = 650; // default monthly student budget
const DEFAULT_CURRENCY = '$';

// Categories tailored for student lifestyle
const CATEGORIES = {
  food: { id: 'food', name: 'Food & Canteen', icon: '🍔', badgeClass: 'badge-food', color: '#ea580c' },
  rent: { id: 'rent', name: 'Rent & Hostel', icon: '🏠', badgeClass: 'badge-rent', color: '#9333ea' },
  books: { id: 'books', name: 'Books & Supplies', icon: '📚', badgeClass: 'badge-books', color: '#2563eb' },
  tuition: { id: 'tuition', name: 'Tuition & Fees', icon: '🎓', badgeClass: 'badge-tuition', color: '#0d9488' },
  transport: { id: 'transport', name: 'Bus & Metro', icon: '🚌', badgeClass: 'badge-transport', color: '#0284c7' },
  entertainment: { id: 'entertainment', name: 'Outings & Fun', icon: '🍿', badgeClass: 'badge-entertainment', color: '#db2777' },
  personal: { id: 'personal', name: 'Personal Care', icon: '👕', badgeClass: 'badge-personal', color: '#7c3aed' },
  utilities: { id: 'utilities', name: 'Wifi & Bills', icon: '💡', badgeClass: 'badge-utilities', color: '#ca8a04' },
  misc: { id: 'misc', name: 'Miscellaneous', icon: '📦', badgeClass: 'badge-misc', color: '#475569' }
};

const StorageService = {
  // Expenses
  getExpenses() {
    try {
      // Check current key or legacy key
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES) || localStorage.getItem('student_tracker_expenses');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load expenses', e);
      return null;
    }
  },

  saveExpenses(expenses) {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Monthly Budget
  getBudget() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.BUDGET) || localStorage.getItem('student_tracker_budget');
      return val !== null ? parseFloat(val) : DEFAULT_BUDGET;
    } catch (e) {
      return DEFAULT_BUDGET;
    }
  },

  saveBudget(budget) {
    localStorage.setItem(STORAGE_KEYS.BUDGET, budget.toString());
  },

  // Category Budgets
  getCategoryBudgets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORY_BUDGETS);
      if (data) return JSON.parse(data);
      // Default initial allocations
      return {
        food: 200,
        rent: 250,
        books: 50,
        transport: 40,
        entertainment: 50,
        utilities: 30,
        personal: 30
      };
    } catch (e) {
      return {};
    }
  },

  saveCategoryBudgets(catBudgets) {
    localStorage.setItem(STORAGE_KEYS.CATEGORY_BUDGETS, JSON.stringify(catBudgets));
  },

  // Savings Goals
  getSavingsGoals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveSavingsGoals(goals) {
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
  },

  // Profile
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : {
        studentName: 'Alex Student',
        university: 'State University',
        semester: 'Fall Semester'
      };
    } catch (e) {
      return { studentName: 'Alex Student', university: 'State University', semester: 'Fall Semester' };
    }
  },

  saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  // Currency & Theme
  getCurrency() {
    return localStorage.getItem(STORAGE_KEYS.CURRENCY) || localStorage.getItem('student_tracker_currency') || DEFAULT_CURRENCY;
  },

  saveCurrency(currency) {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  },

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || localStorage.getItem('student_tracker_theme') || 'light';
  },

  saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  /**
   * Sample Data Generator for initial state or demo
   */
  generateSampleData() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');

    const sampleExpenses = [
      { id: 'exp_1', title: 'College Canteen Lunch & Chai', amount: 8.50, category: 'food', date: `${yyyy}-${mm}-02`, paymentMethod: 'UPI/Card', notes: 'Lunch with study group' },
      { id: 'exp_2', title: 'Data Structures Textbook & Spiral Notebooks', amount: 45.00, category: 'books', date: `${yyyy}-${mm}-04`, paymentMethod: 'Online', notes: 'Semester 3 book list' },
      { id: 'exp_3', title: 'Monthly Student Metro Pass', amount: 35.00, category: 'transport', date: `${yyyy}-${mm}-05`, paymentMethod: 'Card', notes: 'Unlimited student commute' },
      { id: 'exp_4', title: 'Hostel Room Rent (Shared Share)', amount: 220.00, category: 'rent', date: `${yyyy}-${mm}-06`, paymentMethod: 'Bank Transfer', notes: 'Monthly split with roommate' },
      { id: 'exp_5', title: 'High-speed Wifi Bill Share', amount: 15.00, category: 'utilities', date: `${yyyy}-${mm}-08`, paymentMethod: 'UPI/Card', notes: '3-way split with roommates' },
      { id: 'exp_6', title: 'Weekend Movie & Popcorn Outing', amount: 18.25, category: 'entertainment', date: `${yyyy}-${mm}-10`, paymentMethod: 'Cash', notes: 'Watched new release with friends' },
      { id: 'exp_7', title: 'Laundry Detergent & Toiletries', amount: 14.50, category: 'personal', date: `${yyyy}-${mm}-12`, paymentMethod: 'UPI/Card', notes: 'Supermarket essentials' },
      { id: 'exp_8', title: 'Late Night Coding Coffee & Snacks', amount: 9.75, category: 'food', date: `${yyyy}-${mm}-15`, paymentMethod: 'Cash', notes: 'Exam prep fuel' },
      { id: 'exp_9', title: 'Spotify Student Premium', amount: 5.99, category: 'entertainment', date: `${yyyy}-${mm}-16`, paymentMethod: 'Online', notes: 'Discounted student plan' }
    ];

    const sampleGoals = [
      {
        id: 'goal_1',
        title: 'New Coding Laptop (M3 / ThinkPad)',
        targetAmount: 900,
        savedAmount: 520,
        targetDate: `${yyyy}-12-15`,
        emoji: '💻',
        notes: 'Saving for computer science project requirements'
      },
      {
        id: 'goal_2',
        title: 'Semester End Beach Roadtrip',
        targetAmount: 250,
        savedAmount: 175,
        targetDate: `${yyyy}-11-20`,
        emoji: '🏖️',
        notes: 'Hostel friends weekend getaway'
      },
      {
        id: 'goal_3',
        title: 'Emergency Student Cushion',
        targetAmount: 300,
        savedAmount: 140,
        targetDate: `${yyyy + 1}-03-01`,
        emoji: '🛡️',
        notes: 'Rainy day fund for unexpected college expenses'
      }
    ];

    const sampleCategoryBudgets = {
      food: 180,
      rent: 230,
      books: 60,
      transport: 45,
      entertainment: 50,
      utilities: 25,
      personal: 30,
      misc: 30
    };

    return {
      expenses: sampleExpenses,
      budget: DEFAULT_BUDGET,
      categoryBudgets: sampleCategoryBudgets,
      savingsGoals: sampleGoals,
      profile: {
        studentName: 'Alex Student',
        university: 'State University',
        semester: 'Fall Semester'
      }
    };
  },

  exportToCSV(expenses, currency) {
    if (!expenses || expenses.length === 0) {
      alert('No expense records to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Description', 'Category', `Amount (${currency})`, 'Payment Method', 'Notes'];
    const rows = expenses.map(exp => [
      `"${exp.id || ''}"`,
      `"${exp.date || ''}"`,
      `"${(exp.title || '').replace(/"/g, '""')}"`,
      `"${CATEGORIES[exp.category]?.name || exp.category || ''}"`,
      parseFloat(exp.amount || 0).toFixed(2),
      `"${exp.paymentMethod || 'Cash'}"`,
      `"${(exp.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `spendly_expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportToJSON(expenses, budget, categoryBudgets, savingsGoals, profile, currency) {
    const backupData = {
      appName: 'Spendly',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      budget,
      categoryBudgets,
      savingsGoals,
      profile,
      currency,
      expenses
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `spendly_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.BUDGET);
    localStorage.removeItem(STORAGE_KEYS.CATEGORY_BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.SAVINGS_GOALS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem('student_tracker_expenses');
    localStorage.removeItem('student_tracker_budget');
  }
};
