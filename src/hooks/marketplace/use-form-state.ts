import { useState } from "react";
import type { PaymentMethod, DeliveryMethod } from "../use-create-listing";

export interface FormStateData {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  condition: string;
  setCondition: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  paymentMethods: PaymentMethod[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: React.Dispatch<React.SetStateAction<DeliveryMethod>>;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export const useFormState = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("shipping");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  return {
    formData: {
      title,
      setTitle,
      description,
      setDescription,
      price,
      setPrice,
      condition,
      setCondition,
      category,
      setCategory,
      location,
      setLocation,
      paymentMethods,
      setPaymentMethods,
      deliveryMethod,
      setDeliveryMethod,
      selectedFiles,
      setSelectedFiles,
    }
  };
};