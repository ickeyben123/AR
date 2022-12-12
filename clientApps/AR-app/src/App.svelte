<script>
	export let name;
</script>

<main>
  <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
        <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
        <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
    </head>

    <body style="margin: 0; overflow: hidden;">
        <a-scene
            embedded
            loading-screen="enabled: false;"
            arjs="sourceType: webcam; debugUIEnabled: false;">
                <a-image
                    src="assets/asset.png"
                    look-at="[gps-camera]"
                    scale="1 1 1"
                    gps-entity-place="latitude: 52.930759331905115; longitude: -1.2089677155290701;"
                ></a-image>

            <a-camera gps-camera rotation-reader></a-camera>
        </a-scene>
    </body>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
