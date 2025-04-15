
import { Category, Transaction, Budget } from "../types";

export const initialCategories: Category[] = [
  { id: "cat-1", name: "Housing", color: "#6E59A5" },
  { id: "cat-2", name: "Food", color: "#9b87f5" },
  { id: "cat-3", name: "Transportation", color: "#4CAF50" },
  { id: "cat-4", name: "Entertainment", color: "#FFC107" },
  { id: "cat-5", name: "Shopping", color: "#F44336" },
  { id: "cat-6", name: "Utilities", color: "#2196F3" },
  { id: "cat-7", name: "Healthcare", color: "#E91E63" },
  { id: "cat-8", name: "Income", color: "#4CAF50" },
];

export const initialTransactions: Transaction[] = [
  {
    id: "txn-1",
    amount: -800,
    description: "Monthly Rent",
    date: "2025-03-01",
    categoryId: "cat-1",
  },
  {
    id: "txn-2",
    amount: -120,
    description: "Grocery Shopping",
    date: "2025-03-05",
    categoryId: "cat-2",
  },
  {
    id: "txn-3",
    amount: -50,
    description: "Gas",
    date: "2025-03-10",
    categoryId: "cat-3",
  },
  {
    id: "txn-4",
    amount: -30,
    description: "Movie Tickets",
    date: "2025-03-15",
    categoryId: "cat-4",
  },
  {
    id: "txn-5",
    amount: -75,
    description: "New Clothes",
    date: "2025-03-18",
    categoryId: "cat-5",
  },
  {
    id: "txn-6",
    amount: -100,
    description: "Electric Bill",
    date: "2025-03-20",
    categoryId: "cat-6",
  },
  {
    id: "txn-7",
    amount: -200,
    description: "Doctor's Appointment",
    date: "2025-03-22",
    categoryId: "cat-7",
  },
  {
    id: "txn-8",
    amount: 2500,
    description: "Salary",
    date: "2025-03-25",
    categoryId: "cat-8",
  },
  {
    id: "txn-9",
    amount: -60,
    description: "Dinner Out",
    date: "2025-04-02",
    categoryId: "cat-2",
  },
  {
    id: "txn-10",
    amount: -40,
    description: "Gas",
    date: "2025-04-05",
    categoryId: "cat-3",
  },
  {
    id: "txn-11",
    amount: -800,
    description: "Monthly Rent",
    date: "2025-04-01",
    categoryId: "cat-1",
  },
  {
    id: "txn-12",
    amount: 2500,
    description: "Salary",
    date: "2025-04-25",
    categoryId: "cat-8",
  },
];

export const initialBudgets: Budget[] = [
  { id: "budget-1", categoryId: "cat-1", amount: 1000, month: "2025-04" },
  { id: "budget-2", categoryId: "cat-2", amount: 300, month: "2025-04" },
  { id: "budget-3", categoryId: "cat-3", amount: 150, month: "2025-04" },
  { id: "budget-4", categoryId: "cat-4", amount: 100, month: "2025-04" },
  { id: "budget-5", categoryId: "cat-5", amount: 200, month: "2025-04" },
  { id: "budget-6", categoryId: "cat-6", amount: 150, month: "2025-04" },
  { id: "budget-7", categoryId: "cat-7", amount: 100, month: "2025-04" },
];
