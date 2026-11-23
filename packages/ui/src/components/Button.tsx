import { ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles = {
    primary: "shared-button-primary",
    secondary: "shared-button-secondary",
    danger: "shared-button-danger",
  };

  return (
    <button
      {...props}
      className={`shared-button ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}