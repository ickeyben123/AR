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
/*
        if(name == '' || pass == '')
        {
            alert("Invalid Entry");
            return;
        }
*/
        loginReq();
    }

    async function loginReq() {
        

        const response = await fetch("http://localhost:3000/user/login",
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: "person176",
                password: "iQb.cN3Z.QrdM2A9k/s/vOtwSsp39gNiDtSjKqrXRiWOT9M/o0/zS"
            })
        });

        response.json().then(data => {
            console.log(JSON.stringify(data));
            const resp = JSON.stringify(data);
            if(resp == '{"data":false}'){
                alert("INCORRECT");
            }
            else if(resp == '{"data":true}')
            {
                alert("Successful!")
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