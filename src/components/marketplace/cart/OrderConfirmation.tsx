import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export const OrderConfirmation = ({
  isOpen,
  onClose,
  orderId,
}: OrderConfirmationProps) => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate('/profile/orders');
    onClose();
  };

  const handleContinueShopping = () => {
    navigate('/marketplace');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Order Confirmed!</DialogTitle>
          <DialogDescription className="text-center">
            Thank you for your purchase. Your order has been received and is being processed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground">Order Reference</p>
            <p className="font-medium">{orderId}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm">
              We've sent a confirmation email with your order details and tracking information.
            </p>
            <p className="text-sm">
              You can track your order status in your account under "My Orders".
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="sm:flex-1" 
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
          <Button 
            className="sm:flex-1" 
            onClick={handleViewOrders}
          >
            View My Orders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
