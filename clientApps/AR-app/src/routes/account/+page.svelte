

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
    async function updateEmail(newEmail){
        const response = await fetch("http://localhost:3000/user"{
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email":newEmail,
            }
        )
      });
    }

    function updatePassword(newPassword){  
        const response = await fetch("http://localhost:3000/user"{
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email":newPassword,
            }
        )
      });
    }
</script>


        