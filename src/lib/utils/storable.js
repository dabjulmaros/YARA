//https://www.closingtags.com/svelte-stores-in-localstorage/

import { browser } from '$app/environment';
import { writable } from 'svelte/store';
// it works with readable stores too!

// create an object w/default values
let local = {
  method: true,
};

// ensure this only runs in the browser
if (browser) {
  // if the object already exists in localStorage, get it
  // otherwise, use our default values
  local = JSON.parse(localStorage.getItem('local')) || local;
}

// export the store for usage elsewhere
export const localStore = writable(local);

if (browser) {
  // update localStorage values whenever the store values change
  localStore.subscribe((value) =>
    // localStorage only allows strings
    // IndexedDB does allow for objects though... 🤔
    localStorage.setItem('local', JSON.stringify(value))
  );
}