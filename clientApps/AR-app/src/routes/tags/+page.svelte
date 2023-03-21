
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
    import Modal from './Modal.svelte';
    import { invalidate, invalidateAll } from '$app/navigation';
	import { HtmlTag } from 'svelte/internal';


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
        window.location.reload();
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
        var req = {
            "tagName": tagData.tagName,
            "coords": {"longitude" : tagData.longitude, "latitude" : tagData.latitude, "elevation": 0},
            "description": tagData.description,
            "icon": tagData.icon,
            "placed" : true
        }

        const response = await fetch("http://localhost:3000/tag",
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req) 
        });

        rerunLoadFunction();
    }

    // Called to create a edit a tag, specified from the tagData that should be set beforehand.
    async function submitEdit(){
        const response = await fetch("http://localhost:3000/tag/"+tagData._id,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tagData)
        });

        rerunLoadFunction();

    }
    // called to delete a tag after confirmation that the user wants it deleted
    async function submitDelete(){
        var tagId = tagDelete.tagId;//get the tag ID

        console.log("You deleted tag " + tagId + "!");

        const response = await fetch('http://localhost:3000/tag/' + tagId,
        {
            method: 'DELETE',
            credentials: 'include'
        });

        rerunLoadFunction();
    }

    function createNewTag() {
        console.log("You made a new tag!");
        showAddTags = true;
    }

    function getTagGeoLocation(tag) {
        console.log("You placed tag " + tag._id + "!");
        //need to check if the tag is picked up, if not then make some error popup
        tagData=tag
        coords = tag.coords;

        //need to get the tag coords from geolocation, then save tag data in database
        
        if(navigator.geolocation){
            tagData = tag;
            navigator.geolocation.getCurrentPosition(placeTag,errorGeoLocation);//send the geolocation data to another function
        } else{
            //this is if the browser doesnt support geolocation, do pop up message or something
            errorMessage = "Your browser does not support geo";
            showError = true;
        }


        //also need to place the tag as not picked up anymore
    }

    async function placeTag(position){
        coords.latitude = position.coords.latitude;
        coords.longitude = position.coords.longitude;

        const response = await fetch("http://localhost:3000/tag/"+tagData._id,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tagData)
        });

        rerunLoadFunction();
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
        console.log("You viewed tag " + tag.id + "!");
    }

    //Called to show the confirmation screen, then the user can confirm they want 
    //delete the tag
    async function deleteTag(tag) {
        tagDelete.tagId = tag._id; //set the tag ID for the tag we want to delete
        showDeleteTags = true;
    }

    function submitInfo() {
        console.log(tagData.tagName);
        newTag();
    }


</script>




<body>


    <!-- Title for Tags page -->
<div class="topBar">
    <h1>Your Tags</h1>
</div>

<!-- /////////// -->
<!-- TAG DISPLAY -->
<!-- /////////// -->

<!-- Conditional that it only shows tags if the data has loaded -->
    {#if !data.failed}
    <!-- Goes through each tag in the fetched tags of the user to create
        tag items for manipulation  -->
        {#each tags as tag}
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
                        <p>
                            {tag.description}
                        </p>
                        <button on:click={() => viewTag(tag)}>Find</button>
                        <button on:click={() => getTagGeoLocation(tag)}>Place</button>
                        <button on:click={() => editTag(tag)}>Edit</button>
                        <button on:click={() => deleteTag(tag)}>Delete</button>

                    </div>
                {/if}
            </div>
        {/each}
    {/if}

    <!-- Button to create a tag at the bottom of the page -->
<button class="menuButton" on:click={() =>createNewTag()}>Create Tag +</button>

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
    <h2>Enter Tag Coordinates</h2>
    <h5>Latitude</h5>
    <input bind:value={coords.latitude} placeholder = 00.0000><br>
    <h5>Longitude</h5>
    <input bind:value={coords.longitude} placeholder = 00.0000><br>
    <h2>Select Tag Type</h2>
    <div id="iconBtns">
        <button class="menuButton" on:click={() => (tagData.icon = "1")}>&#128138</button>
        <button class="menuButton" on:click={() => (tagData.icon = "2")}>&#128273</button>
        <button class="menuButton" on:click={() => (tagData.icon = "3")}>&#128091</button>
        <button class="menuButton active" on:click={() => (tagData.icon = "4")}>&#11088</button>
    </div><br>
    <button class="menuButton" on:click ={() =>submitInfo()}>Sumbit</button>
</Modal>

<!-- Edit Tag Model. Shows when 'showEditTags' variable is set to true -->
<Modal bind:showModal={showEditTags}>
    <h2>Edit Tag Name</h2>
    <input bind:value={tagData.tagName} placeholder = Name><br>
    <h2>Edit Tag Description</h2>
    <input bind:value={tagData.description} placeholder = Empty><br>
    <h2>Edit Tag Coordinates</h2>
    <h5>Latitude</h5>
    <input bind:value={coords.latitude} placeholder = Name><br>
    <h5>Longitude</h5>
    <input bind:value={coords.longitude} placeholder = Name><br>
    <button class="menuButton" on:click ={() =>submitEdit()}>Sumbit</button>
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


<!-- In Progress Code for Placing -->
<script> //Secondary script tag for button selection
    //Make button active
    
    var header = document.getElementById("iconBtns");
    var btns = header.getElementsByClassName("menuButton");
    
    for (var i = 0; i < btns.length; i++)
    {
        btns[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("active");

            // If there's no active class
            if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
            }

            // Add the active class to the current/clicked button
            this.className += " active";
        });
    }
</script>

</body>

<style>
   .topBar {
        position:sticky;
        width:100%;
        text-align:center;
    }
    .menuButton {
        margin-top:5%;
        text-align: center;
        font-size: large;
        background-color: rgb(219, 238, 255);
        border-radius: 4px;
        outline: none;
        font-size: larger;
        width:100%;
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
        background-color:rgb(232, 232, 232);
        border-radius: 4px;
    }
</style>
