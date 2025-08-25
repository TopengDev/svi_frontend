export function validateField({
   value,
   callback,
   maxLength,
   minLength,
   required,
   validator,
}: {
   value: string | string[] | number;
   required?: boolean;
   minLength?: number;
   maxLength?: number;
   validator?: (value: string | string[] | number) => TFormFieldValidation;
   callback?: (validity: TFormFieldValidation) => void;
}) {
   let updatedValidity: TFormFieldValidation = { isValid: true, msg: '' };
   switch (true) {
      case required:
         updatedValidity = {
            isValid: !!String(value),
            msg: `This field is required`,
         };
         break;
      case typeof minLength === 'number':
         updatedValidity = {
            isValid: String(value).length >= minLength,
            msg: `Minimum ${minLength} characters`,
         };
         break;
      case typeof maxLength === 'number':
         updatedValidity = {
            isValid: String(value).length <= maxLength,
            msg: `Maximum ${maxLength} characters`,
         };
         break;
      case !!validator:
         const validationResult = validator(value);
         updatedValidity = {
            isValid: validationResult.isValid,
            msg: validationResult.msg || '',
         };
         break;
      default:
         updatedValidity = { isValid: true, msg: '' };
   }
   callback?.(updatedValidity);
   return updatedValidity;
}
