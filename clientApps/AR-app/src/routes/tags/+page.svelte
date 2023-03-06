<script>

    import {slide} from 'svelte/transition';
    import { onMount } from 'svelte';
    let loaded = false;

    // Get data from page.js
    /** @type {import('./$types').PageData} */  
    export let data;
    let tags = data.tags;

    function expand(section) {
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].id == section.id && tags[i].active == false) {
                tags[i].active = true;
            }
            else {
                tags[i].active = false;
            }
        }
    }
    function createNewTag() {
        console.log("You made a new tag!");
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
                    <button on:click={() => viewTag(tag.owner)}>Find</button>
                    <button on:click={() => placeTag(tag.owner)}>Place</button>
                    <button on:click={() => editTag(tag.owner)}>Edit</button>
                    <button on:click={() => deleteTag(tag.owner)}>Delete</button>

                </div>
            {/if}
        </div>
    {/each}
{/if}

<button class="menuButton" on:click={() =>createNewTag()}>Create Tag +</button>
</body>

<style>
    .topBar {
        position:sticky;
    }
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
