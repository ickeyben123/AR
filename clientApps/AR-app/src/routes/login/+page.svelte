<script>
    import {goto} from '$app/navigation';
    // supposed to be userName but had to change to username otherwise it will be confusing.
    let username = '';
    let pass = '';

     // For notifications
    import { toast } from '@zerodevx/svelte-toast';
    import { currentUserStore } from '../stores.js';

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

        if(username == '' || pass == '')
        {
            toast.push("Invalid Entry");
            return;
        }
        console.log(username);
        console.log(pass);
        loginReq();
    }

    async function loginReq() {
        
        

        var req = {
            "userName": username,
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
            if(response.status!=200){
                toast.push(data['message']);
            }
            else
            {
                toast.push("Signed in.");
                currentUserStore.set(username);
                goto('/tags')
            }
            
        });

    }
</script>

    <div class = "content">
        
        <div class="title">
            <h1>Please Log In</h1>
        </div>

        <div class ="input">
            <input bind:value={username} placeholder = Name><br>
            <input type="password" bind:value={pass} placeholder = Password><br>
        </div>
        <br>
        <div class = "buttons">
            <button on:click={logIn}>
                LOG IN
            </button>
        </div>
        
        <div class="title">
            <h1>----- OR -----</h1>
        </div>
        
        <div class = "buttons">
            <button on:click={() => goto('/signup')}>
                SIGN UP
            </button>
        </div>

    </div>
    
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
    line-height: 50px;   
    }
    .input {
        position:sticky;
        margin: auto;
        vertical-align: middle;
        text-align: centre;
        padding: 10px;
    }
    .buttons {
        position: sticky;
        margin: auto;
        width: 40%;
        
    }
</style>