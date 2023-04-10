// function called on loading of the tags page which fetches the tags from backend.

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends, url }) {

    const queryString = url.search;
    const urlParams = new URLSearchParams(queryString);
    let tagId = urlParams.get('tagId')
    // fetch all tags.
    const res = await fetch(  url.origin + '/api/tag/' + tagId,{
        method: 'GET',
        credentials: 'include'
    });
    let item =  await res.json();
    // get tags as json from request.   

    depends('app:item');
    console.log(item);
    //console.log("Hi there!a");
    
    return {tag_item: item};
  }
