
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, XCircle } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  amount: z.coerce.number().refine(
    (val) => val !== 0,
    {
      message: "Amount cannot be zero",
    }
  ),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description must be less than 100 characters"),
  date: z.date({
    required_error: "Date is required",
  }),
  categoryId: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
}) => {
  const { categories } = useFinance();
  const [isIncome, setIsIncome] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction ? Math.abs(transaction.amount) : 0,
      description: transaction?.description || "",
      date: transaction ? new Date(transaction.date) : new Date(),
      categoryId: transaction?.categoryId || "",
    },
  });

  // Update isIncome state when transaction changes
  useEffect(() => {
    if (transaction) {
      setIsIncome(transaction.amount > 0);
    }
  }, [transaction]);

  const handleSubmit = (values: FormValues) => {
    const finalAmount = isIncome ? Math.abs(values.amount) : -Math.abs(values.amount);
    
    onSubmit({
      amount: finalAmount,
      description: values.description,
      date: format(values.date, "yyyy-MM-dd"),
      categoryId: values.categoryId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={isIncome ? "default" : "outline"}
              onClick={() => setIsIncome(true)}
            >
              Income
            </Button>
            <Button
              type="button"
              variant={!isIncome ? "default" : "outline"}
              onClick={() => setIsIncome(false)}
            >
              Expense
            </Button>
          </div>
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
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
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      field.onChange(value ? Math.abs(value) : "");
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What was this transaction for?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
                  {categories
                    .filter((category) => {
                      // Only show "Income" category for income transactions
                      // and vice versa for expense categories
                      if (isIncome) {
                        return category.name === "Income";
                      } else {
                        return category.name !== "Income";
                      }
                    })
                    .map((category) => (
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {transaction ? "Update" : "Add"} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
};
