import { SOUND_FILES } from "./soundRegistry";
class SoundManager {
  constructor() {
    this.sounds = {};
    this.activeLoops = new Set();
    this.unlocked = false;
  }

  preload() {
    Object.entries(SOUND_FILES).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      this.sounds[key] = audio;
    });
  }

  unlock = async () => {
    if (this.unlocked) return;

    try {
      const silent = new Audio();
      silent.src =
        "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAA...";
      await silent.play().catch(() => {});
      this.unlocked = true;
      console.log("🔓 Sound unlocked");
    } catch {}
  };

  play(key, { loop = false, volume = 1 } = {}) {
    const base = this.sounds[key];
    if (!base) return;

    const audio = base.cloneNode(); // prevent overlap bug
    audio.loop = loop;
    audio.volume = volume;

    audio.play().catch(() => {});

    if (loop) this.activeLoops.add(audio);

    audio.onended = () => {
      this.activeLoops.delete(audio);
    };

    return audio;
  }

  stopAll() {
    this.activeLoops.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeLoops.clear();
  }
}

export const soundManager = new SoundManager();