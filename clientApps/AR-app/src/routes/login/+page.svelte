<script>
    import {goto} from '$app/navigation';
    let name = '';
    let pass = '';
    
    /*  Function to display all names in db, used during testing
    async function loadNames() {
        await fetch("http://localhost:3000/user")
        .then(async (response) => {
            try {
                const data = await response.json();
                names = data;
                alert("got names");
            } catch (err) {
                console.log(err);
            }
            });
  
        }
    */

    function logIn() {

        if(name == '' || pass == '')
        {
            alert("Invalid Entry");
            return;
        }
        console.log(name);
        console.log(pass);
        loginReq();
    }

    async function loginReq() {
        
        

        var req = {
            "userName": name,
            "password": pass
        }

        console.log(JSON.stringify({userName: "xxx", password: "yyy"}));
        console.log(JSON.stringify(req));
   

        const response = await fetch("http://localhost:3000/user/login",
        {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify(req) 
            
        });

        response.json().then(data => {
            console.log(JSON.stringify(data));
            const resp = JSON.stringify(data);
            if(resp == '{"message":"User Not found."}'){
                alert("INCORRECT");
            }
            else
            {
                alert("CORRECT");
                window.location.href = "http://localhost:4000/tags";
            }
            
        });

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
                <button on:click={() => goto('/signup')}>
                    Sign Up
                </button>
            </div>
    
        </div>
        
        <!-- Used with loadNames()
        {#each names as unName}
            <p>{unName.userName}</p>
        {/each}
        -->
        
        
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