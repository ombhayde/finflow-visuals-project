
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { Category } from "@/types";
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
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be less than 30 characters"),
  color: z.string().min(1, "Color is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, "id">) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      color: category?.color || "#6E59A5",
    },
  });

  const colorOptions = [
    "#6E59A5", // Purple
    "#9b87f5", // Light Purple
    "#4CAF50", // Green
    "#FFC107", // Yellow
    "#F44336", // Red
    "#2196F3", // Blue
    "#E91E63", // Pink
    "#FF9800", // Orange
    "#009688", // Teal
    "#607D8B", // Blue Grey
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <FormLabel className="text-base">
            {category ? "Edit Category" : "New Category"}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <div
                      key={color}
                      className="flex items-center justify-center"
                    >
                      <button
                        type="button"
                        className={`w-8 h-8 rounded-full ${
                          field.value === color
                            ? "ring-2 ring-primary ring-offset-2"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => field.onChange(color)}
                      />
                    </div>
                  ))}
                </div>
                <Input
                  type="color"
                  {...field}
                  className="w-full mt-2 h-10"
                />
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
            {category ? "Update" : "Add"} Category
          </Button>
        </div>
      </form>
    </Form>
  );
};
