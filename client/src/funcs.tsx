import {
   uniqueNamesGenerator,
   NumberDictionary,
   adjectives,
   colors,
   names,
} from 'unique-names-generator';

export function useRandomUsername() {
   return uniqueNamesGenerator({
      dictionaries: [
         Math.random() < 0.5 ? adjectives : colors,
         names,
         NumberDictionary.generate({ min: 1, max: 10000 }),
      ],
      length: 3,
      separator: Math.random() < 0.5 ? '-' : '',
      style: 'capital',
   });
}
