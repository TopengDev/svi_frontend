import { ActionDispatch } from 'react';

export type TFormStates = {
   isLoading: boolean;
   submitTriggered: boolean;
   readOnly: boolean;
   disabled: boolean;
};
export type TFormActions<TFormData> = {
   setFormField(
      fieldName: keyof TFormData,
      value: TFormData[keyof TFormData],
   ): void;
   setFormFields(
      data: Record<keyof TFormData, TFormData[keyof TFormData]>,
   ): void;
   clearFormData(): void;
   resetFormData(): void;
   checkValidations(): boolean;
   setFormValidation(
      fieldName: keyof TFormData,
      validation: TFormFieldValidation,
   ): void;
};
export type TFormContext<TFormData = any> = {
   states: TFormStates;
   statesDispatch: ActionDispatch<
      [
         action:
            | {
                 actionType: 'setIsLoading';
                 payload: boolean;
              }
            | {
                 actionType: 'setSubmitTriggered';
                 payload: boolean;
              }
            | {
                 actionType: 'setReadOnly';
                 payload: boolean;
              }
            | {
                 actionType: 'setDisabled';
                 payload: boolean;
              },
      ]
   >;
   actions: TFormActions<TFormData>;
   formData: TFormData;
   formValidations: Record<keyof TFormData, TFormFieldValidation>;
} | null;

export type TGeneralRegisteredFormFields<TFormData> = {
   label: string;
   fieldName: keyof TFormData;
   placeholder?: string;
   minLength?: number;
   maxLength?: number;
   required?: boolean;
   onChange?: (value?: TFormData[keyof TFormData]) => void;
   onBlur?: (value?: TFormData[keyof TFormData]) => void;
   onFocus?: (value?: TFormData[keyof TFormData]) => void;
   validator?: (value: TFormData[keyof TFormData]) => {
      isValid: boolean;
      msg?: string;
   };
   masker?: (value: string | string[] | number) => string;
   defaultValue?: TFormData[keyof TFormData];
};

export type TRegisteredFormField<TFormData> =
   | (TGeneralRegisteredFormFields<TFormData> & {
        type: 'text' | 'email' | 'password' | 'date' | 'number';
        isFlexContainer?: false;
     })
   | (TGeneralRegisteredFormFields<TFormData> & {
        type: 'select';
        options: TSelectOption[];
        isFlexContainer?: false;
        multiple?: boolean;
     })
   | (TGeneralRegisteredFormFields<TFormData> & {
        type: 'async-select';
        optionsFetcher: (params?: any) => Promise<TSelectOption[]>;
        isFlexContainer?: false;
        multiple?: boolean;
     })
   | {
        isFlexContainer: true;
        containerName: string;
        fields: (TGeneralRegisteredFormFields<TFormData> &
           (
              | {
                   type: 'text' | 'email' | 'password' | 'date' | 'number';
                   isFlexContainer?: false;
                }
              | {
                   type: 'select';
                   options: TSelectOption[];
                   isFlexContainer?: false;
                }
              | {
                   type: 'async-select';
                   optionsFetcher: (params?: any) => Promise<TSelectOption[]>;
                   isFlexContainer?: false;
                }
           ))[];
     };

export type TFormField =
   | TGenericInputProps
   | TAsyncSelectInputProps
   | TSelectInputProps;

export type TUnifiedFormField = TFormField & {
   isFlexContainer: true;
   containerName: string;
   fields: TFormField[];
};
