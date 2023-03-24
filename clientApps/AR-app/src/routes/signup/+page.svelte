<script>
    let name = '';
    let pass = '';
    let email = '';
        
    function validateInput()
        {
            if (name == '')
                {
                    alert("NAME IS EMPTY");
                }
            else if (pass == '')
                {
                    alert("PASSWORD IS EMPTY");
                }
            else if (pass == '')
                {
                    alert("EMAIL IS EMPTY");
                }
            else
                {
                    alert("Signing Up");
                    signUp();
                }
        }

    async function signUp() {
        const res = await fetch(window.location.origin + "/api/user", 
        {
            method:'POST',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
            body: JSON.stringify({
                "userName": name,
                "email": email,
                "password" : pass
             })
        })
    }

    </script>
    
    <body>
        <div class = "content">
            
            <div class="topBar">
                <h1>Please Sign Up</h1>
            </div>
    
            <div class ="input">
                <input bind:value={name} placeholder = Name><br>
                <input bind:value={email} placeholder = Email><br>
                <input type="password" bind:value={pass} placeholder = Password><br>
            </div>
            
            <div class = "buttons">
                <button on:click={validateInput}>
                    Sign Up
                </button>
            </div>
    
        </div>	
        
    </body>
    
    <style>
        .content {
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 10px;
        }
        .topBar {
            position:sticky;
            margin: auto;
            width: 53%;
            text-align: centre;
        }
        .input {
            position:sticky;
            margin: auto;
            width: 50%;
            text-align: centre;
            padding: 10px;
        }
        .buttons {
            position: sticky;
            margin: auto;
            width: 25%;
    
        }
    
</style>