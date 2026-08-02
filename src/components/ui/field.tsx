
// components/ui/field/field.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-invalid"?: boolean;
  "data-disabled"?: boolean;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, "data-invalid": dataInvalid, "data-disabled": dataDisabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-1.5 w-full",
          // Invalid state
          dataInvalid && "text-destructive",
          // Disabled state
          dataDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
        data-invalid={dataInvalid}
        data-disabled={dataDisabled}
        {...props}
      />
    );
  }
);
Field.displayName = "Field";

export { Field };

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  errors?: Array<{ message?: string } | null | undefined>;
}

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, children, errors, ...props }, ref) => {
    // Extract error messages from various formats
    const errorMessages = React.useMemo(() => {
      if (errors) {
        return errors
          .filter((error) => error?.message)
          .map((error) => error?.message)
          .filter(Boolean);
      }
      if (typeof children === "string") {
        return [children];
      }
      return [];
    }, [errors, children]);

    if (errorMessages.length === 0) {
      return null;
    }

    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {errorMessages.join(", ")}
      </p>
    );
  }
);
FieldError.displayName = "FieldError";

export { FieldError };

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
    );
  }
);
FieldLabel.displayName = "FieldLabel";

export { FieldLabel };



export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
}

const gapMap = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const FieldGroup = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ className, orientation = "vertical", gap = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap items-center",
          gapMap[gap],
          className
        )}
        {...props}
      />
    );
  }
);
FieldGroup.displayName = "FieldGroup";

export { FieldGroup };





