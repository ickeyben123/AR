<script>

    import {slide} from 'svelte/transition';
    import { onMount } from 'svelte';
    import Modal from './Modal.svelte';
    import { invalidate, invalidateAll } from '$app/navigation';

    let showAddTags = false, showEditTags = false, reCreate=false;
    var tagData = {tagName:"Default"}, coords={};

    // Get data from page.js
    /** @type {import('./$types').PageData} */  
    export let data;

    function rerunLoadFunction() {
        // reload data
        invalidate('app:tags');
        reCreate=!reCreate;
        window.location.reload();
    }

    let tags = data.tags;

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

    async function newTag()
    {
        var req = {
            "tagName": tagData.tagName,
            "coords": {"longitude" : tagData.longitude, "latitude" : tagData.latitude, "elevation": 0},
            "description": tagData.description,
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

    function createNewTag() {
        console.log("You made a new tag!");
        showAddTags = true;
    }

    function placeTag(tag) {
        console.log("You placed tag " + tag.id + "!");
    }

    function editTag(tag) {
        console.log("You edited tag " + tag.id + "!");
        tagData=tag
        coords=tag.coords
        showEditTags = true;
    }

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

    function viewTag(tag) {
        console.log("You viewed tag " + tag.id + "!");
    }

    function deleteTag(tag) {
        console.log("You deleted tag " + tag.id + "!");
    }
    function submitInfo() {
        console.log(tagData.tagName);
        newTag();
    }

</script>

<body>
<div class="topbar">
    <h1>Your Tags</h1>
</div>

    {#if !data.failed}
        {#each tags as tag}
            <div class="accordionPanel">
                {#key reCreate}
                <button on:click={() => expand(tag)} class="accordionButton">
                    <div class="accordionIcon">&#128273</div> {tag.tagName} 
                </button>
                {/key}
                {#if tag.active}
                    <div transition:slide class="accordionContent" >
                        <p>
                            {tag.description}
                        </p>
                        <button on:click={() => viewTag(tag)}>Find</button>
                        <button on:click={() => placeTag(tag)}>Place</button>
                        <button on:click={() => editTag(tag)}>Edit</button>
                        <button on:click={() => deleteTag(tag)}>Delete</button>

                    </div>
                {/if}
            </div>
        {/each}
    {/if}

<button class="menuButton" on:click={() =>createNewTag()}>Create Tag +</button>

{#if tagData}
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
    <button class="menuButton" on:click ={() =>submitInfo()}>Sumbit</button>
</Modal>

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
{/if}


</body>

<style>
    /*
    .topBar {
        position:sticky;
    }
    */
    .menuButton {
        text-align: center;
        font-size: large;
        background-color: aliceblue;
        border-radius: 4px;
        outline: none;

    }
    .menuButton:hover {
        background-color: rgb(103, 132, 156);
        color:white;
        transition-duration: 0.4s;
    }
    .accordionPanel {
        display: table;
        border-radius: 4px;
        width:60%;
    }
    .accordionButton {
        width: 100%;
        display:block;
        background-color: aliceblue;
        border-radius: 4px;
        text-align: center;
        outline:none;
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
