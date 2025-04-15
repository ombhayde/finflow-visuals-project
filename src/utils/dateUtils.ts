
import { format, parse, isValid } from "date-fns";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatMonth = (yearMonth: string): string => {
  const [year, month] = yearMonth.split("-");
  return format(new Date(parseInt(year), parseInt(month) - 1), "MMMM yyyy");
};

export const getCurrentMonth = (): string => {
  return format(new Date(), "yyyy-MM");
};

export const parseInputDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  if (isValid(date)) {
    return date;
  }
  return null;
};

export const getMonthYearOptions = (): { value: string; label: string }[] => {
  const currentDate = new Date();
  const options = [];
  
  // Generate options for the last 6 months and next 6 months
  for (let i = -6; i <= 6; i++) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() + i);
    
    const value = format(date, "yyyy-MM");
    const label = format(date, "MMMM yyyy");
    
    options.push({ value, label });
  }
  
  return options;
};
