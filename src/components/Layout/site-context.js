import { createContext } from 'react';

export const SiteContext = createContext({
  location: null,
  setLocation: () => {},
});
