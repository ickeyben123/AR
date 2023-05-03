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
  const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#canvas1') 
    });

    const geom = new THREE.BoxGeometry(20,20,20);

    //const arjs = new THREEx.LocationBased(scene, camera);

    // You can change the minimum GPS accuracy needed to register a position - by default 1000m
    const arjs = new THREEx.LocationBased(scene, camera, { gpsMinAccuracy: 15 } );
    const cam = new THREEx.WebcamRenderer(renderer, '#video1');

    const mouseStep = THREE.MathUtils.degToRad(5);


    let orientationControls;

    // Orientation controls only work on mobile device
    if (isMobile()){   
        orientationControls = new THREEx.DeviceOrientationControls(camera);
    } 

    let fake = null;
    let first = true;

    arjs.on("gpsupdate", pos => {
        if(first) {
            setupObjects(longitude, latitude);
            first = false;
        }
    });

    arjs.on("gpserror", code => {
        alert(`GPS error: code ${code}`);
    });

    // Uncomment to use a fake GPS location
    //fake = { lat: 51.05, lon : -0.72 };
    if(fake) {
        arjs.fakeGps(fake.lon, fake.lat);
    } else {
        arjs.startGps();
    } 


    let mousedown = false, lastX = 0;

    // Mouse events for testing on desktop machine
    if(!isMobile()) {
        window.addEventListener("mousedown", e=> {
            mousedown = true;
        });

        window.addEventListener("mouseup", e=> {
            mousedown = false;
        });

        window.addEventListener("mousemove", e=> {
            if(!mousedown) return;
            if(e.clientX < lastX) {
                camera.rotation.y += mouseStep; 
                if(camera.rotation.y < 0) {
                    camera.rotation.y += 2 * Math.PI;
                }
            } else if (e.clientX > lastX) {
                camera.rotation.y -= mouseStep;
                if(camera.rotation.y > 2 * Math.PI) {
                    camera.rotation.y -= 2 * Math.PI;
                }
            }
            lastX = e.clientX;
        });
    }

	function isMobile() {
    	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        	// true for mobile device
        	return true;
    	}
    	return false;
	}

    function render(time) {
        resizeUpdate();
        if(orientationControls) orientationControls.update();
        cam.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function resizeUpdate() {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth, height = canvas.clientHeight;
        if(width != canvas.width || height != canvas.height) {
            renderer.setSize(width, height, false);
        }
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    function setupObjects(longitude, latitude) {
        // Use position of first GPS update (fake or real)
        const material = new THREE.MeshBasicMaterial({color: 0xff0000});
        const material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
        const material3 = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const material4 = new THREE.MeshBasicMaterial({color: 0x00ff00});
        arjs.add(new THREE.Mesh(geom, material), longitude, latitude + 0.001); // slightly north
        arjs.add(new THREE.Mesh(geom, material2), longitude, latitude - 0.001); // slightly south
        arjs.add(new THREE.Mesh(geom, material3), longitude - 0.001, latitude); // slightly west
        arjs.add(new THREE.Mesh(geom, material4), longitude + 0.001, latitude); // slightly east
    }

    requestAnimationFrame(render);
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


<video id='video1' autoplay playsinline style='display:none'></video>
<canvas id="canvas1" style='background-color: black; width:100%; height:100%; display:block'></canvas>

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

