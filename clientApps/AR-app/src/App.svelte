<script>
	import {Router, Route, Link} from "svelte-routing";
	import Tags from "./routes/tags.svelte";
	import Login from "./routes/login.svelte";
	import Home from "./routes/home.svelte";

	export let url = "";
</script>

<Router url="{url}">
	<nav>
		<Link to="tags">Tags here :OOOO</Link>
		<Link to="login">Login here for SQL injection</Link>
		<Link to="/">Home</Link>
		<!--testing branching-->>
	</nav>
	<div>
		<Route path="tags" component="{Tags}" />
		<Route path="login" component="{Login}" />
		<Route path="/" component="{Home}" />
	</div>

</Router>


<main>
  <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
        <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
        <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
    </head>
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
