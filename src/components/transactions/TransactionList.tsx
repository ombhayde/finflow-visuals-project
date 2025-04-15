import React, { useState } from "react";
import { 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Plus,
  Search,
  Calendar 
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/types";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TransactionForm } from "./TransactionForm";
import { formatDate, formatCurrency, getCurrentMonth, formatMonth } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";

export const TransactionList: React.FC = () => {
  const { 
    transactions, 
    categories, 
    getCategoryById,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance();

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "date",
    direction: "descending",
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = React.useMemo(() => {
    let result = [...transactions];

    // Filter by month
    if (selectedMonth) {
      result = result.filter((transaction) => 
        transaction.date.startsWith(selectedMonth)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(query) ||
          formatCurrency(transaction.amount).toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter(
        (transaction) => transaction.categoryId === selectedCategory
      );
    }

    // Filter by exact date (if applicable)
    if (dateFilter) {
      const dateString = dateFilter.toISOString().split("T")[0];
      result = result.filter(
        (transaction) => transaction.date === dateString
      );
    }

    // Sort
    result.sort((a, b) => {
      let compareResult = 0;
      
      if (sortConfig.key === "date") {
        compareResult = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortConfig.key === "amount") {
        compareResult = a.amount - b.amount;
      } else if (sortConfig.key === "description") {
        compareResult = a.description.localeCompare(b.description);
      } else if (sortConfig.key === "category") {
        const categoryA = getCategoryById(a.categoryId)?.name || "";
        const categoryB = getCategoryById(b.categoryId)?.name || "";
        compareResult = categoryA.localeCompare(categoryB);
      }
      
      return sortConfig.direction === "ascending" ? compareResult : -compareResult;
    });
    
    return result;
  }, [
    transactions,
    selectedMonth,
    searchQuery,
    selectedCategory,
    dateFilter,
    sortConfig,
    getCategoryById,
  ]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  const handleAddTransaction = (data: Omit<Transaction, "id">) => {
    addTransaction(data);
    setIsAddDialogOpen(false);
  };

  const handleUpdateTransaction = (data: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      updateTransaction({
        ...data,
        id: editingTransaction.id,
      });
      setEditingTransaction(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setDateFilter(null);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <CardTitle className="text-2xl">Transactions</CardTitle>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[180px]">
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
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Category filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[150px] md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Date filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={dateFilter || undefined}
                  onSelect={setDateFilter}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            {/* Reset filters */}
            {(searchQuery || selectedCategory || dateFilter) && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Transactions table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[120px] cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {getSortIcon("date")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center">
                    Description
                    {getSortIcon("description")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    {getSortIcon("category")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    {getSortIcon("amount")}
                  </div>
                </TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedTransactions.map((transaction) => {
                  const category = getCategoryById(transaction.categoryId);
                  
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {category && (
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            />
                          )}
                          {category?.name || "Uncategorized"}
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn("text-right font-medium", {
                          "text-finance-success": transaction.amount > 0,
                          "text-finance-danger": transaction.amount < 0,
                        })}
                      >
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end items-center space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(transaction)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Transaction</DialogTitle>
                              </DialogHeader>
                              {editingTransaction && (
                                <TransactionForm
                                  transaction={editingTransaction}
                                  onSubmit={handleUpdateTransaction}
                                  onCancel={() => setEditingTransaction(null)}
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
                                onClick={() => handleDelete(transaction.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
