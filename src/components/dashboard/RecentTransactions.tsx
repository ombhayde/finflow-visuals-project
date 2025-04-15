
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, formatCurrency } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";

export const RecentTransactions: React.FC = () => {
  const { transactions, getCategoryById } = useFinance();

  // Get recent transactions, sorted by date (newest first)
  const recentTransactions = React.useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
          {recentTransactions.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No recent transactions
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  categoryName={getCategoryById(transaction.categoryId)?.name || "Uncategorized"}
                  categoryColor={getCategoryById(transaction.categoryId)?.color || "#cccccc"}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const TransactionItem: React.FC<{
  transaction: Transaction;
  categoryName: string;
  categoryColor: string;
}> = ({ transaction, categoryName, categoryColor }) => {
  const isIncome = transaction.amount > 0;

  return (
    <div className="flex justify-between items-center p-3 rounded-md border">
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: categoryColor }}
        />
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center space-x-2">
            <p className="text-xs text-muted-foreground">{categoryName}</p>
            <span className="text-xs text-muted-foreground">•</span>
            <p className="text-xs text-muted-foreground">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>
      </div>
      <p
        className={cn("font-medium", {
          "text-finance-success": isIncome,
          "text-finance-danger": !isIncome,
        })}
      >
        {formatCurrency(transaction.amount)}
      </p>
    </div>
  );
};
