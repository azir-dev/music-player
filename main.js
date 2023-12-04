import "./style.scss";
import musics from "./music";

// 音乐播放状态
let playStatus = false;
// 当前播放音乐在数据中的索引值
let currentMusicIndex = 0;

// 获取 DOM 元素
// 音乐信息 DOM
const audioElement = document.getElementById("music-source");
const musicImage = document.querySelector(".music__img>img");
const musicTitle = document.querySelector(".music__title");
const musicArtist = document.querySelector(".music__artist");

// 音乐控制相关 DOM
const playButton = document.getElementById("play");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");

// 进度条相关 DOM
const progressCurrent = document.querySelector(".progress__timer--current");
const progressDuration = document.querySelector(".progress__timer--duration");
const progressTrack = document.querySelector(".progress__track");
const progressBar = document.querySelector(".progress__bar");

// var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// const track = audioCtx.createMediaElementSource(audioElement);

/**
 * 设置音乐信息
 */
function setMusicInfo() {
  let currentMusic = musics[currentMusicIndex];
  audioElement.src = currentMusic.uri;
  musicImage.src = currentMusic.img;
  musicTitle.textContent = currentMusic.title;
  musicArtist.textContent = currentMusic.artist;

  // console.log(audioElement.duration);
  audioElement.onloadedmetadata = () => {
    progressDuration.textContent = secondsToMinutes(audioElement.duration);
    progressCurrent.textContent = secondsToMinutes(audioElement.currentTime);
    progressBar.style.width =
      audioElement.currentTime / audioElement.duration + "%";
  };
}

/**
 * 格式化时间字符串
 * @param {Number} seconds
 * @returns {String}
 */
function secondsToMinutes(seconds) {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  const secondStr = seconds < 10 ? `0${seconds}` : seconds.toString();
  return `${minutes}: ${secondStr}`;
}

// 播放音乐
function playMusic() {
  playStatus = true;
  audioElement.play();
  playButton.classList.replace("fa-play", "fa-pause");
}

// 暂停音乐
function pauseMusic() {
  playStatus = false;
  audioElement.pause();
  playButton.classList.replace("fa-pause", "fa-play");
}

// 下一首
function nextMusic() {
  currentMusicIndex =
    currentMusicIndex === musics.length - 1 ? 0 : ++currentMusicIndex;
  setMusicInfo();
  playMusic();
}

// 上一首
function prevMusic() {
  currentMusicIndex =
    currentMusicIndex === 0 ? musics.length - 1 : --currentMusicIndex;
  setMusicInfo();
  playMusic();
}

// 播放，暂停按钮添加点击事件
playButton.addEventListener("click", () =>
  playStatus ? pauseMusic() : playMusic()
);

// 上一首下一首添加点击事件
nextButton.addEventListener("click", nextMusic);
prevButton.addEventListener("click", prevMusic);

let timer = 0;
// 给音乐添加开始播放事件，开始动画
audioElement.addEventListener("play", () => {
  timer = setInterval(() => {
    progressBar.style.width =
      (audioElement.currentTime / audioElement.duration) * 100 + "%";
    progressCurrent.textContent = secondsToMinutes(audioElement.currentTime);
  });
});

// 给音乐添加暂停事件，清除动画
audioElement.addEventListener("pause", () => {
  clearInterval(timer);
});

// 给音乐添加结束事件，自动下一曲
audioElement.addEventListener("ended", () => {
  nextMusic();
});

// 给进度条添加点击事件
progressTrack.addEventListener("click", function (event) {
  const currentTime =
    (event.offsetX / this.clientWidth) * audioElement.duration;
  audioElement.currentTime = currentTime;
  progressBar.style.width = (event.offsetX / this.clientWidth) * 100 + "%";
});

// 音乐信息加载初始化
setMusicInfo();
