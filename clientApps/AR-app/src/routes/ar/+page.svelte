<!-- Scipt is here to make sure ar.js is loaded in proper order:
  
Svelte Calls onMount -> Libraries loaded -> a-scene created

a counter is kept of the libraries loaded so a-scene is only created
once more all 3 libraries have been loaded in.
-->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<head>
    <!-- <script 
      src="https://aframe.io/releases/1.4.1/aframe.min.js"
      on:load={loadComponent}></script>
    <script 
      type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js'
      on:load={loadComponent}></script>

       -->
</head>

<script>
  import { onMount } from "svelte";
  import { toast } from '@zerodevx/svelte-toast';
  import * as THREE from 'three';
  import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js'

  /** @type {import('./$types').PageData} */  
  export let data;

  let tagId;
  let latitude;
  let longitude;
  let mounted = false;
  let componentLoaded = 0;
  let altitude = 3; 
  let dist = 0;

  // Once the 3 components of our program are loaded ready is set to True
  // which will lead to AR being loaded
  $: ready = componentLoaded == 2;

  
  const loadComponent = () => {
    componentLoaded = componentLoaded + 1;
  };

  async function updateLatLong(){

    // fetch lat and long from database use tagId
    // Get data from page.js. Handled via Svelte.
    let item = data.tag_item
    // for debugging.
    console.log(item);
    console.log(item.coords);
    console.log(item.coords.latitude);
    console.log(item.coords.longitude);
    
    item.coords.latitude = item.coords.latitude+0.0001;
    item.coords.longitude = item.coords.longitude+0.0001;

    // parse lat and long into a usable string format.
    latitude = item.coords.latitude.toString();
    longitude = item.coords.longitude.toString();
  }

  async function setNotPlaced(){
    
    // change "placed" in database to false to repersent item being picked up.
    const response = await fetch(window.location.origin + "/api/tag/"+tagId,{
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          "placed":false,
        }
      )
      });
    }

  async function pickUp(){
    await setNotPlaced()

    // move page back to tags.
    window.location.href = "/tags"
  }

  let id;
let target;
let options;

function success(pos) {
  const crd = pos.coords;

  toast.push("Congratulations, you reached the target" + (dist));
}

function error(err) {
  console.error(`ERROR(${err.code}): ${err.message}`);
}

target = {
  latitude: 0,
  longitude: 0,
};

options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};


function main() {
 const canvas = document.getElementById('canvas1');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({canvas: canvas});

const arjs = new THREEx.LocationBased(scene, camera);
const cam = new THREEx.WebcamRenderer(renderer);

const geom = new THREE.BoxGeometry(20, 20, 20);
const mtl = new THREE.MeshBasicMaterial({color: 0xff0000});
const box = new THREE.Mesh(geom, mtl);

// Create the device orientation tracker
const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);

// Change this to a location close to you (e.g. 0.001 degrees of latitude north of you)
arjs.add(box, longitude, latitude+0.001); 

arjs.startGps();

requestAnimationFrame(render);

function render() {
    if(canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        const aspect = canvas.clientWidth/canvas.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    }

    // Update the scene using the latest sensor readings
    deviceOrientationControls.update();

    cam.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
}

onMount(() => {

console.log("mounted")

// url params contain our tagId which we will use to get lat and long.
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
tagId = urlParams.get('tagId')
updateLatLong();
mounted=true;

id = navigator.geolocation.watchPosition(success, error, options);
main();
});


  </script>


<canvas id='canvas1' style='background-color: black; width: 100%; height: 100%'></canvas>

  <div class="content">
    <button style="
      position: relative;
      z-index: 100;
      margin-top: 0px;
      margin-left: 0px;" 
      on:click={pickUp}>
      Pickup Tag
    </button>
  </div>

