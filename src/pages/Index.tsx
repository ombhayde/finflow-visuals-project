
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { MonthlyExpensesChart } from "@/components/dashboard/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { BudgetComparisonChart } from "@/components/dashboard/BudgetComparisonChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your personal finance dashboard
          </p>
        </div>

        <SummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyExpensesChart />
          <CategoryPieChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetComparisonChart />
          <RecentTransactions />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
