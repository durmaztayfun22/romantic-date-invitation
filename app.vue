<template>
  <div class="min-h-screen w-screen bg-grid relative flex items-center justify-center py-12 selection:bg-romantic-200 overflow-x-hidden">
    <FloatingHearts />
    <HeartTrail />
    <MusicPlayer />

    <main class="w-full relative z-10 flex items-center justify-center">
      <Transition name="fade" mode="out-in">
        <component 
          :is="currentStepComponent" 
          @accepted="handleAcceptance"
          @submitted="currentStep = 'success'"
        />
      </Transition>
    </main>

    <canvas ref="confettiCanvas" class="fixed inset-0 pointer-events-none z-50 w-full h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import StepLanding from './components/StepLanding.vue'
import StepDetails from './components/StepDetails.vue'
import StepSuccess from './components/StepSuccess.vue'

type Step = 'landing' | 'details' | 'success';

const currentStep = ref<Step>('landing');
const confettiCanvas = ref<HTMLCanvasElement | null>(null);

const currentStepComponent = computed(() => {
  switch (currentStep.value) {
    case 'landing': return StepLanding;
    case 'details': return StepDetails;
    case 'success': return StepSuccess;
  }
});

// Beautiful custom internal mini confetti engine to keep dependencies slim
const handleAcceptance = () => {
  currentStep.value = 'details';
  triggerConfettiExplosion();
};

const triggerConfettiExplosion = () => {
  if (!confettiCanvas.value) return;
  const canvas = confettiCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#fb7185', '#f43f5e', '#ffe4e9', '#fea3b4', '#ffffff'];
  const particles = Array.from({ length: 120 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 1.5,
    radius: Math.random() * 4 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 15,
    vy: (Math.random() - 0.75) * 15 - 5,
    opacity: 1
  }));

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      if (p.opacity <= 0) return;
      active = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravity simulation
      p.opacity -= 0.015;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });

    if (active) requestAnimationFrame(animate);
  };
  animate();
};
</script>