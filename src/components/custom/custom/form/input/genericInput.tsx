'use client';

import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { validateField } from '@/components/custom/form/utils';
import { useEffect, useState } from 'react';

export function GenericInput<TFormData>({
   label = '',
   fieldName,
   type = 'text',
   placeholder = '',
   minLength,
   maxLength,
   disabled = false,
   readOnly = false,
   isLoading = false,
   required = false,
   validator,
   masker,
   onChange,
   onBlur,
   onFocus,
   submitTriggered,
   formData,
   setFormDataField,
   onValidated,
   defaultValue,
}: TGenericInputProps<TFormData>) {
   const [validity, setValidity] = useState<TFormFieldValidation>({
      isValid: true,
      msg: '',
   });
   useEffect(() => {
      validateField({
         value: formData?.[fieldName] as any,
         maxLength,
         minLength,
         required,
         validator,
         callback: (validity) => {
            setValidity(validity);
            onValidated?.(validity);
         },
      });
   }, [formData?.[fieldName]]);

   const [value, setValue] = useState<string | number>(
      defaultValue as string | number,
   );
   const [maskedValue, setMaskedValue] = useState<string>(
      String(formData?.[fieldName] || ''),
   );
   const [numberString, setNumberString] = useState<string>('');

   const [focused, setFocused] = useState<boolean>(false);

   function handleChange(value: string) {
      if (type === 'number') {
         if (value === '') {
            value = '0';
         } else if (isNaN(parseFloat(value))) {
            return;
         } else if (value?.startsWith('0') && value.length > 1) {
            value = value.replace(/^0+/, '');
         }
      }

      /**
       * Apply masker if provided
       */
      if (masker) {
         const masked = masker(value);
         setMaskedValue(masked);
      } else {
         setMaskedValue(value);
      }

      /**
       * Handle value change
       */
      if (type === 'number') {
         if (isNaN(parseFloat(value))) return;
         setValue(parseFloat(value));
         handleNumberChange(value);
         setFormDataField(fieldName, parseFloat(value));
         onChange?.(parseFloat(value));
      } else {
         setValue(value);
         setFormDataField(fieldName, value);
         onChange?.(value);
      }
   }

   /**
    * Handle focus and blur events
    */
   function handleFocus(value: string) {
      setFocused(true);
      onFocus?.(value);
   }
   function handleBlur(value: string) {
      setFocused(false);
      onBlur?.(value);
   }

   function handleNumberChange(value: string) {
      setNumberString(value);
   }

   return (
      <div className="w-full flex flex-col gap-1">
         <label
            htmlFor={`${fieldName as string}`}
            className="font-semibold flex gap-1"
         >
            {label}
            {required ? <p className="text-red-500 text-sm">*</p> : ''}
         </label>
         <div>
            <Input
               id={`${fieldName as string}`}
               disabled={disabled || readOnly || isLoading}
               type={type}
               value={
                  (masker && !focused
                     ? maskedValue
                     : type === 'number'
                       ? numberString ||
                         String(value || formData?.[fieldName] || '')
                       : value || formData?.[fieldName] || '') as string
               }
               onChange={(e) => {
                  handleChange(e.target.value);
               }}
               placeholder={placeholder || ''}
               className={`w-full ${
                  !validity?.isValid && submitTriggered
                     ? 'border-[1px] border-red-400'
                     : ''
               }`}
               onBlur={(e) => handleBlur(e.target.value)}
               onFocus={(e) => handleFocus(e.target.value)}
            />
            <div>
               {validity?.msg && !validity?.isValid && submitTriggered ? (
                  <span className="text-red-500 text-xs">{validity.msg}</span>
               ) : (
                  <span>&nbsp;</span>
               )}
            </div>
         </div>
      </div>
   );
}
