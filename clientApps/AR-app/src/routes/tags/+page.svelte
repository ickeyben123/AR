<script>

    import {slide} from 'svelte/transition';
    import { onMount } from 'svelte';
    import Modal from './Modal.svelte';

    let loaded = false;
    let showModal = false;
    let tagName = '';

    // Get data from page.js
    /** @type {import('./$types').PageData} */  
    export let data;
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
            "tagName": tagName,
            "coords": {"longitude" : 0.2547005, "latitude" : 745.210, "elevation": 0},
            "placed" : true
        }

        const response = await fetch("http://localhost:3000/tag",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify
            (req) 
        });
    }

    function createNewTag() {
        console.log("You made a new tag!");
        showModal = true;
    }

    function placeTag(id) {
        console.log("You placed tag " + id + "!");
    }

    function editTag(id) {
        console.log("You edited tag " + id + "!");
    }

    function viewTag(id) {
        console.log("You viewed tag " + id + "!");
    }

    function deleteTag(id) {
        console.log("You deleted tag " + id + "!");
    }
    function submitInfo() {
        console.log(tagName);
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
            <button on:click={() => expand(tag)} class="accordionButton">
                <div class="accordionIcon">&#128273</div> {tag.tagName} 
            </button>
            
            {#if tag.active}
                <div transition:slide class="accordionContent" >
                    <p>
                        (Description)
                    </p>
                    <button on:click={() => viewTag(tag._id)}>Find</button>
                    <button on:click={() => placeTag(tag._id)}>Place</button>
                    <button on:click={() => editTag(tag._id)}>Edit</button>
                    <button on:click={() => deleteTag(tag._id)}>Delete</button>

                </div>
            {/if}
        </div>
    {/each}
{/if}

<button class="menuButton" on:click={() =>createNewTag()}>Create Tag +</button>

<Modal bind:showModal>
    <h2>Enter Tag Name</h2>
    <input bind:value={tagName} placeholder = Name><br>
    <button class="menuButton" on:click ={() =>submitInfo()}>Sumbit</button>
</Modal>


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
