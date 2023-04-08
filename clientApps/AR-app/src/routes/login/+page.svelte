<script>
    import {goto} from '$app/navigation';
    let name = '';
    let pass = '';

     // For notifications
    import { toast } from '@zerodevx/svelte-toast';

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

    // basic sanitation of name and pass.
    function logIn() {

        if(name == '' || pass == '')
        {
            toast.push("Invalid Entry");
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
   
        // query database for username and password.
        const response = await fetch(window.location.origin + "/api/user/login",
        {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(req) 
            
        });

        // response to response, check if username and password have been validated by backend.
        response.json().then(data => {
            console.log(JSON.stringify(data));
            const resp = JSON.stringify(data);
            if(resp == '{"message":"User Not found."}'){
                toast.push("Incorrect Login Entered.");
            }
            else
            {
                toast.push("Signed in.");
                goto('/tags')
            }
            
        });

    }

    </script>
    
    <body>
        <div class = "content">
            
            <div class="title">
                <h1>Please Log In</h1>
            </div>
    
            <div class ="input">
                <input bind:value={name} placeholder = Name><br>
                <input type="password" bind:value={pass} placeholder = Password><br>
            </div>
            
            <div class = "buttons">
                <button on:click={logIn}>
                    Log In
                </button>
            </div>
            
            <div class="title">
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
            text-align: center;
            padding: 10px;
        }
        .title {
        text-align: center;
        vertical-align: middle;
        line-height: 90px;   
        }
        .input {
            position:sticky;
            margin: auto;
            width: 100%;
            vertical-align: middle;
            text-align: centre;
            padding: 10px;
        }
        .buttons {
            position: sticky;
            margin: auto;
            width: 25%;
    
        }
    
    </style>