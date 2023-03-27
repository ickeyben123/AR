/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends, url }) {
    const res = await fetch(  url.origin + "/api/tag",{
                method: 'GET',
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': true,
                },
            });
    const items =  await res.json();

    depends('app:tags');

    if (items.message){
        return {failed : true};
    }
    return {tags : items};
  }