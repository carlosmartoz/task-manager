export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "search" | "email" | "password";
  className?: string;
}
