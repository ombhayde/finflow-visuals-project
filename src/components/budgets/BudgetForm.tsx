
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Budget } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { getMonthYearOptions } from "@/utils/dateUtils";

const formSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  month: z.string().min(1, "Month is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (data: Omit<Budget, "id">) => void;
  onCancel: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  budget,
  onSubmit,
  onCancel,
}) => {
  const { categories } = useFinance();
  const [availableCategories, setAvailableCategories] = useState(categories);
  const monthOptions = getMonthYearOptions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: budget?.categoryId || "",
      amount: budget?.amount || 0,
      month: budget?.month || monthOptions[6].value, // Default to current month
    },
  });

  // Filter out the "Income" category
  useEffect(() => {
    setAvailableCategories(
      categories.filter((category) => category.name !== "Income")
    );
  }, [categories]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <FormLabel className="text-base">
            {budget ? "Edit Budget" : "New Budget"}
          </FormLabel>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancel}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>

        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCategories.map((category) => (
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {budget ? "Update" : "Add"} Budget
          </Button>
        </div>
      </form>
    </Form>
  );
};
