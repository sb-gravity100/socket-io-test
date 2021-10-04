import { useCallback, useEffect, useState } from 'react';

import {
   uniqueNamesGenerator,
   NumberDictionary,
   adjectives,
   names,
} from 'unique-names-generator';

const apiURL = '/api/api-usernames';

export function useRandomUsername() {
   const [value, setValue] = useState<string[]>();
   const fetchUsernames = async () => {
      if (!value) {
         const res = await fetch(apiURL);
         const json = (await res.json()) as string[];
         const mapped = json.map((e) => e.slice(1));
         setValue(mapped);
      }
   };
   const callback = useCallback(() => {
      fetchUsernames();
   }, []);
   useEffect(() => {
      callback();
   }, [callback]);

   return () => {
      return uniqueNamesGenerator({
         dictionaries: [
            Math.random() < 0.5 ? adjectives : names,
            value || names,
            NumberDictionary.generate({ min: 0, max: 1000 }),
         ],
         separator: Math.random() > 0.5 ? '_' : '.',
         length: Math.random() > 0.5 ? 2 : 3,
      });
   };
}
