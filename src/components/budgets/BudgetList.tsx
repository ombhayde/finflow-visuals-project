import React, { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Budget } from "@/types";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BudgetForm } from "./BudgetForm";
import { formatCurrency, formatMonth, getCurrentMonth } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";

export const BudgetList: React.FC = () => {
  const {
    budgets,
    categories,
    getCategoryById,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetVsActual,
  } = useFinance();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const budgetData = React.useMemo(() => {
    return getBudgetVsActual(selectedMonth);
  }, [getBudgetVsActual, selectedMonth]);

  const handleAddBudget = (data: Omit<Budget, "id">) => {
    addBudget(data);
    setIsAddDialogOpen(false);
  };

  const handleUpdateBudget = (data: Omit<Budget, "id">) => {
    if (editingBudget) {
      updateBudget({
        ...data,
        id: editingBudget.id,
      });
      setEditingBudget(null);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
  };

  const handleDelete = (id: string) => {
    deleteBudget(id);
  };

  const getBudgetStatus = (budgeted: number, actual: number) => {
    const percentage = (actual / budgeted) * 100;
    
    if (percentage < 50) {
      return {
        color: "bg-finance-success",
        label: "On Track",
      };
    }
    if (percentage < 80) {
      return {
        color: "bg-finance-warning",
        label: "Getting Close",
      };
    }
    if (percentage < 100) {
      return {
        color: "bg-finance-warning",
        label: "Near Limit",
      };
    }
    return {
      color: "bg-finance-danger",
      label: "Over Budget",
    };
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <CardTitle className="text-2xl">Budget Management</CardTitle>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Budget</DialogTitle>
              </DialogHeader>
              <BudgetForm
                onSubmit={handleAddBudget}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgetData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No budgets set for {formatMonth(selectedMonth)}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Set Up Your First Budget
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Category</TableHead>
                    <TableHead className="text-right">Budgeted</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.map((item) => {
                    const category = getCategoryById(item.categoryId);
                    if (!category) return null;
                    
                    const remaining = item.budgeted - item.actual;
                    const percentage = Math.min(
                      Math.round((item.actual / item.budgeted) * 100),
                      100
                    );
                    const status = getBudgetStatus(item.budgeted, item.actual);
                    
                    const budget = budgets.find(
                      (b) =>
                        b.categoryId === item.categoryId && b.month === selectedMonth
                    );
                    
                    return (
                      <TableRow key={item.categoryId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.budgeted)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.actual)}
                        </TableCell>
                        <TableCell
                          className={cn("text-right font-medium", {
                            "text-finance-danger": remaining < 0,
                            "text-finance-success": remaining >= 0,
                          })}
                        >
                          {formatCurrency(remaining)}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="flex flex-col gap-1">
                            <Progress
                              value={percentage}
                              className={`h-2 ${status.color}`}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{percentage}%</span>
                              <span>{status.label}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {budget && (
                            <div className="flex justify-end space-x-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleEdit(budget)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Budget</DialogTitle>
                                  </DialogHeader>
                                  {editingBudget && (
                                    <BudgetForm
                                      budget={editingBudget}
                                      onSubmit={handleUpdateBudget}
                                      onCancel={() => setEditingBudget(null)}
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
                                    onClick={() => handleDelete(budget.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
