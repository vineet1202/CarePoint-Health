import {
  forwardRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export const FormField = ({
  id,
  label,
  optional,
  error,
  hint,
  className,
  children,
}: FormFieldProps) => (
  <div className={cn("space-y-2", className)}>
    <Label htmlFor={id}>
      {label}
      {optional && (
        <span className="ml-1 font-normal text-muted-foreground">
          (optional)
        </span>
      )}
    </Label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="text-sm text-destructive">
        {error}
      </p>
    ) : hint ? (
      <p id={`${id}-hint`} className="text-sm text-muted-foreground">
        {hint}
      </p>
    ) : null}
  </div>
);

export const fieldProps = (id: string, hasError: boolean, hasHint = false) => ({
  id,
  "aria-invalid": hasError,
  "aria-describedby": hasError
    ? `${id}-error`
    : hasHint
      ? `${id}-hint`
      : undefined,
});

export const errorClass = (hasError: boolean) =>
  hasError ? "border-destructive focus-visible:ring-destructive" : "";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof Input>
>(({ className, disabled, ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        disabled={disabled}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export const Select = forwardRef<HTMLSelectElement, ComponentProps<"select">>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Select.displayName = "Select";
