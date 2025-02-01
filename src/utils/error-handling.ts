import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

export const handleSupabaseError = (error: PostgrestError | null) => {
  if (!error) return;

  console.error("Supabase error:", error);

  // Map common Supabase error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    "23505": "This record already exists.",
    "23503": "Referenced record does not exist.",
    "42703": "Invalid column name in the request.",
    "42P01": "The requested table does not exist.",
    "23514": "The data violates a constraint.",
    "42501": "You don't have permission to perform this action.",
  };

  const message = errorMessages[error.code] || error.message;
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });

  return message;
};

export const handleAuthError = (error: Error) => {
  console.error("Auth error:", error);

  const authErrorMessages: Record<string, string> = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-credential": "Invalid login credentials.",
  };

  const message = authErrorMessages[error.message] || "An authentication error occurred.";
  
  toast({
    title: "Authentication Error",
    description: message,
    variant: "destructive",
  });

  return message;
};

export const handleNetworkError = (error: Error) => {
  console.error("Network error:", error);
  
  toast({
    title: "Network Error",
    description: "Please check your internet connection and try again.",
    variant: "destructive",
  });
};

export const handleUnexpectedError = (error: unknown) => {
  console.error("Unexpected error:", error);
  
  toast({
    title: "Unexpected Error",
    description: "An unexpected error occurred. Please try again later.",
    variant: "destructive",
  });
};