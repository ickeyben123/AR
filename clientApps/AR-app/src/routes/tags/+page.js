// function called on loading of the tags page which fetches the tags from backend.

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends, url }) {

    // fetch all tags.
    const res = await fetch(  url.origin + "/api/tag",{
            method: 'GET',
            credentials: 'include',
            headers: {
                'ngrok-skip-browser-warning': true,
            },
        }
    );

    // get tags as json from request.   
    const items =  await res.json();

    depends('app:tags');
    
    if (items.message){
        return {failed : true};
    }
    return {tags : items};
  }
