import { useCallback, useEffect, useState } from 'react';
import usernames from './data/usernames.txt';

const reader = new FileReader();
const apiURL = '/api/api-usernames';

export function useRandomUsername() {
   const [value, setValue] = useState<string[]>([]);
   const fetchUsernames = async () => {
      const res = await fetch(usernames);
      const json = (await res.text()).match(/@[\w_.-]+/gim);
      const mapped = json?.map((e) => e.slice(1));
      setValue(mapped as any);
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
