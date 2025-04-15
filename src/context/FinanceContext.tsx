
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Category, 
  Transaction, 
  Budget, 
  SummaryData 
} from "../types";
import { 
  initialCategories, 
  initialTransactions, 
  initialBudgets 
} from "../data/mockData";
import { toast } from "sonner";

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  summary: SummaryData;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, "id">) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getBudgetByCategoryId: (categoryId: string, month: string) => Budget | undefined;
  getTransactionsByMonth: (month: string) => Transaction[];
  getExpensesByCategory: (month: string) => { categoryId: string, amount: number }[];
  getBudgetVsActual: (month: string) => { categoryId: string, budgeted: number, actual: number }[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    topCategories: [],
  });

  // Load initial data
  useEffect(() => {
    setTransactions(initialTransactions);
    setCategories(initialCategories);
    setBudgets(initialBudgets);
  }, []);

  // Update summary whenever transactions change
  useEffect(() => {
    const totalIncome = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = Math.abs(
      transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    const netSavings = totalIncome - totalExpenses;
    
    // Calculate top spending categories
    const expensesByCategory = transactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        const categoryId = t.categoryId;
        if (!acc[categoryId]) {
          acc[categoryId] = 0;
        }
        acc[categoryId] += Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);
    
    const topCategories = Object.entries(expensesByCategory)
      .map(([categoryId, amount]) => ({
        categoryId,
        amount,
        percentage: totalExpenses ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);  // Top 5 categories
    
    setSummary({
      totalIncome,
      totalExpenses,
      netSavings,
      topCategories,
    });
  }, [transactions]);

  // Transaction operations
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
    };
    setTransactions([...transactions, newTransaction]);
    toast.success("Transaction added successfully");
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(
      transactions.map((t) => (t.id === transaction.id ? transaction : t))
    );
    toast.success("Transaction updated successfully");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast.success("Transaction deleted successfully");
  };

  // Category operations
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    setCategories([...categories, newCategory]);
    toast.success("Category added successfully");
  };

  const updateCategory = (category: Category) => {
    setCategories(
      categories.map((c) => (c.id === category.id ? category : c))
    );
    toast.success("Category updated successfully");
  };

  const deleteCategory = (id: string) => {
    // Check if category is in use
    const isInUse = transactions.some((t) => t.categoryId === id);
    if (isInUse) {
      toast.error("Cannot delete category that is in use by transactions");
      return;
    }
    
    setCategories(categories.filter((c) => c.id !== id));
    setBudgets(budgets.filter((b) => b.categoryId !== id));
    toast.success("Category deleted successfully");
  };

  // Budget operations
  const addBudget = (budget: Omit<Budget, "id">) => {
    // Check if budget already exists for this category and month
    const existingBudget = budgets.find(
      (b) => b.categoryId === budget.categoryId && b.month === budget.month
    );
    
    if (existingBudget) {
      toast.error("Budget already exists for this category and month");
      return;
    }
    
    const newBudget = {
      ...budget,
      id: `budget-${Date.now()}`,
    };
    
    setBudgets([...budgets, newBudget]);
    toast.success("Budget added successfully");
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(
      budgets.map((b) => (b.id === budget.id ? budget : b))
    );
    toast.success("Budget updated successfully");
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter((b) => b.id !== id));
    toast.success("Budget deleted successfully");
  };

  // Helper functions
  const getCategoryById = (id: string) => {
    return categories.find((c) => c.id === id);
  };

  const getBudgetByCategoryId = (categoryId: string, month: string) => {
    return budgets.find(
      (b) => b.categoryId === categoryId && b.month === month
    );
  };

  const getTransactionsByMonth = (month: string) => {
    return transactions.filter((t) => t.date.startsWith(month));
  };

  const getExpensesByCategory = (month: string) => {
    const monthTransactions = getTransactionsByMonth(month).filter(
      (t) => t.amount < 0
    );
    
    const expensesByCategory: Record<string, number> = {};
    
    monthTransactions.forEach((t) => {
      if (!expensesByCategory[t.categoryId]) {
        expensesByCategory[t.categoryId] = 0;
      }
      expensesByCategory[t.categoryId] += Math.abs(t.amount);
    });
    
    return Object.entries(expensesByCategory).map(([categoryId, amount]) => ({
      categoryId,
      amount,
    }));
  };

  const getBudgetVsActual = (month: string) => {
    const expensesByCategory = getExpensesByCategory(month).reduce(
      (acc, { categoryId, amount }) => {
        acc[categoryId] = amount;
        return acc;
      },
      {} as Record<string, number>
    );
    
    return budgets
      .filter((b) => b.month === month)
      .map((budget) => ({
        categoryId: budget.categoryId,
        budgeted: budget.amount,
        actual: expensesByCategory[budget.categoryId] || 0,
      }));
  };

  const value = {
    transactions,
    categories,
    budgets,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    getCategoryById,
    getBudgetByCategoryId,
    getTransactionsByMonth,
    getExpensesByCategory,
    getBudgetVsActual,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
