import { useState } from "react";
import type { PaymentMethod, DeliveryMethod } from "../use-create-listing";

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