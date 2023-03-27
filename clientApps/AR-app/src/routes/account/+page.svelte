<body>
    <div class = "buttons">
        <button on:click={sendToUpdateEmail}>
            Update Email
        </button>
    </div>
    <div class = "buttons">
        <button on:click={sendToUpdatePasswod}>
            Update password
        </button>
    </div> 
</body>

<script>   
    function sendToUpdateEmail(){
        window.location.href = "/update_email";
    }
    function sendToUpdatePasswod(){
        window.location.href = "/update_password";
    }
</script>


        