'use client';

import {
   createContext,
   PropsWithChildren,
   useContext,
   useEffect,
   useReducer,
   useState,
} from 'react';
import {
   TFormContext,
   TFormStates,
   TRegisteredFormField,
   TUnifiedFormField,
} from './types';
import { AsyncSelectInput, GenericInput, SelectInput } from './input';
import { Button } from '@/components/ui/button';

function formStatesReducer(
   state: TFormStates,
   action:
      | { actionType: 'setIsLoading'; payload: boolean }
      | { actionType: 'setSubmitTriggered'; payload: boolean }
      | { actionType: 'setReadOnly'; payload: boolean }
      | { actionType: 'setDisabled'; payload: boolean },
) {
   switch (action.actionType) {
      case 'setIsLoading':
         return {
            ...state,
            isLoading: action.payload,
         };
      case 'setDisabled':
         return {
            ...state,
            disabled: action.payload,
         };
      case 'setReadOnly':
         return {
            ...state,
            readOnly: action.payload,
         };
      case 'setSubmitTriggered':
         return {
            ...state,
            submitTriggered: action.payload,
         };

      default:
         throw new Error(`Unknown action`);
   }
}
const initialFormStates: TFormStates = {
   isLoading: false,
   submitTriggered: false,
   readOnly: false,
   disabled: false,
};

export function createForm<TFormData = any>({
   initialFormData,
}: {
   initialFormData: TFormData;
}) {
   const FormContext = createContext<TFormContext<TFormData>>(null);

   function useForm() {
      const ctx = useContext(FormContext);
      if (!ctx)
         throw new Error('used useForm hook outside of FormProvider scope.');
      return ctx;
   }

   function FormProvider({ children }: PropsWithChildren) {
      const [formStates, formStatesDispatch] = useReducer(
         formStatesReducer,
         initialFormStates,
      );

      const [formData, setFormData] = useState<TFormData>(initialFormData);
      const [formValidations, setFormValidations] = useState<
         Record<keyof TFormData, TFormFieldValidation>
      >({} as Record<keyof TFormData, TFormFieldValidation>);

      function setFormField(
         fieldName: keyof TFormData,
         value: TFormData[keyof TFormData],
      ) {
         setFormData((prev) => ({ ...prev, [fieldName]: value }));
      }
      function setFormFields(
         data: Record<keyof TFormData, TFormData[keyof TFormData]>,
      ) {
         setFormData((prev) => ({ ...prev, ...data }));
      }
      function setFormValidation(
         fieldName: keyof TFormData,
         validation: TFormFieldValidation,
      ) {
         setFormValidations((prev) => ({ ...prev, [fieldName]: validation }));
      }
      function clearFormData() {
         const clearedFormData: TFormData = {} as TFormData;
         for (const key in formData) {
            clearedFormData[key as keyof TFormData] =
               '' as TFormData[keyof TFormData];
         }
         setFormData(clearedFormData);
      }
      function resetFormData() {
         setFormData(initialFormData);
      }
      function checkValidations() {
         for (const key in formValidations) {
            if (!formValidations[key]?.isValid) return false;
         }
         return true;
      }

      return (
         <FormContext.Provider
            value={{
               states: formStates,
               statesDispatch: formStatesDispatch,
               actions: {
                  setFormField,
                  setFormFields,
                  checkValidations,
                  clearFormData,
                  resetFormData,
                  setFormValidation,
               },
               formData,
               formValidations,
            }}
         >
            {children}
         </FormContext.Provider>
      );
   }

   function RenderFields({
      fields,
   }: {
      fields: TRegisteredFormField<TFormData>[];
   }) {
      const {
         states: { disabled, isLoading, readOnly, submitTriggered },
         actions: { setFormField, setFormValidation },
         formData,
      } = useForm();

      return (
         <>
            {(fields as any[])?.map((f, i) => {
               if (f.isFlexContainer) {
                  return (
                     <div
                        key={`form-field-${
                           (f as TUnifiedFormField).containerName
                        }-${i}`}
                        className="w-full flex gap-4"
                     >
                        <RenderFields fields={f.fields} />
                     </div>
                  );
               }

               const isGenericInput =
                  f.type === 'date' ||
                  f.type === 'email' ||
                  f.type === 'password' ||
                  f.type === 'number' ||
                  f.type === 'text';
               const isAsyncSelectInput = f.type === 'async-select';
               const isSelectInput = f.type === 'select';

               return isGenericInput ? (
                  <div
                     className="w-full"
                     key={`form-field-${f.fieldName}-${i}`}
                  >
                     <GenericInput
                        {...f}
                        setFormDataField={setFormField}
                        formData={formData}
                        onValidated={(validation) => {
                           setFormValidation(f.fieldName, validation);
                        }}
                        isLoading={isLoading}
                        disabled={disabled}
                        readOnly={readOnly}
                        submitTriggered={submitTriggered}
                     />
                  </div>
               ) : isSelectInput ? (
                  <div
                     className="w-full"
                     key={`form-field-${f.fieldName}-${i}`}
                  >
                     <SelectInput
                        {...f}
                        setFormDataField={setFormField}
                        formData={formData}
                        onValidated={(validation) => {
                           setFormValidation(f.fieldName, validation);
                        }}
                        isLoading={isLoading}
                        disabled={disabled}
                        readOnly={readOnly}
                        submitTriggered={submitTriggered}
                     />
                  </div>
               ) : isAsyncSelectInput ? (
                  <div
                     className="w-full"
                     key={`form-field-${f.fieldName}-${i}`}
                  >
                     <AsyncSelectInput
                        {...f}
                        setFormDataField={setFormField}
                        formData={formData}
                        onValidated={(validation) => {
                           setFormValidation(f.fieldName, validation);
                        }}
                        isLoading={isLoading}
                        disabled={disabled}
                        readOnly={readOnly}
                        submitTriggered={submitTriggered}
                     />
                  </div>
               ) : (
                  ''
               );
            })}
         </>
      );
   }

   function Form({
      fields,
      handleSubmit,
   }: {
      fields: TRegisteredFormField<TFormData>[];
      handleSubmit?: (formData: TFormData) => Promise<void> | void;
   }) {
      const {
         formData,
         actions: { checkValidations },
         statesDispatch,
      } = useForm();

      return (
         <form
            onSubmit={(e) => {
               e.preventDefault();
               statesDispatch({
                  actionType: 'setSubmitTriggered',
                  payload: true,
               });
               if (checkValidations()) handleSubmit?.(formData);
            }}
         >
            <RenderFields fields={fields} />
            <Button className="w-full">Submit</Button>
         </form>
      );
   }

   return {
      useForm,
      FormProvider,
      Form,
   };
}
