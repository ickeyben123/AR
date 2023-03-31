<body>
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

    async function deleteUser(){
        console.log("You deleted this user !");

        const response = await fetch(window.location.origin + "/api/user",
        {
            method: 'DELETE',
            credentials: 'include'
        });

        window.location.reload();
    
    }
    
</script>