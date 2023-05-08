<script>
    let userName = '';
    let password = '';
    let email = '';
	let n;
    import * as validation from '$lib/validation.js';
    import {goto} from '$app/navigation';

    // For notifications
    import { toast } from '@zerodevx/svelte-toast';

    async function signUp() {
        var errors = validation.validatePassword(password);

        if(errors != ""){
            toast.push(errors);
            return;
        } 

        // send request to add new user to database.
        const res = await fetch(window.location.origin + "/api/user", 
        {
            method:'POST',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
            body: JSON.stringify({
                "userName": userName,
                "email": email,
                "password" : password
             })
        })

        res.json().then(data => {
            console.log(JSON.stringify(data));
            const resp = JSON.stringify(data);
            if(res.status!=200){
                toast.push(data['message']);
            }
            else
            {
                toast.push("Signed up. Please login with your previously entered details.");
                goto('/login')
            }
            
        });
    }

</script>

    <div class = "content">
        
        <div class="inputbox centre">
            <div class="title">
                <h1>Sign Up</h1>
            </div>

            <div class ="input">
                Username<br>
                <input bind:value={userName}><br>
                Email<br>
                <input bind:value={email}><br>
                Password<br>
                <input type="password" bind:value={password}><br>
            </div>
            <br>
            <div class = "buttons" style="width:85%;">
                <button on:click={signUp}>
                    Sign Up
                </button>
            </div>
        </div>

    </div>	
        

    

<style>
    .inputbox {
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        padding: 10px;
        width: 300px;
        height:100%;
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