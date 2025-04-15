
import React, { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryForm } from "./CategoryForm";

export const CategoryList: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useFinance();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
  };

  const handleAddCategory = (data: Omit<Category, "id">) => {
    addCategory(data);
    setIsAddDialogOpen(false);
  };

  const handleUpdateCategory = (data: Omit<Category, "id">) => {
    if (editingCategory) {
      updateCategory({
        ...data,
        id: editingCategory.id,
      });
      setEditingCategory(null);
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <CardTitle className="text-2xl">Categories</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleAddCategory}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 rounded-md border"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                      <CategoryForm
                        category={editingCategory}
                        onSubmit={handleUpdateCategory}
                        onCancel={() => setEditingCategory(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-finance-danger" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-finance-danger"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          
          {filteredCategories.length === 0 && (
            <div className="col-span-full flex justify-center p-8 text-center">
              <div className="max-w-sm">
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "No categories found matching your search."
                    : "No categories yet. Create one to get started."}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
