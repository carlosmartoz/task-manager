export interface InputProps {
  value: string;
  className?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: "text" | "search" | "email" | "password";
}
