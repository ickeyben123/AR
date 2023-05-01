<script>
    import { toast } from '@zerodevx/svelte-toast';
    let confirmEmail;
    let email; 

    async function submitEmailChange(){
        if(confirmEmail = email){

            if(!String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )){
                toast.push("Invalid Email!");
                return;
            }
            // if emails are same then send request to change emails.
            toast.push("Changing Email..");
            let response = await fetch(window.location.origin + "/api/user/email", {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    "email":email,
                }
                )
            });
            toast.push("Done!");
        } else {
            // todo: maybe change this to notification
            // alert user that emails dont match.
            console.log("emails don't match");
            toast.push("Emails do not match!");
        }
    } 
</script>


    <div class="inputbox">
        <div class ="input">
            <h2 style="text-align:center ">Enter the new Email</h2>
            <input bind:value={email} placeholder = "Email"><br>
            <input bind:value={confirmEmail} placeholder="Confirm Email">
        </div>

        <div class ="buttons">
            <button on:click={submitEmailChange}>
                Submit
            </button>
        </div>
    </div>

    <label id="matchingEmails"></label> 

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