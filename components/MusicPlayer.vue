<template>
  <div class="fixed bottom-4 right-4 z-40">
    <button 
      @click="togglePlayback" 
      class="bg-white/80 backdrop-blur-md border border-romantic-200 shadow-md p-3 rounded-full hover:scale-110 active:scale-95 transition-all text-xl flex items-center justify-center"
      :aria-label="isPlaying ? 'Mute Music' : 'Play Music'"
    >
      <span v-if="isPlaying" class="animate-pulse">🎵</span>
      <span v-else class="opacity-60">🔇</span>
    </button>
    <audio 
      ref="audioRef" 
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
      loop 
      preload="auto"
    ></audio>
  </div>
</template>

<script setup lang="ts">
const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);

const togglePlayback = () => {
  if (!audioRef.value) return;
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play().catch(() => {
      console.log("Audio playback user gesture bypass caught.");
    });
  }
  isPlaying.value = !isPlaying.value;
};
</script>