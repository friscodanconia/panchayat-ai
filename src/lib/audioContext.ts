let unlocked = false;
let sharedAudio: HTMLAudioElement | null = null;

export function unlockAudio(): void {
  if (unlocked) return;
  try {
    const ctx = new AudioContext();
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);

    sharedAudio = new Audio();
    sharedAudio.src =
      "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYlpnEhAAAAAAD/+1DEAAAHAAGf9AAAIgAANIAAAAQAAAAA//tQxBEAAADSAAAAAAAAANIAAAAAAAAA";
    sharedAudio.volume = 0;
    sharedAudio.play().catch(() => {});
    unlocked = true;
  } catch {
    unlocked = true;
  }
}

export function getSharedAudio(): HTMLAudioElement {
  if (!sharedAudio) {
    sharedAudio = new Audio();
  }
  return sharedAudio;
}

export function playBase64Audio(base64: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const audio = getSharedAudio();
      audio.volume = 1;
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("Audio playback failed"));
      audio.src = `data:audio/mp3;base64,${base64}`;
      audio.play().catch(reject);
    } catch (err) {
      reject(err);
    }
  });
}
