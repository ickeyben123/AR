<meta name="viewport" content="width=device-width, initial-scale=1.0">
<header>
	<nav class="topBar">
		<button class="toggleButton" on:click={() => navMenuActive = !navMenuActive}>
			<div class="iconBar"></div>
			<div class="iconBar"></div>
			<div class="iconBar"></div>
		</button>
		{#if navMenuActive}
		<div transition:slide style="background-color: white">
				<table>
					{#if currentUser == "Not Logged In!"}
					<tr><a class="navButton" href='/' on:click={() => navMenuActive = false}>Home</a></tr>
					<tr><a class="navButton" href='/login' on:click={() => navMenuActive = false}>Log In</a></tr>
					<tr><a class="navButton" href='/signup' on:click={() => navMenuActive = false}>Sign Up</a></tr>
					{:else}
					<tr><a class="navButton" href='/tags' on:click={() => navMenuActive = false}>Tags</a></tr>
					<tr><a class="navButton" href='/account' on:click={() => navMenuActive = false}>Account</a></tr>
					{/if}

					<tr><span style="color:grey">Logged in as:  </span><span style="color:#011828; font-weight:bold">{currentUser}</span></tr>
				</table>
			</div>
		{/if}
	</nav>
</header>

<script>
	import '../global.css'
	import {slide} from 'svelte/transition';

	//Notifications
	import { SvelteToast, toast } from '@zerodevx/svelte-toast'
	import { onMount } from "svelte";
	import { getCookie } from 'svelte-cookie';
	import { currentUserStore } from './stores.js';

	let navMenuActive = false
	var sub;

	
	onMount(async () => {
		const status = await Notification.requestPermission();
		if (status !== "granted")
			toast.push("Please make sure to enable Push Notifications for Tag Reminders.");

		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("/serviceWorker.js");
			console.log("Done registering!")
			const reg = await navigator.serviceWorker.ready;
			sub = await reg.pushManager.getSubscription();
			if (!sub) {
				// Fetch VAPID public key
				const res = await fetch("/api/user/vapid");
				const data = await res.text();
				sub = await reg.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: data,
			});
			}
			console.log(sub);
		}
	});

	$: if (sub && localStorage.getItem("loggedIn")) {
		fetch("/api/user/subscribe", {
			body: JSON.stringify({ vapidSubscription: sub.toJSON() }),
			credentials: 'include',
			headers: {
			"Content-Type": "application/json",
			},
			method: "POST",
		});
	}


	let currentUser = "";

	// update currentUser automatically when currentUserStore is changed
	currentUserStore.subscribe(value => {currentUser = value;});

	onMount(() => {
		console.log("Checking cookies");
		if(getCookie('ar-session') == "" ) {
			console.log("no cookie");
		currentUserStore.set("Not Logged In!");
	} 
	});


</script>

<slot></slot>


<SvelteToast options={{ reversed: true, intro: { y: 192 } }} />

<style>
	:root {
      --toastContainerTop: auto;
      --toastContainerRight: auto;
      --toastContainerBottom: 2rem;
      --toastContainerLeft: calc(50vw - 8rem);
    }

	header {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		z-index: 2;
	}
	.topBar {
		width: 100%;
		background-color: rgb(219, 238, 255);
		padding: 0;
		height:50px;
		
	}
	table {
		width: 100%;
	}
	.toggleButton {
		height:100%;
		outline: none;
		border:none;
		vertical-align: middle;
	}
	.navButton {
		background-color: #c8dcea;
		border-radius: 5px;
		margin-bottom: 2px;
		color: #011828;
		padding: 14px 16px;
		text-decoration: none;
		font-size: 17px;
		display: block;
		cursor: pointer;
	}
	.navButton:hover {
		background-color: #9fcff1;
		text-decoration: none;
		transition-duration: 0.4s;
	}
	.iconBar {
		width: 35px;
		height: 5px;
		background-color: #FFFDFA;
		margin-bottom: 7px;
		border-radius: 2px;
	}
</style>