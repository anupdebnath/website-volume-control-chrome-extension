document.addEventListener("DOMContentLoaded", async () => {
  const volumeSlider = document.getElementById("volume-slider");
  const volumeValue = document.getElementById("volume-value");
  const saveButton = document.getElementById("save-volume");
  const resetButton = document.getElementById("reset-volume");

  // Get the current tab's domain
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const domain = url.hostname;

  // Fetch saved volume for the domain
  chrome.storage.local.get([domain], (data) => {
    const volume = data[domain] || 100; // Default volume 100%
    volumeSlider.value = volume;
    volumeValue.textContent = `Volume: ${volume}%`;
    updateVolume(tab.id, volume / 100);
  });

  // Update UI when slider changes
  volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value;
    volumeValue.textContent = `Volume: ${volume}%`;
  });

  // Save volume when clicking save
  saveButton.addEventListener("click", () => {
    const volume = volumeSlider.value;
    chrome.storage.local.set({ [domain]: volume }, () => {
      console.log(`Volume for ${domain} set to ${volume}%`);
    });
    updateVolume(tab.id, volume / 100);
  });

  // Reset volume
  resetButton.addEventListener("click", () => {
    setVolume(100);
  });

  // Save volume when clicking save
  saveButton.addEventListener("click", () => {
    const volume = volumeSlider.value;
    chrome.storage.local.set({ [domain]: volume }, () => {
      console.log(`Volume for ${domain} set to ${volume}%`);
    });
    updateVolume(tab.id, volume / 100);
  });

  // Function to update the tab's audio volume
  function updateVolume(tabId, volume) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: (volume) => {
        const videos = document.querySelectorAll("video, audio");
        videos.forEach((media) => (media.volume = volume));
      },
      args: [volume],
    });
  }
});
