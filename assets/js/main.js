const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const USER_STORAGE_KEY = "USER_VGDAT";

// Console Music
const img = $(".music-img img");
const musicName = $(".music-playing h3");
const musicSinger = $(".music-playing p");
const musicAudio = $("#audio");

// Console Control
const controlBtn = $(".control-buttons");
const playBtn = $(".btn-toggle-play");
const slider = $(".btn-slider");
const backBtn = $(".btn-back");
const skipBtn = $(".btn-skip");
const repeatBtn = $(".btn-repeat");
const shuffleBtn = $(".btn-shuffle");
const playlist = $("#playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRepeat: false,
  isShuffle: false,
  //configs: JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || {},
  //   setConfig: function (key, value) {
  //     this.config[key] = value;
  //     localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.config));
  //   },
  //   Playlists
  songs: [
    {
      name: "Vệ Tinh",
      singer: "HIEUTHUHAI, Hoàng Tôn",
      path: "./assets/music/VeTinh.mp3",
    },
  ],

  // Render UI
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === app.currentIndex ? "active" : " "
        }" data-index="${index}">
          <h3 class="song-name">${song.name}</h3>
          <p class="song-singer">${song.singer}</p>
          <div class="song-btn">
            <div class="btn-chart">
              <i class="fa-sharp fa-solid fa-chart-simple"></i>
            </div>
            <div class="btn-like">
              <i class="fa-regular fa-heart"></i>
            </div>
            <div class="btn-option">
              <i class="fa-solid fa-ellipsis"></i>
            </div>
          </div>
        </div>
        `;
    });
    $("#playlist").innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  //   Xử lí sự kiện
  handleEvents: function () {
    // Xử lí UI khi scroll
    const imgWidth = img.offsetWidth;

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newImgWidth = imgWidth - scrollTop;

      img.style.width = newImgWidth > 0 ? newImgWidth + "px" : 0;
    };

    // Xử lí sự kiện clickPlay
    playBtn.onclick = function () {
      if (app.isPlaying) {
        musicAudio.pause();
      } else {
        musicAudio.play();
      }
    };

    // Xử lí sự kiện playing
    musicAudio.onplay = function () {
      app.isPlaying = true;
      controlBtn.classList.add("playing");
    };

    musicAudio.onpause = function () {
      app.isPlaying = false;
      controlBtn.classList.remove("playing");
    };

    // Xử lí khi tiến độ bài hát thay đổi
    musicAudio.ontimeupdate = function () {
      if (musicAudio.duration) {
        const progress = Math.floor(
          (musicAudio.currentTime / musicAudio.duration) * 100
        );
        slider.value = progress;
      }
    };

    //  Xử lí sự kiện seek
    slider.onchange = function (e) {
      const sliderTime = (e.target.value / 100) * musicAudio.duration;
      musicAudio.currentTime = sliderTime;
    };

    // Xử lí sự kiện Back-Skip
    backBtn.onclick = function () {
      if (app.isShuffle) {
        app.shuffleSong();
      } else {
        app.backSong();
      }
      musicAudio.play();
      app.render();
      app.scrollToActiveSong();
    };
    skipBtn.onclick = function () {
      if (app.isShuffle) {
        app.shuffleSong();
      } else {
        app.skipSong();
      }
      musicAudio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // Xử lí sự kiện lặp lại bài hát
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      // app.setConfig("isRepeat", app.isRepeat);
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    // Xử lí sự kiện random bài hát
    shuffleBtn.onclick = function () {
      app.isShuffle = !app.isShuffle;
      //app.setConfig("isShuffle", app.isShuffle);
      shuffleBtn.classList.toggle("active", app.isShuffle);
    };

    // Khi kết thúc bài hát
    musicAudio.onended = function () {
      if (app.isRepeat) {
        musicAudio.play();
      } else {
        skipBtn.click();
      }
    };

    // Click vào bài hát
    playlist.onclick = function (e) {
      const song = e.target.closest(".song:not(.active)");
      if (song || e.target.closest(".btn-option ")) {
        if (song) {
          app.currentIndex = Number(song.dataset.index);
          app.loadCurrentSong();
          app.render();
          musicAudio.play();
          ß;
        } else if (e.target.closet(".btn-option ")) {
        }
      }
    };
  },

  //   Chạy bài hát
  loadCurrentSong: function () {
    musicName.textContent = this.currentSong.name;
    musicSinger.textContent = this.currentSong.singer;
    musicAudio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRepeat = this.config.isRepeat;
    this.isShuffle = this.config.isShuffle;
  },

  // Bỏ qua bài hát hiện tại
  skipSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  //   Quay lại bài hát trước
  backSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length;
    }
    this.loadCurrentSong();
  },
  // Shuffle songs
  shuffleSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  // Chạy tới bài hát đang phát
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }, 300);
  },

  //   Chạy các chức năng
  start: function () {
    // Gánh Config vào app
    //this.loadConfig();
    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe/ Xử lý các sự kiện (DOM Events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI
    this.loadCurrentSong();

    // Render Playlist
    this.render();

    // Them
    repeatBtn.classList.toggle("active", app.isRepeat);
    shuffleBtn.classList.toggle("active", app.isShuffle);
  },
};

app.start();
