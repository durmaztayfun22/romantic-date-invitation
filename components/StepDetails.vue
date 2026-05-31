<template>
  <div class="max-w-md w-full mx-auto px-6 py-8 bg-white/80 backdrop-blur-md rounded-3xl border border-romantic-100 shadow-xl">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-slate-800 font-sans">Yay! I can't wait! 💖</h2>
      <p class="text-sm text-slate-500 mt-1">Let's lock down the perfect moment for us</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label class="block text-sm font-semibold text-slate-600 mb-1.5">Pick a Date</label>
        <input 
          v-model="form.date" 
          type="date" 
          required
          :min="todayString"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-romantic-300 focus:ring-2 focus:ring-romantic-100 bg-white/50 text-slate-700"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-600 mb-1.5">Pick a Time</label>
        <input 
          v-model="form.time" 
          type="time" 
          required
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-romantic-300 focus:ring-2 focus:ring-romantic-100 bg-white/50 text-slate-700"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-600 mb-1.5">Sweet Note (Optional)</label>
        <textarea 
          v-model="form.note" 
          rows="3" 
          placeholder="Leave me a sweet note..."
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-romantic-300 focus:ring-2 focus:ring-romantic-100 bg-white/50 text-slate-700 placeholder:text-slate-400 resize-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-romantic-400 hover:bg-romantic-500 disabled:bg-romantic-300 text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-150 text-base flex items-center justify-center gap-2"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Sending...
        </span>
        <span v-else>Confirm Date 💌</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, reactive, computed } from 'vue';

const emit = defineEmits(['submitted']);
const route = useRoute();
const loading = ref(false);

const form = reactive({
  date: '',
  time: '',
  note: ''
});

const todayString = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;

  // URL parametrelerini güvenli string formatına dönüştürüyoruz
  const toEmail = String(route.query.to || '');
  const fromEmail = String(route.query.from || '');

  try {
    // Nuxt 3 için yapılandırılmış kesin POST isteği
    const response = await $fetch<{ success: boolean; error?: string }>('/api/send-email', {
      method: 'POST',
      body: {
        date: form.date,
        time: form.time,
        note: form.note,
        toEmail: toEmail,
        fromEmail: fromEmail
      }
    });

    console.log("Server response:", response);

    if (response && response.success) {
      emit('submitted');
    } else {
      alert(`Mail gönderilemedi: ${response?.error || 'Bilinmeyen bir sunucu hatası oluştu.'}`);
    }
  } catch (err: any) {
    console.error("Fetch hatası:", err);
    // Hatanın detayını ekrana basıyoruz ki tarayıcı engelliyorsa görebilelim
    alert(`Bağlantı hatası: ${err.message || err.statusMessage || err}`);
  } finally {
    // Her koşulda butonu yükleniyor durumundan kurtar
    loading.value = false;
  }
};
</script>