// components/product-form/DynamicFormField.tsx
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { FieldConfig } from "./form-fields-config";
import { ProductForm } from "./product-form-schema";

type Props = {
  fieldConfig: FieldConfig;
  control: Control<ProductForm>;
};

export function DynamicFormField({ fieldConfig, control }: Props) {
  const { name, label, type = "text", placeholder, rows } = fieldConfig;

  const isTextarea = type === "textarea";
  const maxLength = name === "description" ? 500 : undefined;

  return (
    <Controller
      name={name as Path<ProductForm>}
      control={control}
      render={({ field, fieldState }) => {
        const rawValue = field.value ?? "";
        const textValue = typeof rawValue === "boolean" ? "" : String(rawValue);

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            {isTextarea ? (
              <InputGroup>
                <InputGroupTextarea
                  id={name}
                  placeholder={placeholder}
                  rows={rows || 4}
                  className="min-h-28 resize-none"
                  value={textValue}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={fieldState.invalid}
                  maxLength={maxLength}
                />
                {maxLength && (
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {textValue.length || 0}/{maxLength}
                    </InputGroupText>
                  </InputGroupAddon>
                )}
              </InputGroup>
            ) : (
              <Input
                type={type}
                id={name}
                placeholder={placeholder}
                value={type === "number" ? (typeof rawValue === "number" ? rawValue : "") : textValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (type === "number") {
                    field.onChange(val === "" ? "" : Number(val));
                  } else {
                    field.onChange(val);
                  }
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={fieldState.invalid}
              />
            )}

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}