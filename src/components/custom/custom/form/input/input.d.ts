type TGeneralInputProps<
   TFormData = Record<string, string | string[] | number>,
> = {
   label: string;
   fieldName: keyof TFormData;
   placeholder?: string;
   minLength?: number;
   maxLength?: number;
   disabled?: boolean;
   readOnly?: boolean;
   isLoading?: boolean;
   required?: boolean;
   submitTriggered?: boolean;
   formData: TFormData;
   setFormDataField: (
      fieldName: keyof TFormData,
      value: string | string[] | number,
   ) => void;
   validator?: (value: string | string[] | number) => {
      isValid: boolean;
      msg?: string;
   };
   onChange?: (value?: string | string[] | number) => void;
   onBlur?: (value?: string | string[] | number) => void;
   onFocus?: (value?: string | string[] | number) => void;
   onValidated?: (validation: TFormFieldValidation) => void;
};

type TGenericInputProps<TFormData = Record<string, string | number>> = {
   type?: 'text' | 'email' | 'password' | 'date' | 'number';
   masker?: (value: string | number) => string;
   isFlexContainer?: falae;
   defaultValue?: string | number;
} & TGeneralInputProps<TFormData>;

type TSelectInputProps<TFormData = Record<string, string | number>> = (
   | { multiple?: boolean; defaultValue?: string }
   | { multiple: true; defaultValue?: string[] }
) & {
   type: 'select';
   options: TSelectOption[];
   isFlexContainer?: falae;
} & TGeneralInputProps<TFormData>;

type TAsyncSelectInputProps<TFormData = Record<string, string | number>> = (
   | { multiple?: boolean; defaultValue?: string }
   | { multiple: true; defaultValue?: string[] }
) & {
   type: 'async-select';
   optionsFetcher: () => Promise<TSelectOption[]>;
   isFlexContainer?: falae;
} & TGeneralInputProps<TFormData>;

type TSelectOption = { label: string; value: string };
