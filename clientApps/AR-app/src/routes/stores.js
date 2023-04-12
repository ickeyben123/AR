import { writable } from 'svelte/store';
import { browser } from '$app/environment';


// A variable that can be set/accessed by all components (that import it)
// Used to show the currently logged in user in the top bar
export const currentUserStore = writable(browser && localStorage.getItem("userName") || "Not Logged In!")

// Anytime the store changes, update the local storage value.
currentUserStore.subscribe((val) => {
  if (browser) return (localStorage.userName = val)
})


