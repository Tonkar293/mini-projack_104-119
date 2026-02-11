<template>
  <div class="login-container">
    <v-container fill-height fluid class="d-flex align-center justify-center">
      <transition name="fade" mode="out-in">
        <v-card
          v-if="!isLoggedIn"
          :loading="loading"
          class="login-card pa-8"
          max-width="400"
          rounded="xl"
          elevation="12"
          key="login-form"
        >
          <v-card-title class="text-h4 font-weight-bold text-center mb-4 primary--text">
            เข้าสู่ระบบ
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="ชื่อผู้ใช้"
                prepend-inner-icon="mdi-account"
                variant="solo"
                density="comfortable"
                required
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="รหัสผ่าน"
                prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="solo"
                density="comfortable"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="mt-6"
                :loading="loading"
                :disabled="loading"
              >
                ล็อกอิน
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card
          v-else
          class="login-card success-card pa-10 text-center"
          max-width="400"
          rounded="xl"
          elevation="12"
          key="login-success"
        >
          <v-icon color="success" size="64">mdi-check-circle</v-icon>
          <v-card-title class="text-h5 font-weight-bold mt-4">
            เข้าสู่ระบบสำเร็จ!
          </v-card-title>
          <v-progress-circular
            indeterminate
            color="primary"
            size="32"
            class="mt-4"
          ></v-progress-circular>
          <div class="mt-2 text-subtitle-1">กำลังนำทางไปยังหน้าหลัก...</div>
        </v-card>
      </transition>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
// ใช้ useRouter เพื่อนำทางใน Nuxt 3
const router = useRouter(); 

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const isLoggedIn = ref(false); // สถานะสำหรับควบคุม Animation

// ฟังก์ชันสำหรับจำลองการล็อกอิน
// ฟังก์ชันสำหรับล็อกอิน
const login = async () => {
  if (!username.value || !password.value) {
    Swal.fire({
      icon: 'warning',
      title: 'กรุณากรอกข้อมูล',
      text: 'โปรดระบุชื่อผู้ใช้และรหัสผ่าน',
      confirmButtonText: 'ตกลง'
    });
    return;
  }

  loading.value = true;

  try {
    const { data: response, error } = await useFetch('/api/user', {
      method: 'POST',
      body: {
        fn: 'userAuth',
        userName: username.value,
        userPass: password.value
      }
    });

    if (response.value && response.value.status) {
      // ล็อกอินสำเร็จ
      isLoggedIn.value = true;
      
      // บันทึกข้อมูลUserลง Session
      sessionStorage.setItem('loginUser', JSON.stringify(response.value.data));

      // หน่วงเวลาเล็กน้อยเพื่อแสดง Animation Success
      setTimeout(() => {
        router.push('/home'); // หรือตรวจสอบสิทธิ์เพื่อไป /Admin
      }, 1500);

    } else {
      // ล็อกอินล้มเหลว
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
        confirmButtonText: 'ลองใหม่'
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      confirmButtonText: 'ตกลง'
    });
  } finally {
    loading.value = false;
  }
};

// กำหนดให้หน้านี้ใช้ Layout แบบไม่มี Header/Footer
definePageMeta({
  layout: 'empty' // ต้องสร้างไฟล์ layouts/empty.vue
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  
  /* **ต้องใส่รูปใน public/images/background.jpg** */
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  z-index: 1; /* ทำให้โอเวอร์เลย์ทำงานได้ */
}

/* โอเวอร์เลย์สีดำจางๆ เพื่อเพิ่ม Contrast ให้อ่านฟอร์มง่ายขึ้น */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* สีดำโปร่งแสง 50% */
  z-index: -1;
}

.login-card {
  /* Card มีความโปร่งแสงเล็กน้อย ดูสวยงาม */
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(8px); /* เพิ่มความเบลอเล็กน้อยให้พื้นหลังที่ทะลุมา */
  z-index: 10;
}

.success-card {
  /* Card สำหรับสถานะสำเร็จ */
  background-color: rgba(255, 255, 255, 1) !important;
}

/* CSS สำหรับ Animation (Fade Transition) */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>