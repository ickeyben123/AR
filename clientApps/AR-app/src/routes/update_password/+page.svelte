<script>
    import * as validation from '$lib/validation.js';
    import { toast } from '@zerodevx/svelte-toast';

    let confirmPass;
    let pass;

    

    async function submitPasswordChange(){

        if(confirmPass == pass){

            if(pass == ""){
                toast.push("Cannot have empty password!");
                return;
            }

            var errors = validation.validatePassword(pass);

            if(errors != ""){
                toast.push(errors);
                return;
            }   

            // if passwords are the same then send put request to change password.
            toast.push("Changing passwords...");
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
            toast.push("Done!");
        } else {
            console.log("passwords don't match");
            toast.push("Passwords do not match!");
        }
    }   
</script>

    <div class="inputbox">
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
    </div>

    <label id="matchingPasswords"></label>

<style>
    .inputbox {
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        padding: 5px;
    }
    .input {
        padding-top: 10px;
        display: grid;
        grid-auto-rows: 1;
    }
</style>


