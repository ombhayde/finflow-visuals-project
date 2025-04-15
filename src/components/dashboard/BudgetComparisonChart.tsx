
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
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

export const BudgetComparisonChart: React.FC = () => {
  const { getBudgetVsActual, getCategoryById } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const chartData = React.useMemo(() => {
    return getBudgetVsActual(selectedMonth)
      .map((item) => {
        const category = getCategoryById(item.categoryId);
        return {
          name: category?.name || "Unknown",
          budgeted: item.budgeted,
          actual: item.actual,
          color: category?.color || "#cccccc",
        };
      })
      .sort((a, b) => {
        // Calculate percentage of budget used
        const percentA = a.budgeted ? a.actual / a.budgeted : 0;
        const percentB = b.budgeted ? b.actual / b.budgeted : 0;
        return percentB - percentA;
      });
  }, [getBudgetVsActual, getCategoryById, selectedMonth]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budgeted = payload.find((p: any) => p.name === "Budgeted");
      const actual = payload.find((p: any) => p.name === "Actual");
      
      if (budgeted && actual) {
        const percentage = ((actual.value / budgeted.value) * 100).toFixed(1);
        const remaining = budgeted.value - actual.value;
        
        return (
          <div className="bg-card p-3 border rounded-md shadow-sm">
            <p className="font-medium">{label}</p>
            <p>Budgeted: {formatCurrency(budgeted.value)}</p>
            <p>Spent: {formatCurrency(actual.value)}</p>
            <p>
              Remaining: {formatCurrency(remaining)}{" "}
              <span className={remaining < 0 ? "text-finance-danger" : "text-finance-success"}>
                ({percentage}%)
              </span>
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between pb-2">
        <CardTitle className="text-xl">Budget vs. Actual</CardTitle>
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
              No budget data available for {formatMonth(selectedMonth)}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 20,
                  left: 70,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value) => formatCurrency(value).replace("$", "")}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={70}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="budgeted"
                  name="Budgeted"
                  fill="#9b87f5"
                  opacity={0.6}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="actual"
                  name="Actual"
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => {
                    const isOverBudget = entry.actual > entry.budgeted;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isOverBudget ? "#F44336" : "#4CAF50"}
                      />
                    );
                  })}
                </Bar>
                <ReferenceLine x={0} stroke="#666" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
