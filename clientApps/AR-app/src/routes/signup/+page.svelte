<script>
    let name = '';
    let pass = '';
    let email = '';
	let n;
    import * as validation from '$lib/validation.js';
    import {goto} from '$app/navigation';

    // For notifications
    import { toast } from '@zerodevx/svelte-toast';

    async function signUp() {
        var errors = validation.validatePassword(pass);
        if(errors != ""){
            toast.push(errors);
            return;
        }  
        
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

        res.json().then(data => {
            console.log(JSON.stringify(data));
            const resp = JSON.stringify(data);
            if(res.status!=200){
                toast.push(data['message']);
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
                <h1>Please Sign Up</h1>
            </div>
    
            <div class ="input">
                <input bind:value={name} placeholder = Name><br>
                <input bind:value={email} placeholder = Email><br>
                <input type="password" bind:value={pass} placeholder = Password><br>
            </div>
            
            <div class = "buttons">
                <button on:click={signUp}>
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