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

    function sendToUpdateEmail(){
        window.location.href = "/update_email";
    }
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

        const id = toast.push('Signing Out', {
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

        toast.set(id, { next: .5 })
        const response = await fetch(window.location.origin + "/api/user/cookie",{
            method: 'DELETE',
            credentials: 'include'
        });
        toast.set(id, { next: 1 })
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