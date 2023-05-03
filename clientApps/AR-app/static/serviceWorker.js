self.addEventListener("install", (event) => {
    console.log("Installed SW");
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Activated SW");
  });
  
  self.addEventListener("fetch", (event) => {
    console.log("Fetch:", event.request);
  });

  self.addEventListener("push", (event) => {
    // Double check the push event
    console.log("received");
      event.waitUntil(
        self.registration.showNotification("Don't forget to place your tags!", {
          body: "Tag '" + event.data.text() + "' has not been placed again!",
        })
      );
  });