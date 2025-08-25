'use client';

import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { validateField } from '@/components/custom/form/utils';
import { ChevronDownIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
export function AsyncSelectInput<TFormData>({
   label = '',
   fieldName,
   placeholder = '',
   minLength,
   maxLength,
   disabled = false,
   readOnly = false,
   isLoading = false,
   required = false,
   validator,
   onChange,
   onBlur,
   onFocus,
   submitTriggered,
   formData,
   setFormDataField,
   onValidated,
   optionsFetcher,
   multiple = false,
   defaultValue = '',
}: TAsyncSelectInputProps<TFormData>) {
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

   const [availableOptions, setAvailableOptions] = useState<TSelectOption[]>(
      [],
   );
   const [chosenOptions, setChosenOptions] = useState<TSelectOption[]>([]);
   const [initialized, setInitialized] = useState(false);

   const [loading, setLoading] = useState<boolean>(isLoading);
   useEffect(() => {
      setLoading(isLoading);
   }, [isLoading]);

   const fetchOptions = useCallback(
      async function () {
         if (optionsFetcher) {
            setLoading(true);
            const options = await optionsFetcher();

            if (!initialized && options?.length && multiple) {
               const selectedOptions = options.filter((option) =>
                  (defaultValue as string[]).includes(option.value),
               );
               const selectedOptionStrings = selectedOptions.map(
                  (o) => o.value,
               );
               setChosenOptions(selectedOptions);
               setAvailableOptions(
                  options.filter(
                     (option) => !selectedOptionStrings.includes(option.value),
                  ),
               );

               setInitialized(true);
               setLoading(false);
            } else {
               setAvailableOptions(options || []);
               setFormDataField(fieldName, defaultValue);
               setLoading(false);
            }
         }
      },
      [optionsFetcher],
   );
   useEffect(() => {
      fetchOptions();
   }, []);

   function handleMultipleChange(_option: TSelectOption) {
      /**
       * Handle value change
       */
      if (maxLength && chosenOptions?.length >= maxLength) return;
      setChosenOptions((prev) => [...prev, _option]);
      setAvailableOptions((prev) =>
         prev.filter((option) => option.value !== _option.value),
      );
      if (multiple && toggleRef.current) {
         toggleRef.current.checked = false;
      }
   }
   function handleMultipleRemove(_option: TSelectOption) {
      /**
       * Handle value change
       */
      setChosenOptions((prev) =>
         prev.filter((option) => option.value !== _option.value),
      );
      setAvailableOptions((prev) => [...prev, _option]);
   }
   useEffect(() => {
      if (multiple) {
         const newOptions = chosenOptions.map((o) => o.value);
         setFormDataField(fieldName, newOptions);
         onChange?.(newOptions);
      }
   }, [chosenOptions.length]);

   function handleChange(value: string) {
      /**
       * Handle value change
       */
      setFormDataField(fieldName, value);
      onChange?.(value);
   }

   /**
    * Handle focus and blur events
    */
   function handleFocus(value: string) {
      onFocus?.(value);
   }
   function handleBlur(value: string | string[]) {
      onBlur?.(value);

      setTimeout(() => {
         if (multiple && toggleRef.current) toggleRef.current.checked = false;
      }, 200);
   }

   const toggleRef = useRef<HTMLInputElement | null>(null);

   return (
      <div className="w-full flex flex-col gap-1">
         <label
            htmlFor={`${fieldName as string}`}
            className="font-semibold flex gap-1"
         >
            {label}
            {required ? <p className="text-red-500 text-sm">*</p> : ''}
         </label>

         {loading ? (
            <Skeleton className="h-9 w-full mb-12" />
         ) : (
            <div>
               {multiple ? (
                  <div className="w-full">
                     <div
                        className={cn(
                           'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                           'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                           'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                           `w-full relative${
                              !validity?.isValid && submitTriggered
                                 ? 'border-[1px] border-red-400'
                                 : ''
                           }`,
                        )}
                        onBlur={() => {
                           handleBlur(chosenOptions?.map((o) => o.value));
                        }}
                        tabIndex={0}
                     >
                        <input
                           type="checkbox"
                           className={'w-full h-full absolute opacity-0 peer'}
                           ref={toggleRef}
                           disabled={disabled || isLoading || readOnly}
                        />

                        {placeholder && (
                           <p className="text-accent-foreground absolute top-0 left-0 h-full w-full py-2 px-3 pointer-events-none">
                              {placeholder}
                           </p>
                        )}
                        <ChevronDownIcon className="size-4 opacity-50 absolute top-1/2 -translate-y-1/2 right-4" />
                        {availableOptions?.length > 0 ? (
                           <div
                              className={cn(
                                 'z-10 w-full peer-checked:border-1 rounded-sm absolute top-full  left-0 bg-background     overflow-y-scroll',
                                 `${
                                    !(disabled || isLoading || readOnly)
                                       ? 'pointer-events-none peer-checked:pointer-events-auto peer-checked:max-h-[200px] peer-checked:translate-y-1'
                                       : 'max-h-0'
                                 }`,
                              )}
                           >
                              <div
                                 className={cn(
                                    'text-muted-foreground px-2 py-1.5 text-xs',
                                 )}
                              >
                                 {label}
                              </div>
                              {availableOptions?.map((option, i) => (
                                 <div
                                    aria-disabled={
                                       disabled || isLoading || readOnly
                                    }
                                    role="option"
                                    aria-selected={chosenOptions
                                       ?.map((o) => o.value)
                                       ?.includes(option.value)}
                                    className={cn(
                                       "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
                                       'w-full hover:bg-accent',
                                    )}
                                    key={`form-select-option-${i}-${option.value}`}
                                    onClick={() => {
                                       handleMultipleChange(option);
                                    }}
                                 >
                                    {option.label}
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <>
                              {!availableOptions?.length &&
                                 !loading &&
                                 initialized && (
                                    <div className="px-2 py-2 text-xs text-muted-foreground italic">
                                       No options available
                                    </div>
                                 )}
                           </>
                        )}
                     </div>
                     <div className="relative h-6 ">
                        <div className="my-1 flex flex-wrap gap-2   overflow-hidden w-full h-full">
                           {chosenOptions?.map((option, i) => (
                              <span
                                 key={`form-select-chosen-${i}-${option.value}`}
                                 className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-md flex items-center gap-1"
                              >
                                 {option.label}
                                 <button
                                    type="button"
                                    onClick={() => handleMultipleRemove(option)}
                                    className="text-red-500 hover:text-red-700"
                                 >
                                    &times;
                                 </button>
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               ) : (
                  <Select
                     disabled={disabled || readOnly || isLoading}
                     value={(formData?.[fieldName] as string) || ''}
                     onValueChange={(v) => {
                        handleChange(v);
                     }}
                     required={required}
                     defaultValue=""
                  >
                     <SelectTrigger
                        id={`${fieldName as string}`}
                        className={`w-full ${
                           !validity?.isValid && submitTriggered
                              ? 'border-[1px] border-red-400'
                              : ''
                        }`}
                        onBlur={(e) => handleBlur(e.target.value)}
                        onFocus={(e) => handleFocus(e.target.value)}
                     >
                        <SelectValue placeholder={placeholder} />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectGroup>
                           <SelectLabel>{label}</SelectLabel>
                           {availableOptions?.map((option, i) => (
                              <SelectItem
                                 className="w-full"
                                 key={`form-select-option-${i}-${option.value}`}
                                 value={String(option.value)}
                              >
                                 {option.label}
                              </SelectItem>
                           ))}
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               )}

               <div>
                  {validity?.msg && !validity?.isValid && submitTriggered ? (
                     <span className="text-red-500 text-xs">
                        {validity.msg}
                     </span>
                  ) : (
                     <span>&nbsp;</span>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
