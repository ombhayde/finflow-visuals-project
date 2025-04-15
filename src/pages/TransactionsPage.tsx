
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { TransactionList } from "@/components/transactions/TransactionList";

const TransactionsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your financial transactions
          </p>
        </div>

        <TransactionList />
      </div>
    </Layout>
  );
};

export default TransactionsPage;
