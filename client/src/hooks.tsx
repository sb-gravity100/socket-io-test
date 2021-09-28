import {
   uniqueNamesGenerator,
   NumberDictionary,
   adjectives,
   colors,
   names,
   languages,
   starWars,
   countries,
} from 'unique-names-generator';

export function useRandomUsername() {
   const separator = Math.random() < 0.5 ? '-' : '';
   const nameArr = [
      names,
      languages.map((e) => e.split(' ').join(separator)),
      starWars.map((e) => e.split(' ').join(separator)),
      countries.map((e) => e.split(' ').join(separator)),
   ];
   const randomNum = Math.floor(Math.random() * nameArr.length);
   return () =>
      uniqueNamesGenerator({
         dictionaries: [
            Math.random() < 0.5 ? adjectives : colors,
            nameArr[randomNum],
            NumberDictionary.generate({ min: 1, max: 10000 }),
         ],
         length: 3,
         separator,
         style: 'capital',
      });
}
