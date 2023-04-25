<div class = "content">   
    <img class = "image" src="src/lib/assets/Find AR-logos_transparent.png" >
    
    <h3> Your Things? We Find Them. </h3>
    
    <br>
    <div class="wrapper">
        <div class="box">
            <div class="left">
                <video width="90%" height="90%" autoplay loop muted>
                    <source src="src/lib/assets/home1.webm" type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
            </div>
              <div class="right center">
                <h1>VIEW YOUR TAGS</h1>
              </div>
        </div>
        <div class="box">
            <video width="90%" height="90%" autoplay loop muted>
                <source src="src/lib/assets/home2.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
        </div>

      </div>
      

    <a class="btn" href="/login">LOG IN</a>
    <p></p>
    <a class="btn" href="/signup">REGISTER</a>
</div>	
   


<style>

.box {
    width:100%;
max-width: 500px;
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
  width: calc(60% - (.5em + 6px));
  float: left;
  height: 100%;
  margin-top: 1em;
}

.right {
  width: calc(40% - (.5em + 6px));
  float: right;
  height: 100%;
  margin-top: 1em;
}


.image {
    max-width: 45%;
    margin: auto;
    text-align: centre;
    background: #FFFDFA;
}

.long_text{
    width:50px;
    position:relative;
  top: 50%;

  transform: translateY(-50%);
}

video {
  

    
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
    width: 50%;
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
