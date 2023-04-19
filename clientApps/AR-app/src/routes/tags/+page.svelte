<script>

    /*
    Emoji Reference
    Medicine - &#128138
    Key - &#128273
    Wallet - &#128091
    Other - &#11088
    */

    import {slide} from 'svelte/transition';
    import { onMount } from 'svelte';
    import Modal from '../Modal.svelte';
    import { invalidate, invalidateAll } from '$app/navigation';
	import { HtmlTag } from 'svelte/internal';

    // For notifications
    import { toast } from '@zerodevx/svelte-toast';

    let showAddTags = false, showEditTags = false, showDeleteTags = false, reCreate=false, showError=false, showPlaced=false;
    var tagData = {tagName:""}, coords={}, tagDelete = {tagId:null};

    let errorMessage = "";


    // Get data from page.js. Handled via Svelte.
    /** @type {import('./$types').PageData} */  
    export let data;

    // This function should be called when the Tag array is changed.
    // Reloads the html displaying the tags without a hard page reload.
    function rerunLoadFunction() {
        // reload data
        invalidate('app:tags');
        reCreate=!reCreate;
    }

    // Global tags variable storing all the user's tags.
    let tags = data.tags;

    // Expands the specified tag (in html) whilst also setting every other tag to closed.
    // Ensures two tags cannot be open at the same time.
    function expand(section) {
        for (let i = 0; i < tags.length; i++) {
            if (tags[i]._id == section._id && tags[i].active == false) {
                tags[i].active = true;
            }
            else {
                tags[i].active = false;
            }
        }
    }

    // Called to create a new tag, specified from the tagData that should be set beforehand.
    async function newTag()
    {

        const id = toast.push('Adding tag, please wait...', {
            theme: {
            '--toastContainerTop': 'auto',
            '--toastContainerRight': 'auto',
            '--toastContainerBottom': 'auto',
        },
        duration: 50, // Each progress change takes 300ms
        initial: 0,
        next: 0.2,
        dismissable: false
        })
        // Set geolocation
        getGeoLocation(async (position) =>{
            setTagLocation(position);
            var req = {
                "tagName": tagData.tagName,
                "coords": {"longitude" : coords.longitude || 0, "latitude" : coords.latitude || 0, "elevation": 0},
                "description": tagData.description || "A Default Tag.",
                "icon": tagData.icon || 0,
                "placed" : true
            }
            toast.set(id, { next: .5 })

            const response = await fetch(window.location.origin + "/api/tag",
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req) 
            });
            toast.set(id, { next: 1 })

           window.location.reload();
         }); 
    }

    // Called to create a edit a tag, specified from the tagData that should be set beforehand.
    async function submitEdit(){
        const response = await fetch(window.location.origin + "/api/tag/"+tagData._id,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tagData)
        });
        showEditTags = false;
        rerunLoadFunction();

    }
    // called to delete a tag after confirmation that the user wants it deleted
    async function submitDelete(){
        var tagId = tagDelete.tagId;//get the tag ID

        console.log("You deleted tag " + tagId + "!");

        const response = await fetch(window.location.origin + "/api/tag/" + tagId,
        {
            method: 'DELETE',
            credentials: 'include'
        });

        window.location.reload();
    }

    function createNewTag() {
        console.log("You made a new tag!");
        showAddTags = true;
    }

    // Gets the location of the user via geolocation and then executes the function func, parsing the location as the first parameter.
    function getGeoLocation(func){
             if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(func,errorGeoLocation);//send the geolocation data to another function
            } else{
                //this is if the browser doesnt support geolocation, do pop up message or something
                errorMessage = "Your browser does not support geo";
                showError = true;
            }
    }

    async function placeTagViaGeoLocation() {
        console.log("You placed tag " + tagData._id + "!");
        showPlaced = false;


        //need to get the tag coords from geolocation, then save tag data in database
        
        if(tagData.placed){
            errorMessage = "The tag is not picked up, pick the tag up first before being able to place it";
            showError = true;
        }
        else{
            //need to get the tag coords from geolocation, then save tag data in database
            // Set geolocation

            const id = toast.push('Placing Tag', {
                theme: {
                '--toastContainerTop': 'auto',
                '--toastContainerRight': 'auto',
                '--toastContainerBottom': 'auto',
            },
            duration: 50, // Each progress change takes 300ms
            initial: 0,
            next: 0.2,
            dismissable: false
            })
            
            getGeoLocation(async (position)=> {
                setTagLocation(position);

                toast.set(id, { next: .5 })
                // Save new tag data
                const response = await fetch(window.location.origin + "/api/tag/"+tagData._id,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tagData)
                });
                toast.set(id, { next: 1 })

                rerunLoadFunction();

            });
        }
    }
    
    function placeTag(tag){
        tagData = tag;
        coords = tagData.coords;
        showPlaced = true;
    }

    // Sets the tag data to the coords from the geolocator.
     function setTagLocation(position){
        coords.latitude = position.coords.latitude;
        coords.longitude = position.coords.longitude;
        tagData.placed = true;
    }

    //this is called if the 'getCurrentPosition' function fails to get the geo data. May want to display pop up error messsages instead
    function errorGeoLocation(error){
        switch(error.code) {
            case error.PERMISSION_DENIED:
                error = "Unable to add, user denied the request for Geolocation";
                break;
            case error.POSITION_UNAVAILABLE:
                error = "Location information is unavailable";
                break;
            case error.TIMEOUT:
                error = "The request to get user location timed out";
                break;
            case error.UNKNOWN_ERROR:
                error = "An unknown error occurred";
                break;
        }
        tagData = {tagName:""};//resetting the tagData without having to reload page
        errorMessage = error;
        toast.pop(0);
        showError = true;
    }

    function editTag(tag) {
        console.log("You edited tag " + tag.id + "!");
        tagData=tag
        coords=tag.coords
        showEditTags = true;
    }



    function viewTag(tag) {
        window.location.href = "ar?tagId=" + tag._id;

        console.log("You viewed tag " + tag._id + "!");
    }

    //Called to show the confirmation screen, then the user can confirm they want 
    //delete the tag
    async function deleteTag(tag) {
        tagDelete.tagId = tag._id; //set the tag ID for the tag we want to delete
        showDeleteTags = true;
    }

    function submitInfo() {
        console.log(tagData.tagName);
        if(tagData.tagName == ""){
            toast.push('Please include a tag name!',{ classes: ['error'] });
            showAddTags = false;
            return;
        }
        showAddTags = false;
        newTag();
    }


</script>






    <!-- Title for Tags page -->
<div class="title">
    <h1>Your Tags</h1>
</div>

<!-- /////////// -->
<!-- TAG DISPLAY -->
<!-- /////////// -->

<!-- Conditional that it only shows tags if the data has loaded -->
    <!-- Goes through each tag in the fetched tags of the user to create
        tag items for manipulation  -->
        <div class="margin">
        {#each tags || [] as tag }
            <div class="accordionPanel">
                <!-- Key specifies a part of the html that can be made to 'reload' when
                    the tag data has been updated. -->
                {#key reCreate}
                    <button on:click={() => expand(tag)} class="accordionButton">
                        <div class="accordionIcon">
                            {#if tag.icon == "1"}
                                &#128138
                            {:else if tag.icon == "2"}
                                &#128273
                            {:else if tag.icon == "3"}
                                &#128091
                            {:else}
                                &#11088
                            {/if}
                        </div> {tag.tagName} 
                    </button>
                {/key}
                <!-- When the tag.active variable is set to true, expand the tag -->
                {#if tag.active}
                    <div transition:slide class="accordionContent" >
                        {#key reCreate}
                            <p>
                                {tag.description}
                            </p>
                        {/key}
                        {#if tag.placed}
                        <button class="menuButton" on:click={() => viewTag(tag)}>Find</button>
                        {/if}
                        {#if !tag.placed}
                         <button class="menuButton" on:click={() => placeTag(tag)}>Place</button>
                        {/if}
                        <button class="menuButton" on:click={() => editTag(tag)}>Edit</button>
                        <button class="menuButton" on:click={() => deleteTag(tag)}>Delete</button>

                    </div>
                {/if}
            </div>
        {/each}
    </div>

<div class="bottom">
    <!-- Button to create a tag at the bottom of the page -->
<button class="bottomButton" on:click={() =>createNewTag()}>Create Tag +</button>
</div>

<!-- ////// -->
<!-- MODALS -->
<!-- ////// -->

<!-- Stops modals from being loaded in page if there is no tag data. Prevents errors. -->
{#if tagData}

<!-- Add Tag Model. Shows when 'showAddTags' variable is set to true -->
<Modal bind:showModal={showAddTags}>
    <div class="title">
        <h2>Enter Tag Name</h2>
        <input bind:value={tagData.tagName} placeholder = "Please enter a tag name"><br>
        <h2>Enter Tag Description</h2>
        <input bind:value={tagData.description} placeholder = Empty><br>
        <h2>Select Tag Type</h2>
        <div id="iconBtns">
            <button class="selectButton {tagData.icon === "1" ? 'active' : ''}" on:click={() => (tagData.icon = "1")}>&#128138</button>
            <button class="selectButton {tagData.icon === "2" ? 'active' : ''}" on:click={() => (tagData.icon = "2")}>&#128273</button>
            <button class="selectButton {tagData.icon === "3" ? 'active' : ''}" on:click={() => (tagData.icon = "3")}>&#128091</button>
            <button class="selectButton {tagData.icon === "4" ? 'active' : ''}" on:click={() => (tagData.icon = "4")}>&#11088</button>
        </div><br>
        <button class="menuButton" on:click ={() =>submitInfo()}>Submit</button>
    </div>
</Modal>

<!-- Edit Tag Model. Shows when 'showEditTags' variable is set to true -->
<Modal bind:showModal={showEditTags}>
    <div class="title">
        <h2>Edit Tag Name</h2>
        <input bind:value={tagData.tagName} placeholder = Name><br>
        <h2>Edit Tag Description</h2>
        <input bind:value={tagData.description} placeholder = Empty><br>
        <h2>Edit Tag Coordinates</h2>
        <h5>Latitude</h5>
        <input bind:value={coords.latitude} placeholder = Empty ><br>
        <h5>Longitude</h5>
        <input bind:value={coords.longitude} placeholder = Empty><br>
        <h2>Change Tag Type</h2>
        <div id="iconBtnsEdit">
            <button class="selectButton {tagData.icon === "1" ? 'active' : ''}" on:click={() => (tagData.icon = "1")}>&#128138</button>
            <button class="selectButton {tagData.icon === "2" ? 'active' : ''}" on:click={() => (tagData.icon = "2")}>&#128273</button>
            <button class="selectButton {tagData.icon === "3" ? 'active' : ''}" on:click={() => (tagData.icon = "3")}>&#128091</button>
            <button class="selectButton {tagData.icon === "4" ? 'active' : ''}" on:click={() => (tagData.icon = "4")}>&#11088</button>
        </div><br>
        <button class="menuButton" on:click ={() =>submitEdit()}>Submit</button>
    </div>
</Modal>

<Modal bind:showModal={showError}>
    <h2 style="color: #FF3535;">{errorMessage}</h2>
</Modal>


<!-- Delete Tag Modal. Shows when 'showDeleteTags' is set to true -->
<Modal bind:showModal={showDeleteTags}>
    <div class="title">
        <h2>Delete Tag</h2>
        <h3>Are You Sure You Want To Delete This Tag?</h3>
        <button class="menuButton" on:click ={() =>submitDelete()}>Yes</button>
    </div>
</Modal>

<!-- Place Tag Modal. Shows when 'showPlaced' is set to true -->
<Modal bind:showModal={showPlaced}>
    <div class="title">
        <h2>Place Tag</h2>
        <h3>Please put your phone in the location of the tag before placing.</h3>
        <button class="menuButton" on:click ={() =>placeTagViaGeoLocation()}>Place Tag</button>
    </div>
</Modal>


{/if}



<style>
   .title {
        position:sticky;
        width:100%;
        text-align:center;
    }

    .bottom{
    width: 100%;
    flex: 0 0 50px;/*or just height:50px;*/
  margin-top: auto;
    color: white;
    text-align: center;
    }


    
    .margin{
        margin-bottom: 0px;
    }


    .bottomButton {

        font-size: large;
        
        border-radius: 4px;
        outline: none;
        font-size: larger;
        width: 90%;
        max-width: 800px;
    }

    .menuButton {
       
        font-size: large;
        border-radius: 4px;
        outline: none;
        font-size: larger;
        width: 100%;
        max-width: 200px;
    }
    button:hover {
	background-color: #79b9e7;
	color:white;
	transition-duration: 0.4s;
}

    .selectButton {
     
        font-size: large;
        background-color: rgb(219, 238, 255);
        color: black;
        border-radius: 4px;
        outline: none;
        font-size: larger;
        width: 40%;
        max-width: 800px;
    }


    .active {
        background-color: rgb(61, 114, 158);
        color:white;
        transition-duration: 0.4s;
    }
    .accordionPanel {
        display: table;
        border-radius: 4px;
        width:100%;
        max-width: 800px;
        margin: auto;
        text-align: centre;
        margin-bottom: 0px;
    }
    .accordionButton {
        width: 100%;
        display:block;
        background-color: aliceblue;
        color:black;
        border-radius: 4px;
        text-align: center;
        outline:none;
        font-size: large;
    }
    .accordionButton:hover {
        background-color: rgb(103, 132, 156);
        color:white;
        transition-duration: 0.4s;
    }
    .accordionIcon {
        display:inline;
        float:left;
    }
    .accordionContent {
        border: 1px solid #eee;
		padding: 4px 20px;
        text-align: center;
        background-color:rgb(232, 232, 232);
        border-radius: 4px;
        margin-bottom: 10px;
    }
</style>
