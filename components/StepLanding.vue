<template>
  <div class="text-center max-w-md w-full mx-auto px-4">
    <div class="w-48 h-48 mx-auto mb-6 bg-romantic-100 rounded-full flex items-center justify-center shadow-inner overflow-hidden border-4 border-white">
      <img 
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N6M3I0dndwMmN3ZzZ4N2M3bXZ3cmJ5Ymd2amx3YmR6bnd5OHg4eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/L4lvBIF9gA0EFp367B/giphy.gif" 
        alt="Cute Love Bears" 
        class="w-40 h-40 object-contain"
      />
    </div>

    <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-3 drop-shadow-sm">
      Would you like to go on a date with me? 💖
    </h1>
    <p class="text-slate-500 mb-8 font-light text-base">
      {{ currentSubtitle }}
    </p>

    <div class="relative h-32 w-full flex items-start justify-center gap-4">
      <button 
        @click="$emit('accepted')"
        class="bg-romantic-400 hover:bg-romantic-500 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-romantic-300/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-lg z-10"
      >
        Yes 💖
      </button>

      <button 
        ref="noButton"
        @mouseenter="evadeButton"
        @touchstart.prevent="evadeButton"
        :style="buttonStyle"
        class="bg-white border-2 border-slate-200 hover:border-romantic-200 text-slate-600 font-medium px-8 py-3.5 rounded-full shadow-md text-lg transition-transform duration-200 ease-out select-none"
        :class="{ 'absolute z-20': isMoving }"
      >
        {{ noButtonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['accepted']);

const noButton = ref<HTMLButtonElement | null>(null);
const isMoving = ref(false);
const noButtonText = ref('No 🥺');
const currentSubtitle = ref('I promise it will be fun, memorable, and full of smiles 😊');

const funnyMessages = [
  "Are you sure? 😢",
  "Give me a chance 💕",
  "Not so fast 😜",
  "Look over here! 👀",
  "The 'Yes' button looks nicer! ✨",
  "Clicking this is physically impossible! 🛑"
];

const buttonStyle = ref<{ top?: string; left?: string }>({});

const evadeButton = () => {
  isMoving.value = true;
  
  // Choose a random playful message
  const randomIndex = Math.floor(Math.random() * funnyMessages.length);
  noButtonText.value = funnyMessages[randomIndex];

  // Pick a random alternative subtitle for comedic timing
  if(Math.random() > 0.5) {
    currentSubtitle.value = "Hey! Watch out, that button is slippery! 💨";
  }

  // Calculate clean, safe viewport coordinates within the screen bounds
  const padding = 20; 
  const btnWidth = noButton.value?.offsetWidth || 120;
  const btnHeight = noButton.value?.offsetHeight || 50;

  const maxX = window.innerWidth - btnWidth - padding;
  const maxY = window.innerHeight - btnHeight - padding;

  const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
  const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

  buttonStyle.value = {
    position: 'fixed',
    left: `${randomX}px`,
    top: `${randomY}px`
  };
};
</script>