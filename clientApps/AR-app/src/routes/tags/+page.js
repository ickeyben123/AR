/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    const res = await fetch('http://localhost:3000/tag',{
                method: 'GET',
                credentials: 'include'
            });
    const items =  await res.json();
   
    if (items.message){
        return {failed : true};
    }
    return {tags : items};
  }