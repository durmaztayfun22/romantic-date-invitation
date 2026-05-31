<template>
  <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden hidden md:block">
    <div 
      v-for="sparkle in sparkles" 
      :key="sparkle.id"
      class="absolute transform -translate-x-1/1 -translate-y-1/2 transition-all duration-700 ease-out text-xs"
      :style="{
        left: sparkle.x + 'px',
        top: sparkle.y + 'px',
        opacity: sparkle.opacity,
        transform: `scale(${sparkle.scale})`
      }"
    >
      ❤️
    </div>
  </div>
</template>

<script setup lang="ts">
interface Sparkle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

const sparkles = ref<Sparkle[]>([]);
let idCounter = 0;

const handleMouseMove = (e: MouseEvent) => {
  if (Math.random() > 0.15) return; // Limit generation overhead
  
  const id = idCounter++;
  const newSparkle: Sparkle = {
    id,
    x: e.clientX,
    y: e.clientY,
    opacity: 1,
    scale: Math.random() * 0.8 + 0.6
  };
  
  sparkles.value.push(newSparkle);
  
  // Fade and clean out tracking array
  setTimeout(() => {
    const index = sparkles.value.findIndex(s => s.id === id);
    if (index !== -1) {
      sparkles.value[index].opacity = 0;
      sparkles.value[index].scale = 0.2;
    }
  }, 50);

  setTimeout(() => {
    sparkles.value = sparkles.value.filter(s => s.id !== id);
  }, 700);
};

onMounted(() => window.addEventListener('mousemove', handleMouseMove));
onUnmounted(() => window.removeEventListener('mousemove', handleMouseMove));
</script>