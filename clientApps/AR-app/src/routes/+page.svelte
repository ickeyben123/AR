<div class = "content">   
  <img class = "image" src="src/lib/assets/Find AR-logos_transparent.png" >
  
  <h3> Your Things? We Find Them. </h3>

  <br>

  <a class="btn" href="/login">LOG IN</a>
  <p></p>
  <a class="btn" href="/signup">REGISTER</a>
  <p></p>
  

  <div class="wrapper">
      <div class="box">
          <div class="left">
              <video width="90%" height="90%" autoplay loop muted>
                  <source src="src/lib/assets/home1.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
          </div>
            <div class="right center">
        
                <h1 class="long_text">View your tags</h1>
            </div>
      </div>

      <div class="box">
        <div class="left">
            <video width="90%" height="90%" autoplay loop muted>
                <source src="src/lib/assets/home2.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
        </div>
          <div class="right center">
              <h1 class="long_text">Add your tags</h1>
          </div>
    </div>

    </div>
    
</div>	
 
<script>
  import { onMount } from "svelte";
  import {goto} from '$app/navigation';

	onMount(() => {
		console.log("Checking cookies");
    if(localStorage.getItem("userName") != "Not Logged In!"){
      goto("/tags")
    }
	});
</script>

<style>

.box {
  width:100%;
max-width: 350px;
max-height: 300px;
background-color: #369CE5;
border-radius: 4px;
margin-bottom: 20px;
}

.wrapper {
display: grid;
justify-items: center;
gap: 10px;
vertical-align: middle;
text-align: center;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
width: 100%;
}

.container {
margin: 1em;
}


.top {
width: calc(100% - 6px);
min-height: 200px;
}

.left {
width: calc(55% - (.25em));
float: left;
height: 100%;
margin-top:0em;
}

.right {
width: calc(45% - (.25em));
float: right;
height: 100%;
margin-top: 0em;
}


.image {
  max-width: 200px;
  margin: auto;
  text-align: centre;
  background: #FFFDFA;
}

.long_text {
  width:100%;
  height:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;

  color: #FFFDFA;
  font-size:40px;
right: 5px;
margin: 0 0;
}

video {

position: relative;
top: 50%;
transform: translateY(-50%);
  
}

.title {
  position:sticky;
  margin: auto;
  display: inline-block;
  text-align: centre;
}
.btn {
  display: inline-block;
  margin:auto;
  border-radius: 4px;
  background: #369CE5;
  color: #FFFDFA;
  width: 100%;
  min-width: 20px;
  max-width: 250px;
  font-size: larger;
  padding: 20px 0px;
}
.btn:hover {
  background-color: #79b9e7;
  color:white;
  transition-duration: 0.4s;
}
</style>
