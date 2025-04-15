
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { CategoryList } from "@/components/categories/CategoryList";

const CategoriesPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your transaction categories
          </p>
        </div>

        <CategoryList />
      </div>
    </Layout>
  );
};

export default CategoriesPage;
