<!-- Scipt is here to make sure ar.js is loaded in proper order:
  
Svelte Calls onMount -> Libraries loaded -> a-scene created

a counter is kept of the libraries loaded so a-scene is only created
once more all 3 libraries have been loaded in.
-->
<script>
  import { onMount } from "svelte";
  let mounted;
  let componentLoaded = 0;
  let altitude = 3; 
  $: ready = componentLoaded == 3;


  const loadComponent = () => {
    componentLoaded = componentLoaded + 1;
  };

  onMount(() => {
    console.log("mounted");
    mounted = true;
  });

  const getLatitude = () => {
    return "52.9529364"
  }

  const getLongitude = () => {
    return "-1.1878827"
  }

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
<a-scene vr-mode-ui='enabled: false' arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false' renderer='antialias: true; alpha: true'>
  <a-camera gps-new-camera='gpsMinDistance: 1; simulateAltitude: {altitude}'></a-camera>
  <a-entity material='color: red' geometry='primitive: box' gps-new-entity-place="latitude: {getLatitude()}; longitude: {getLongitude()}" scale="10 10 10"></a-entity>
</a-scene>
{/if}

