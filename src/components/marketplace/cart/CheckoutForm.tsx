import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark, Truck } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  paymentMethod: z.enum(["card", "bank", "delivery"], {
    required_error: "Please select a payment method",
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  deliveryNotes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => void;
  isSubmitting: boolean;
}

export const CheckoutForm = ({ onSubmit, isSubmitting }: CheckoutFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      paymentMethod: "card",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      deliveryNotes: "",
    },
  });

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    form.setValue("paymentMethod", value as "card" | "bank" | "delivery");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+234 800 000 0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Shipping Information</h3>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter your delivery address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Lagos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="oyo">Oyo</SelectItem>
                        <SelectItem value="kaduna">Kaduna</SelectItem>
                        <SelectItem value="enugu">Enugu</SelectItem>
                        <SelectItem value="delta">Delta</SelectItem>
                        <SelectItem value="anambra">Anambra</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Method</h3>
          <RadioGroup
            value={paymentMethod}
            onValueChange={handlePaymentMethodChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                <span>Credit/Debit Card</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                <Landmark className="h-4 w-4" />
                <span>Bank Transfer</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="delivery" id="delivery" />
              <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer">
                <Truck className="h-4 w-4" />
                <span>Pay on Delivery</span>
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "card" && (
            <div className="space-y-4 p-4 border rounded-md">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cardExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardCvc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {paymentMethod === "delivery" && (
            <FormField
              control={form.control}
              name="deliveryNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special instructions for delivery" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Complete Order"}
        </Button>
      </form>
    </Form>
  );
};
