'use client';
import { createForm } from '@/components/custom/form';

const { FormProvider, useForm, Form } = createForm<{
   name: string;
   email: string;
   password: string;
   gender: string;
   currentSalary: number;
}>({
   initialFormData: {
      name: '',
      email: '',
      password: '',
      gender: '',
      currentSalary: 25,
   },
});

function Component() {
   const { formData, actions, statesDispatch, formValidations, states } =
      useForm();

   async function optionsFetcher(): Promise<TSelectOption[]> {
      return new Promise((resolve, reject) => {
         setTimeout(() => {
            const success = true; // Simulate success or failure
            if (success) {
               resolve([
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                  { label: 'Option 4', value: '4' },
                  { label: 'Option 5', value: '5' },
                  { label: 'Option 6', value: '6' },
                  { label: 'Option 7', value: '7' },
                  { label: 'Option 8', value: '8' },
                  { label: 'Option 9', value: '9' },
                  { label: 'Option 10', value: '10' },
                  { label: 'Option 11', value: '11' },
               ]);
            } else {
               reject('Error fetching data.');
            }
         }, 1500);
      });
   }

   return (
      <div className="w-screen h-screen flex items-center justify-center">
         <div className="w-1/2">
            <Form
               handleSubmit={(formData) =>
                  console.log(`Submitted: `, { formData })
               }
               fields={[
                  {
                     type: 'text',
                     fieldName: 'name',
                     label: 'Name',
                     required: true,
                  },
                  {
                     isFlexContainer: true,
                     containerName: 'email-password',
                     fields: [
                        {
                           type: 'email',
                           fieldName: 'email',
                           label: 'Email',
                        },
                        {
                           type: 'password',
                           fieldName: 'password',
                           label: 'Password',
                           minLength: 8,
                        },
                     ],
                  },
                  {
                     type: 'select',
                     fieldName: 'gender',
                     label: 'gender',
                     options: [
                        {
                           label: 'Male',
                           value: 'M',
                        },
                        {
                           label: 'Female',
                           value: 'F',
                        },
                     ],
                     multiple: true,
                  },
                  {
                     type: 'async-select',
                     fieldName: 'gender',
                     label: 'gender',
                     optionsFetcher,
                     // multiple: true,
                  },
               ]}
            />
         </div>
      </div>
   );
}

export default function Page() {
   function handleSubmit(_formData: any) {
      console.log({ _formData });
      return {
         isSuccess: true,
      };
   }

   return (
      <FormProvider>
         <Component />
      </FormProvider>
   );
}
