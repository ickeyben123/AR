<body>

    <div class = "buttons">
        <button on:click={sendToSignOut}>
            Sign Out
        </button>
    </div>
    

    <div class = "buttons">
        <button on:click={sendToUpdateEmail}>
            Update Email
        </button>
    </div>

    <div class = "buttons">
        <button on:click={sendToUpdatePassword}>
            Update password
        </button>
    </div> 

    <div class = "buttons">
        <button on:click={sendToDeleteUser}>
            Delete User
        </button>
    </div> 

    <!--
        Brings up a model, to confirm User wnats to delete user
    -->
    <Modal bind:showModal={showDelete}>
        <h2>Delete User</h2>
        <h3>Are You Sure You Want To Delete This User?</h3>
        <button class="button" on:click ={() =>deleteUser()}>Yes</button>
    </Modal>
</body>

<script>
	import { get_root_for_style } from 'svelte/internal';
    import {goto} from '$app/navigation';
    import { toast } from '@zerodevx/svelte-toast';

    let showDelete = false;
    
    import Modal from '../Modal.svelte';

    // set location to the page for updating email
    function sendToUpdateEmail(){
        window.location.href = "/update_email";
    }

    // set location to the page for password email
    function sendToUpdatePassword(){
        window.location.href = "/update_password";
    }


    function sendToDeleteUser() {
         //set the tag ID for the tag we want to delete
        showDelete = true;
    }

    async function sendToSignOut(){
        //delete a cookie, then go back to home pagetoken

        //document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        const response = await fetch(window.location.origin + "/api/user/cookie",{
            method: 'POST',
            credentials: 'include'
        });
        //go back to home page
        goto("/"); 
    }

    async function deleteUser(){
        console.log("You deleted this user !");

        const response = await fetch(window.location.origin + "/api/user",
        {
            method: 'DELETE',
            credentials: 'include'
        });
        sendToSignOut();
        //window.location.reload();
    }
    
</script>