<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div 
      v-for="heart in hearts" 
      :key="heart.id"
      class="absolute text-romantic-300 opacity-40 select-none animate-float-slow"
      :style="{
        left: heart.left + '%',
        bottom: '-5%',
        fontSize: heart.size + 'px',
        animationDelay: heart.delay + 's',
        animationDuration: heart.duration + 's'
      }"
    >
      💖
    </div>
  </div>
</template>

<script setup lang="ts">
interface Heart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

const hearts = ref<Heart[]>([]);

onMounted(() => {
  // Populate random background layout hearts
  hearts.value = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * (30 - 14) + 14,
    delay: Math.random() * 5,
    duration: Math.random() * (10 - 5) + 5
  }));
});
</script>