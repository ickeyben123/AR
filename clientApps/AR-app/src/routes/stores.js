import { writable } from 'svelte/store';

// A variable that can be set/accessed by all components (that import it)
// Used to show the currently logged in user in the top bar
export const currentUserStore = writable("Not Logged In!");