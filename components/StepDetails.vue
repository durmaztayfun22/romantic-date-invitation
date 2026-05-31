<template>
  <div class="max-w-md w-full mx-auto px-6 py-8 bg-white/80 backdrop-blur-md rounded-3xl border border-romantic-100 shadow-xl relative z-10">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-slate-800 font-sans">Yay! I can't wait! 💖</h2>
      <p class="text-sm text-slate-500 mt-1">Let's lock down the perfect moment for us</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-slate-600 mb-1">Your Email (From)</label>
        <input 
          v-model="form.fromEmail" 
          type="email" 
          required
          placeholder="your-email@gmail.com"
          class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-romantic-300 focus:ring-2 focus:ring-romantic-100 bg-white/50 text-slate-700 text-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-600 mb-1">Their Email (To)</label>
        <input 
          v-model="form.toEmail" 
          type="email" 
          required
          placeholder="their-email@gmail.com"
          class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-romantic-300 focus:ring-2 focus:ring-romantic-100 bg-white/50 text-slate-700 text-sm"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-semibold text-slate-600 mb-1">Pick a Date</label>
          <input 
            v-model="form.date" 
            type="date" 
            required
            :min="todayString"
            class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-romantic-300 focus:ring-2 focus:ring-romantic-100 bg-white/50 text-slate-700 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-600 mb-1">Pick a Time</label>
          <input 
            v-model="form.time" 
            type="time" 
            required
            class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-romantic-300 focus:ring-2 focus:ring-romantic-100 bg-white/50 text-slate-700 text-sm"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-600 mb-1">Sweet Note (Optional)</label>
        <textarea 
          v-model="form.note" 
          rows="2" 
          placeholder="Leave me a sweet note..."
          class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-romantic-300 focus:ring-2 focus:ring-romantic-100 bg-white/50 text-slate-700 placeholder:text-slate-400 text-sm resize-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-romantic-400 hover:bg-romantic-500 disabled:bg-romantic-300 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-150 text-base flex items-center justify-center gap-2"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Sending Love...
        </span>
        <span v-else>Confirm Date 💌</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';

const emit = defineEmits(['submitted']);
const loading = ref(false);

// Form verileri (Mailler dahil)
const form = reactive({
  date: '',
  time: '',
  note: '',
  fromEmail: '',
  toEmail: ''
});

// Tarayıcı hata vermesin diye URL parametrelerini güvenli bir şekilde yerel JS (window.location) ile çözüyoruz
onMounted(() => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    // Eğer URL'de önceden tanımlanmış parametre varsa kutucuklara otomatik doldurur, yoksa boş bırakır kullanıcı yazar.
    form.fromEmail = params.get('from') || '';
    form.toEmail = params.get('to') || '';
  }
});

const todayString = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    const response = await $fetch<{ success: boolean; error?: string }>('/api/send-email', {
      method: 'POST',
      body: {
        date: form.date,
        time: form.time,
        note: form.note,
        toEmail: form.toEmail,
        fromEmail: form.fromEmail
      }
    });

    if (response && response.success) {
      emit('submitted');
    } else {
      alert(`Mail engine error: ${response?.error || 'Unknown error'}`);
    }
  } catch (err: any) {
    console.error("Fetch process failed:", err);
    alert(`Connection error: ${err.message || 'Server down'}`);
  } finally {
    loading.value = false;
  }
};
</script>