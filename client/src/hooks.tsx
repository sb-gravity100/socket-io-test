import { useCallback, useEffect, useState } from 'react';

const apiURL = '/api/api-usernames';

export function useRandomUsername() {
   const [value, setValue] = useState<string[]>([]);
   const fetchUsernames = async () => {
      const res = await fetch(apiURL);
      const json = (await res.json()) as string[];
      const mapped = json.map((e) => e.slice(1));
      setValue(mapped);
   };
   const callback = useCallback(() => {
      fetchUsernames();
   }, []);
   useEffect(() => {
      callback();
   }, [callback]);

   return () => {
      return value[Math.floor(Math.random() * value.length)] || '';
   };
}
