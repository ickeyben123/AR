<script>
  import { onMount } from "svelte";
  let mounted;
  let componentLoaded = 0
  $: ready = componentLoaded == 4;


  const loadComponent = () => {
    componentLoaded = componentLoaded + 1;
  };

  onMount(() => {
    console.log("mounted");
    mounted = true;
  });
</script>

<svelte:head>
  {#if mounted}
    <script
      src="https://raw.githack.com/AR-js-org/AR.js/ES6/aframe/build/aframe-ar.js"
      on:load={loadComponent}></script>   
    <script 
      src="https://aframe.io/releases/1.0.4/aframe.min.js"
      on:load={loadComponent}></script>
    <script 
      type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex-location-only.js'
      on:load={loadComponent}></script>
    <script 
      type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js'
      on:load={loadComponent}></script>
  {/if}
</svelte:head>

{#if ready}
  <a-scene vr-mode-ui='enabled: false' arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false' renderer='antialias: true; alpha: true'>
    <a-camera gps-new-camera='gpsMinDistance: 5'></a-camera>
    <a-entity material='color: red' geometry='primitive: box' gps-new-entity-place="latitude: 52.930754; longitude: -1.208886" scale="10 10 10"></a-entity>
  </a-scene>
{/if}

