<script>
    let confirmPass;
    let pass;

    async function submitPasswordChange(){
        if(checkIfSame()){
            // if passwords are the same then send put request to change password.
            let response = await fetch(window.location.origin + "/api/user/pass", {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    "password":pass,
                }
                )
            })
        } else {
            console.log("passwords don't match");
            // alert user passwords do not match.
            let matchingPasswordsDiv = document.getElementById("matchingPasswords"); 
            matchingPasswordsDiv.textContent = "Passwords need to be matching!";
        }
    } 

    function checkIfSame(){
        confirmPass == pass;
    }
</script>

    <div class ="input">
        <h2 style="text-align: center;">Enter your new password</h2>
        <input  bind:value={pass} placeholder = "Password"><br>
        <input bind:value={confirmPass} placeholder = "Confirm Password"><br>
    </div>

    <div class ="buttons">
        <button on:click={submitPasswordChange}>
            Submit
        </button>
    </div>

    <label id="matchingPasswords"></label>

<style>
    .input {
        padding-top: 10px;
        display: grid;
        grid-auto-rows: 1;
    }
</style>


