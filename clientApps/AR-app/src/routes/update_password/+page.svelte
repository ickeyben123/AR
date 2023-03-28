<script>
    let confirmPass;
    let pass;

    async function submitPasswordChange(){
        if(checkIfSame()){
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
            let matchingPasswordsDiv = document.getElementById("matchingPasswords"); 
            matchingPasswordsDiv.textContent = "Passwords need to be matching!";
        }
    } 

    function checkIfSame(){
        confirmPass == pass;
    }
</script>

<body>
    <div class ="input">
        <input bind:value={pass} placeholder = "password"><br>
        <input bind:value={confirmPass} placeholder = "confirm password"><br>
    </div>

    <div class ="buttons">
        <button on:click={submitPasswordChange}>
            Submit
        </button>
    </div>

    <label id="matchingPasswords"></label>
</body>

