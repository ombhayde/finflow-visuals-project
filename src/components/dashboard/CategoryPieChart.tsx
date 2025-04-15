
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
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

export const CategoryPieChart: React.FC = () => {
  const { getExpensesByCategory, getCategoryById } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const chartData = React.useMemo(() => {
    const categoryExpenses = getExpensesByCategory(selectedMonth);
    
    return categoryExpenses
      .map((item) => {
        const category = getCategoryById(item.categoryId);
        return {
          name: category?.name || "Unknown",
          value: item.amount,
          color: category?.color || "#cccccc",
        };
      })
      .filter((item) => item.value > 0) // Filter out zero values
      .sort((a, b) => b.value - a.value);
  }, [getExpensesByCategory, getCategoryById, selectedMonth]);

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      
      return (
        <div className="bg-card p-3 border rounded-md shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p>{formatCurrency(data.value)} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between pb-2">
        <CardTitle className="text-xl">Spending by Category</CardTitle>
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
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  content={renderLegend}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
