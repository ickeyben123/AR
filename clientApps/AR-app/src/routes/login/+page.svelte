<script>
    import {goto} from '$app/navigation';
    // supposed to be userName but had to change to username otherwise it will be confusing.
    let userName = '';
    let password = '';

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

        if(userName == '' || password == '')
        {
            toast.push("Invalid Entry");
            return;
        }
        console.log(userName);
        console.log(password);
        loginReq();
    }

    async function loginReq() {
        
        

        var req = {
            "userName": userName,
            "password": password
        }
   
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
                currentUserStore.set(userName);
                goto('/tags')
            }
            
        });
        

    }
</script>

    <div class = "content">
        
        <div class="inputbox">
            <div class="title">
                <h1>Please Log In</h1>
            </div>

            <div class ="input" style="text-align:left; ">
                Username<br>
                <input bind:value={userName}><br>
                Password<br>
                <input type="password" bind:value={password}><br>
            </div>
            <br>
            <div class = "buttons" style="width:85%">
                <button on:click={logIn}>
                    Log In
                </button>
            </div>
            <br>
            <div style="color:lightblue;">
                &#8212 &#8212 or &#8212 &#8212
            </div>
            <br>
            
            <div class = "buttons" style="width:85%;">
                <button on:click={() => goto('/signup')}>
                    Sign Up
                </button>
            </div>
        </div>

    </div>
    
<style>
    .inputbox {
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        padding: 5px;
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