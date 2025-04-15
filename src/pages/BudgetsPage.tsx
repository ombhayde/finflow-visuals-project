
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { BudgetList } from "@/components/budgets/BudgetList";

const BudgetsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground mt-1">
            Set and manage your monthly budget limits
          </p>
        </div>

        <BudgetList />
      </div>
    </Layout>
  );
};

export default BudgetsPage;
