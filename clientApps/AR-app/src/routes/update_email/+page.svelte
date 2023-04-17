<script>
    let confirmEmail;
    let email; 

    async function submitEmailChange(){
        if(checkIfSame()){
            // if emails are same then send request to change emails.
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
            // todo: maybe change this to notification
            // alert user that emails dont match.
            console.log("emails don't match");
            let matchingEmailsDiv = document.getElementById("matchingEmails"); 
            matchingEmailsDiv.textContent = "Emails need to be matching!";
        }
    } 

    function checkIfSame(){
        return confirmEmail == email;
    }
</script>


    <div class ="input">
        <h2 style="text-align:center ">Enter the new Email</h2>
        <input bind:value={email} placeholder = "Email"><br>
        <input bind:value={confirmEmail} placeholder="Confirm Email">
    </div>

    <div class ="buttons">
        <button on:click={submitEmailChange}>
            Submit
        </button>
    </div>

    <label id="matchingEmails"></label> 

<style>
    .input {
        padding-top: 10px;
        display: grid;
        grid-auto-rows: 1;
    }
</style>