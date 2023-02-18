<script>
    let name = '';
    let pass = '';
        
    function logIn()
        {
            if (name == '')
                {
                    alert("NAME IS EMPTY");
                }
            else if (pass = '')
                {
                    alert("PASSWORD IS EMPTY");
                }
            else
                {
                    alert("Logging In");
                }
        }
        
        function signIn()
        {
            alert("Going To Sign In Page")
        }
    </script>
    
    <body>
        <div class = "content">
            
            <div class="topBar">
                <h1>Please Log In</h1>
            </div>
    
            <div class ="input">
                <input bind:value={name} placeholder = Name><br>
                <input bind:value={pass} placeholder = Password><br>
            </div>
            
            <div class = "buttons">
                <button on:click={logIn}>
                    Log In
                </button>
            </div>
            
            <div class="topBar">
                <h1>----- OR -----</h1>
            </div>
            
            <div class = "buttons">
                <button on:click={signIn}>
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
            width: 50%;
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