const buttonInstall = document.getElementById("buttonInstall");

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  buttonInstall.style.display = "block";
});

buttonInstall.addEventListener("click", async () => {
  buttonInstall.style.display = "none";
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log("User response to the install prompt: ${outcome}");
  deferredPrompt = null;
});

window.addEventListener("appinstalled", (event) => {
  console.log("The app has been installed sucessfully");
});
