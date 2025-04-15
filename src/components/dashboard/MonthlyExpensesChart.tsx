
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatMonth, getCurrentMonth } from "@/utils/dateUtils";

export const MonthlyExpensesChart: React.FC = () => {
  const { transactions, categories, getCategoryById } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const chartData = React.useMemo(() => {
    // Filter transactions for the selected month
    const monthlyTransactions = transactions.filter(
      (t) => t.date.startsWith(selectedMonth) && t.amount < 0
    );

    // Group by category and calculate totals
    const categoryTotals = monthlyTransactions.reduce((acc, transaction) => {
      const category = getCategoryById(transaction.categoryId);
      if (!category) return acc;

      if (!acc[category.id]) {
        acc[category.id] = {
          name: category.name,
          color: category.color,
          amount: 0,
        };
      }
      
      acc[category.id].amount += Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, { name: string; color: string; amount: number }>);

    // Convert to array and sort by amount
    return Object.values(categoryTotals)
      .sort((a, b) => b.amount - a.amount)
      .map((item) => ({
        ...item,
        amount: parseFloat(item.amount.toFixed(2)),
      }));
  }, [transactions, categories, selectedMonth, getCategoryById]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p>{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between pb-2">
        <CardTitle className="text-xl">Monthly Expenses</CardTitle>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {["2025-03", "2025-04", "2025-05"].map((month) => (
              <SelectItem key={month} value={month}>
                {formatMonth(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No expense data available for {formatMonth(selectedMonth)}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                  height={60}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value).replace("$", "")}
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="amount"
                  name="Amount"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <rect
                      key={`rect-${index}`}
                      fill={entry.color}
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
