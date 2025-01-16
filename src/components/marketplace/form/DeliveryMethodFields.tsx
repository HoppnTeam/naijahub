import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PAYMENT_METHODS = ["online", "cash_on_delivery", "in_person"] as const;
const DELIVERY_METHODS = ["shipping", "pickup", "both"] as const;

interface DeliveryMethodFieldsProps {
  paymentMethods: typeof PAYMENT_METHODS[number][];
  setPaymentMethods: (methods: typeof PAYMENT_METHODS[number][]) => void;
  deliveryMethod: typeof DELIVERY_METHODS[number];
  setDeliveryMethod: (method: typeof DELIVERY_METHODS[number]) => void;
}

export const DeliveryMethodFields = ({
  paymentMethods,
  setPaymentMethods,
  deliveryMethod,
  setDeliveryMethod,
}: DeliveryMethodFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Payment Methods</Label>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((method) => (
            <Button
              key={method}
              type="button"
              variant={paymentMethods.includes(method) ? "default" : "outline"}
              onClick={() => {
                setPaymentMethods(
                  paymentMethods.includes(method)
                    ? paymentMethods.filter(m => m !== method)
                    : [...paymentMethods, method]
                );
              }}
            >
              {method.replace(/_/g, ' ')}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Delivery Method</Label>
        <div className="flex flex-wrap gap-2">
          {DELIVERY_METHODS.map((method) => (
            <Button
              key={method}
              type="button"
              variant={deliveryMethod === method ? "default" : "outline"}
              onClick={() => setDeliveryMethod(method)}
            >
              {method}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};