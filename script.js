const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-button");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elasped");
const duration = document.querySelector(".time-duration");
const fullScreenBtn = document.getElementById("fullscreen-btn");
const speed = document.querySelector(".player-speed");
const player = document.querySelector(".player");

// Play & Pause ----------------------------------- //

const showPlayIcon = () => {
  playBtn.setAttribute("data-state", "play");
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
};

const togglePlayVideo = () => {
  if (video.paused) {
    video.play();
    playBtn.setAttribute("data-state", "pause");
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
  } else {
    video.pause();
    showPlayIcon();
  }
};

video.addEventListener("ended", showPlayIcon);

// Progress Bar ---------------------------------- //

const displayTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const updateProgressBar = () => {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentTime.textContent = `${displayTime(video.currentTime)} /`;
  duration.textContent = `${displayTime(video.duration)}`;
};

// Progress Range ---------------------------------- //
const toSeek = (e) => {
  const width = progressRange.clientWidth;
  const percent = (e.offsetX / width) * 100;
  progressBar.style.width = `${percent}%`;
  video.currentTime = (video.duration * percent) / 100;
  updateProgressBar();
};

const mouseDragToSeekVideo = (e) => {
  video.pause();
  progressRange.addEventListener("mousemove", toSeek);
  progressRange.addEventListener("mouseup", () => {
    progressRange.removeEventListener("mousemove", toSeek);
    video.play();
  });
};

const touchDragToSeekVideo = (e) => {
  video.pause();
  progressRange.addEventListener("touchmove", toSeek);
  progressRange.addEventListener("touchend", () => {
    progressRange.removeEventListener("touchmove", toSeek);
    video.play();
  });
};

// Volume Controls --------------------------- //
const changeVolume = (e) => {
  const width = volumeRange.clientWidth;
  const percent = (e.offsetX / width) * 100;
  if (percent > 100) {
    volumeBar.style.width = `100%`;
    video.volume = 1;
  } else if (percent < 0) {
    volumeBar.style.width = `0%`;
    video.volume = 0;
  } else {
    volumeBar.style.width = `${percent}%`;
    video.volume = percent / 100;
    if (video.volume <= 0.15) {
      video.volume = 0;
      volumeBar.style.width = "0%";
    } else if (video.volume >= 0.9) {
      video.volume = 1;
      volumeBar.style.width = "100%";
    }
  }
  volumeIcon.className = "";
  if (video.volume >= 0.7) {
    volumeIcon.classList.add("fas", "fa-volume-up");
  } else if (video.volume <= 0.7 && video.volume > 0.15) {
    volumeIcon.classList.add("fas", "fa-volume-down");
  } else {
    volumeIcon.classList.add("fas", "fa-volume-off");
  }
};

const touchDragChangeVolume = (e) => {
  volumeRange.addEventListener("touchmove", changeVolume);
  volumeRange.addEventListener("touchend", () => {
    volumeRange.removeEventListener("touchmove", changeVolume);
  });
};
let isMuted = false;
let lastVolumeLevel = 1;
const volumeMuteToggler = () => {
  if (isMuted) {
    video.volume = lastVolumeLevel;
    volumeBar.style.width = `${lastVolumeLevel * 100}%`;
    volumeIcon.className = "";
    if (video.volume >= 0.7) {
      volumeIcon.classList.add("fas", "fa-volume-up");
    } else if (video.volume <= 0.7 && video.volume > 0.15) {
      volumeIcon.classList.add("fas", "fa-volume-down");
    } else {
      volumeIcon.classList.add("fas", "fa-volume-off");
    }
    isMuted = false;
  } else {
    lastVolumeLevel = video.volume;
    video.volume = 0;
    volumeBar.style.width = "0%";
    volumeIcon.className = "";
    volumeIcon.classList.add("fas", "fa-volume-mute");
    isMuted = true;
  }
};

// Change Playback Speed -------------------- //
const changePlaybackSpeed = (e) => {
  if (e.target.value) {
    video.playbackRate = e.target.value;
  } else {
    video.playbackRate = 1;
  }
};

// Fullscreen ------------------------------- //
let isFullScreen = false;

const toggleFullScreen = (e) => {
  if (isFullScreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    video.classList.remove("video-fullscreen");
    fullScreenBtn.classList.replace("fa-compress", "fa-expand");
    isFullScreen = false;
  } else {
    if (player.requestFullscreen) {
      player.requestFullscreen();
    } else if (player.mozRequestFullScreen) {
      player.mozRequestFullScreen();
    } else if (player.webkitRequestFullscreen) {
      player.webkitRequestFullscreen();
    }
    fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    video.classList.add("video-fullscreen");
    isFullScreen = true;
  }
};

const touchZoomIn = (e) => {
  video.style.transform = "scale(1.5)";
  video.style.transition = "transform 0.5s";
  video.style.cursor = "zoom-out";
  video.addEventListener("touchend", () => {
    video.style.transform = "scale(1)";
    video.style.transition = "transform 0.5s";
    video.style.cursor = "zoom-in";
  });
};

// Event Listeners -------------------------- //
playBtn.addEventListener("click", togglePlayVideo);
video.addEventListener("click", togglePlayVideo);
video.addEventListener("loadedmetadata", updateProgressBar);
video.addEventListener("timeupdate", updateProgressBar);
video.addEventListener("canplay", updateProgressBar);
video.addEventListener("ended", showPlayIcon);
progressRange.addEventListener("click", toSeek);
progressRange.addEventListener("mousedown", mouseDragToSeekVideo);
progressRange.addEventListener("touchstart", touchDragToSeekVideo);
volumeRange.addEventListener("click", changeVolume);
volumeRange.addEventListener("touchstart", touchDragChangeVolume);
volumeIcon.addEventListener("click", volumeMuteToggler);
speed.addEventListener("change", changePlaybackSpeed);
fullScreenBtn.addEventListener("click", toggleFullScreen);
video.addEventListener("touchstart", touchZoomIn);
