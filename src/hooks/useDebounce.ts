import { useEffect, useState } from 'react';

export default function useDebounce<TValue = any>(
   value: TValue,
   milliseconds: number,
) {
   const [debouncedValue, setDebouncedValue] = useState<TValue>('' as any);

   useEffect(() => {
      const timeout = setTimeout(() => {
         setDebouncedValue(value);
      }, milliseconds);

      return () => {
         timeout.close();
      };
   }, [value]);

   return debouncedValue;
}
