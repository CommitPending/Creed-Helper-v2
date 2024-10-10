import { atom } from 'recoil';

export const pokemonDetailsState = atom({
  key: 'pokemonDetailsState', 
  default: {
    uname: '',
    uid: '',
    totalRating: '',
    consideredPokemon: [],
    ignoredPokemon: [],
  },
});


export const categorizedTotalsState = atom({
    key: 'categorizedTotalsState',
    default: {
      Luminous: 0,
      Cursed: 0,
      Gold: 0,
      Rainbow: 0,
      Shadow: 0,
    },
  });