<script>
    let confirmEmail;
    let email; 

    async function submitEmailChange(){
        if(checkIfSame()){
            let response = await fetch(window.location.origin + "/api/user/email", {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    "email":email,
                }
                )
            })
        } else {
            console.log("emails don't match");
            let matchingEmailsDiv = document.getElementById("matchingEmails"); 
            matchingEmailsDiv.textContent = "Emails need to be matching!";
        }
    } 

    function checkIfSame(){
        return confirmEmail == email;
    }
</script>

<body>
    <div class ="input">
        <input bind:value={email} placeholder = "email"><br>
        <input bind:value={confirmEmail} placeholder="confirm email">
    </div>
    <div class ="buttons">
        <button on:click={submitEmailChange}>
            Submit
        </button>
    </div>

   <label id="matchingEmails"></label> 
</body>
