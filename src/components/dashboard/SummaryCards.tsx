
import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatMonth, getCurrentMonth } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";

export const SummaryCards: React.FC = () => {
  const { transactions, getCategoryById } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const summary = React.useMemo(() => {
    const monthTransactions = transactions.filter((t) => 
      t.date.startsWith(selectedMonth)
    );
    
    const income = monthTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = Math.abs(
      monthTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    
    // Calculate top spending categories
    const expensesByCategory = monthTransactions
      .filter((t) => t.amount < 0)
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
        percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
    
    return {
      income,
      expenses,
      savings,
      savingsRate,
      topCategories,
    };
  }, [transactions, selectedMonth, getCategoryById]);

  // Get previous month data for comparison
  const getPreviousMonthData = () => {
    const [year, month] = selectedMonth.split("-");
    let prevMonth = parseInt(month) - 1;
    let prevYear = parseInt(year);
    
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    
    const prevMonthString = `${prevYear}-${prevMonth.toString().padStart(2, "0")}`;
    
    const prevMonthTransactions = transactions.filter((t) => 
      t.date.startsWith(prevMonthString)
    );
    
    const prevIncome = prevMonthTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const prevExpenses = Math.abs(
      prevMonthTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    return {
      income: prevIncome,
      expenses: prevExpenses,
    };
  };

  const previousData = getPreviousMonthData();

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const incomeChange = getPercentageChange(summary.income, previousData.income);
  const expenseChange = getPercentageChange(summary.expenses, previousData.expenses);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="w-full shadow-sm bg-gradient-to-br from-finance-secondary/10 to-finance-primary/5">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(summary.income)}
              </p>
              <div className="flex items-center mt-2">
                <div
                  className={cn(
                    "text-xs flex items-center",
                    incomeChange >= 0 ? "text-finance-success" : "text-finance-danger"
                  )}
                >
                  {incomeChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(incomeChange).toFixed(1)}% from last month
                </div>
              </div>
            </div>
            <div className="p-2 bg-finance-secondary/20 rounded-full">
              <DollarSign className="h-5 w-5 text-finance-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-sm bg-gradient-to-br from-finance-danger/10 to-finance-danger/5">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(summary.expenses)}
              </p>
              <div className="flex items-center mt-2">
                <div
                  className={cn(
                    "text-xs flex items-center",
                    expenseChange <= 0 ? "text-finance-success" : "text-finance-danger"
                  )}
                >
                  {expenseChange <= 0 ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(expenseChange).toFixed(1)}% from last month
                </div>
              </div>
            </div>
            <div className="p-2 bg-finance-danger/20 rounded-full">
              <CreditCard className="h-5 w-5 text-finance-danger" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-sm bg-gradient-to-br from-finance-success/10 to-finance-success/5">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Net Savings</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(summary.savings)}
              </p>
              <div className="flex items-center mt-2">
                <div className="text-xs text-muted-foreground">
                  {summary.savingsRate.toFixed(1)}% of income
                </div>
              </div>
            </div>
            <div className="p-2 bg-finance-success/20 rounded-full">
              <ArrowUpRight className="h-5 w-5 text-finance-success" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
