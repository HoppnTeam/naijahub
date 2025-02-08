
import React from 'react';
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";

interface CartItemProps {
  item: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b">
      {item.image && (
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-20 h-20 object-cover rounded-md"
        />
      )}
      <div className="flex-1">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-primary font-semibold">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
