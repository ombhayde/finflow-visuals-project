
export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // Format: YYYY-MM
};

export type SummaryData = {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  topCategories: {
    categoryId: string;
    amount: number;
    percentage: number;
  }[];
};
