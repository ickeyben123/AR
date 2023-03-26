<!-- Scipt is here to make sure ar.js is loaded in proper order:
  
Svelte Calls onMount -> Libraries loaded -> a-scene created

a counter is kept of the libraries loaded so a-scene is only created
once more all 3 libraries have been loaded in.
-->


<script>
  import { onMount } from "svelte";
  let tagId;
  let latitude;
  let longitude;
  let mounted;
  let componentLoaded = 0;
  let altitude = 3; 
  $: ready = componentLoaded == 3;

  
  const loadComponent = () => {
    componentLoaded = componentLoaded + 1;
  };

  async function updateLatLong(){
    const res = await fetch(window.location.origin + '/api/tag/' + tagId,{
                method: 'GET',
                credentials: 'include'
            });
    let item =  await res.json();

    console.log(item);
    console.log(item.coords);
    console.log(item.coords.latitude);
    console.log(item.coords.longitude);

    latitude = item.coords.latitude.toString();
    longitude = item.coords.longitude.toString();

    mounted = true;
  }

  onMount(() => {
    console.log("mounted")
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    tagId = urlParams.get('tagId')
    updateLatLong();
  });

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const handlePositionCallback = (pos) => {
      console.log(pos);
  }

  function getCurrentCords(){
      const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.watchPosition(handlePositionCallback,console.log,options);
  }

  async function setNotPlaced(){
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

  function pickUp(){
    setNotPlaced()
    window.location.href = "/tags"
  }


  </script>

<!-- 
each script also calls loadComponent function when loaded
loadComponent increments componentsLoaded, this is only called 
once svelte has mounted this page.  
-->
<svelte:head>
  {#if mounted}
    <script 
      src="https://aframe.io/releases/1.0.4/aframe.min.js"
      on:load={loadComponent}></script>
    <script 
      type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js'
      on:load={loadComponent}></script>
      <script 
      type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex-location-only.js'
      on:load={loadComponent}></script>
  {/if}

</svelte:head>


<!--
once svelte has mounted and libraries have been loaded ready boolean will be
true and a-scene will be loaded in.

TODO : remove simulateLatitude and simulateLongitude once finished, as they're 
for testing
-->
{#if ready}
<button style="position: fixed;
  z-index: 100;
  margin-top: 0px;
  margin-left: 0px;" on:click={pickUp}>
  Click Me
</button>
<body>
  <a-scene vr-mode-ui='enabled: false' arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false' renderer='antialias: true; alpha: true'>
    <a-camera gps-new-camera='gpsMinDistance: 1; simulateAltitude: {altitude}'></a-camera>
    <a-entity material='color: red' geometry='primitive: box' gps-new-entity-place="latitude: {latitude}; longitude: {longitude}" scale="10 10 10"></a-entity>
  </a-scene>
</body>
{/if}