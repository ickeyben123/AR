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

    let showAddTags = false, showEditTags = false, showDeleteTags = false, reCreate=false, showError=false;
    var tagData = {tagName:"Default"}, coords={}, tagDelete = {tagId:null};

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


    function getGeoLocation(func){
             if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(func,errorGeoLocation);//send the geolocation data to another function
            } else{
                //this is if the browser doesnt support geolocation, do pop up message or something
                errorMessage = "Your browser does not support geo";
                showError = true;
            }
    }

    async function getTagGeoLocation(tag) {
        console.log("You placed tag " + tag._id + "!");
        //need to check if the tag is picked up, if not then make some error popup
        tagData=tag
        coords = tag.coords;


        //need to get the tag coords from geolocation, then save tag data in database
        
        if(tag.placed){
            errorMessage = "The tag is not picked up, pick the tag up first before being able to place it";
            showError = true;
        }
        else{
            //need to get the tag coords from geolocation, then save tag data in database
            // Set geolocation
            getGeoLocation(async (position)=> {
                setTagLocation(position);

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

                rerunLoadFunction();

            });
        }
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
                error = "User denied the request for Geolocation";
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
        tagData = {tagName:"Default"};//resetting the tagData without having to reload page
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
        showAddTags = false;
        newTag();
    }


</script>




<body>


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
                        <button on:click={() => viewTag(tag)}>Find</button>
                        {#if !tag.placed}
                         <button on:click={() => getTagGeoLocation(tag)}>Place</button>
                        {/if}
                        <button on:click={() => editTag(tag)}>Edit</button>
                        <button on:click={() => deleteTag(tag)}>Delete</button>

                    </div>
                {/if}
            </div>
        {/each}

<div class="bottom">
    <!-- Button to create a tag at the bottom of the page -->
<button class="menuButton" on:click={() =>createNewTag()}>Create Tag +</button>
</div>

<!-- ////// -->
<!-- MODALS -->
<!-- ////// -->

<!-- Stops modals from being loaded in page if there is no tag data. Prevents errors. -->
{#if tagData}

<!-- Add Tag Model. Shows when 'showAddTags' variable is set to true -->
<Modal bind:showModal={showAddTags}>
    <h2>Enter Tag Name</h2>
    <input bind:value={tagData.tagName} placeholder = Name><br>
    <h2>Enter Tag Description</h2>
    <input bind:value={tagData.description} placeholder = Empty><br>
    <h2>Select Tag Type</h2>
    <div id="iconBtns">
        <button class="menuButtonV2 {tagData.icon === "1" ? 'active' : ''}" on:click={() => (tagData.icon = "1")}>&#128138</button>
        <button class="menuButtonV2 {tagData.icon === "2" ? 'active' : ''}" on:click={() => (tagData.icon = "2")}>&#128273</button>
        <button class="menuButtonV2 {tagData.icon === "3" ? 'active' : ''}" on:click={() => (tagData.icon = "3")}>&#128091</button>
        <button class="menuButtonV2 {tagData.icon === "4" ? 'active' : ''}" on:click={() => (tagData.icon = "4")}>&#11088</button>
    </div><br>
    <button class="menuButton" on:click ={() =>submitInfo()}>Submit</button>
</Modal>

<!-- Edit Tag Model. Shows when 'showEditTags' variable is set to true -->
<Modal bind:showModal={showEditTags}>
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
        <button class="menuButtonV2 {tagData.icon === "1" ? 'active' : ''}" on:click={() => (tagData.icon = "1")}>&#128138</button>
        <button class="menuButtonV2 {tagData.icon === "2" ? 'active' : ''}" on:click={() => (tagData.icon = "2")}>&#128273</button>
        <button class="menuButtonV2 {tagData.icon === "3" ? 'active' : ''}" on:click={() => (tagData.icon = "3")}>&#128091</button>
        <button class="menuButtonV2 {tagData.icon === "4" ? 'active' : ''}" on:click={() => (tagData.icon = "4")}>&#11088</button>
    </div><br>
    <button class="menuButton" on:click ={() =>submitEdit()}>Submit</button>
</Modal>

<Modal bind:showModal={showError}>
    <h2 style="color: red;">{errorMessage}</h2>
</Modal>


<!-- Delete Tag Modal. Shows when 'showDeleteTags' is set to true -->
<Modal bind:showModal={showDeleteTags}>
    <h2>Delete Tag</h2>
    <h3>Are You Sure You Want To Delete This Tag?</h3>
    <button class="button" on:click ={() =>submitDelete()}>Yes</button>
</Modal>

{/if}


</body>

<style>
   .title {
        position:sticky;
        width:100%;
        text-align:center;
    }

    .bottom{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    color: white;
    text-align: center;
    }

    .menuButton {
        margin-top:5%;
        font-size: large;
        background-color: rgb(219, 238, 255);
        border-radius: 4px;
        outline: none;
        font-size: larger;
        width:90%;
        max-width: 800px;
    }

    .menuButton:hover {
        background-color: rgb(103, 132, 156);
        color:white;
        transition-duration: 0.4s;
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
    }
    .accordionButton {
        width: 100%;
        display:block;
        background-color: aliceblue;
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
    }
</style>
