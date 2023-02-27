<!-- Scipt is here to make sure ar.js is loaded in proper order:
  
Svelte Calls onMount -> Libraries loaded -> a-scene created

a counter is kept of the libraries loaded so a-scene is only created
once more all 3 libraries have been loaded in.
-->>
<script>
  import { onMount } from "svelte";
  let mounted;
  let componentLoaded = 0
  $: ready = componentLoaded == 3;


  const loadComponent = () => {
    componentLoaded = componentLoaded + 1;
  };

  onMount(() => {
    console.log("mounted");
    mounted = true;
  });
</script>

<!-- 
each script also calls loadComponent function when loaded
loadComponent increments componentsLoaded, this is only called 
once svelte has mounted this page.  
-->>
<svelte:head>
  {#if mounted}
    <script 
      src="https://aframe.io/releases/1.4.1/aframe.min.js"
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
  <a-camera gps-new-camera='gpsMinDistance: 5 simulateLatitude: 52.930926 simulateLongitude:-1.208513'></a-camera>
  <a-entity material='color: red' geometry='primitive: box' gps-new-entity-place="latitude: 52.930926; longitude: -1.208513" scale="10 10 10"></a-entity>
</a-scene>
{/if}

