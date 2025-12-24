"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type UploadFormData = {
  category: string;
  amount: string;
  date: string;
  description: string;
  file: File | null;
};

interface UploadFormFieldsProps {
  form: UseFormReturn<UploadFormData>;
}

const TAX_CATEGORIES = [
  { value: "income-tax", label: "Income Tax" },
  { value: "food", label: "Food" },
  { value: "travel", label: "Travel" },
  { value: "health-care", label: "health & Care" },
  { value: "utilities", label: "Utilities" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "property-tax", label: "Property tax" },
  { value: "others", label: "Others" },
];

export function UploadFormFields({ form }: UploadFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Category Field */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tax Category *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TAX_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Amount Field */}
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount (PKR) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                className="transition-all focus:ring-2 focus:ring-primary/20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date Field */}
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date *</FormLabel>
            <FormControl>
              <Input
                type="date"
                className="transition-all focus:ring-2 focus:ring-primary/20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description Field */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add any additional notes..."
                className="min-h-[100px] resize-none transition-all focus:ring-2 focus:ring-primary/20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
