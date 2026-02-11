<template>
  <div class="login-container">
    <div class="noise-overlay"></div>
    <div class="animated-bg-shape shape-1"></div>
    <div class="animated-bg-shape shape-2"></div>

    <v-container fluid class="fill-height d-flex align-center justify-center container-relative">
      <transition name="zoom-fade" mode="out-in" appear>
        
        <div v-if="!isLoggedIn" class="login-group" key="login-wrapper">
          
          <div class="neon-outer-glow" :style="borderStyle"></div>

          <div class="login-wrapper">
            <div class="neon-glow-blur" :style="borderStyle"></div>
            <div class="neon-border-line" :style="borderStyle"></div>
            <div class="ambient-glow" :style="glowStyle"></div>
            
            <v-card
              :loading="loading"
              class="login-card pa-12 pa-md-16"
              max-width="650"
              min-width="400"
              elevation="0"
            >
              <!-- Header Section -->
              <div class="text-center mb-10 content-entrance">
                <div class="logo-group mb-8">
                  <div class="logo-circle">
                      <v-img src="/images/logo_phrae.png" width="80" class="logo-img"></v-img>
                  </div>
                  <div class="logo-separator"></div>
                  <div class="logo-circle">
                      <v-img src="/images/logo_tech.png" width="80" class="logo-img"></v-img>
                  </div>
                </div>
                
                <!-- Smooth Title Transition (Grid Stack for Title too?) No, slight bounce ok for title, user worried about whole card -->
                <transition name="slide-up-text" mode="out-in">
                  <div :key="currentTab" class="title-container">
                      <h1 class="text-h3 font-weight-black text-white title-tracking">
                      {{ currentTab === 'user' ? 'STATIONERY' : 'ADMIN PORTAL' }}
                      </h1>
                      <div class="title-underline mx-auto mt-3" :style="{ background: currentThemeColor }"></div>
                  </div>
                </transition>
                
                <p class="text-h6 text-grey-lighten-4 mt-4 font-weight-light opacity-80">
                  ระบบสหกรณ์ร้านค้าออนไลน์
                </p>
              </div>

              <!-- Switcher -->
              <div class="glass-switcher mb-10 d-flex p-1 content-entrance" style="animation-delay: 0.1s;">
                  <div 
                      class="switcher-active-bg"
                      :class="{ 'slide-right': currentTab === 'admin' }"
                      :style="{ background: currentThemeGradient }"
                  ></div>
                  
                  <button 
                      class="switcher-item" 
                      :class="{ 'active': currentTab === 'user' }"
                      @click="switchTab('user')"
                  >
                      <v-icon size="default" class="mr-2">mdi-account-circle-outline</v-icon>
                      <span>General User</span>
                  </button>
                  <button 
                      class="switcher-item" 
                      :class="{ 'active': currentTab === 'admin' }"
                      @click="switchTab('admin')"
                  >
                      <v-icon size="default" class="mr-2">mdi-shield-check-outline</v-icon>
                      <span>Administrator</span>
                  </button>
              </div>

                <v-form @submit.prevent="isRegistering ? register() : login()" class="form-entrance">
                <!-- GRID STACK WRAPPER -->
                <div class="form-stack">
                    <transition name="form-slide" mode="out-in">
                        <div :key="currentTab + (isRegistering ? '-reg' : '-login')" class="form-fields-wrapper">
                            
                            <!-- Registration Fields -->
                            <div v-if="isRegistering">
                                <div class="input-group mb-4">
                                    <v-text-field
                                        v-model="registerForm.userFullname"
                                        placeholder="Full Name"
                                        variant="solo"
                                        density="comfortable"
                                        class="glass-input"
                                        hide-details
                                        bg-color="transparent"
                                        :class="{ 'input-focused': focusedField === 'fullname' }"
                                        @focus="focusedField = 'fullname'"
                                        @blur="focusedField = null"
                                    >
                                        <template v-slot:prepend-inner>
                                            <v-icon :color="currentThemeColor" class="mr-3 opacity-80" size="large">mdi-account</v-icon>
                                        </template>
                                    </v-text-field>
                                </div>
                                <div class="input-group mb-4">
                                    <v-text-field
                                        v-model="registerForm.userName"
                                        placeholder="Student ID"
                                        variant="solo"
                                        density="comfortable"
                                        class="glass-input"
                                        hide-details
                                        bg-color="transparent"
                                        :class="{ 'input-focused': focusedField === 'reg_username' }"
                                        @focus="focusedField = 'reg_username'"
                                        @blur="focusedField = null"
                                    >
                                        <template v-slot:prepend-inner>
                                            <v-icon :color="currentThemeColor" class="mr-3 opacity-80" size="large">mdi-card-account-details</v-icon>
                                        </template>
                                    </v-text-field>
                                </div>
                                <div class="input-group mb-4">
                                    <v-text-field
                                        v-model="registerForm.userPass"
                                        placeholder="Password"
                                        type="password"
                                        variant="solo"
                                        density="comfortable"
                                        class="glass-input"
                                        hide-details
                                        bg-color="transparent"
                                        :class="{ 'input-focused': focusedField === 'reg_pass' }"
                                        @focus="focusedField = 'reg_pass'"
                                        @blur="focusedField = null"
                                    >
                                        <template v-slot:prepend-inner>
                                            <v-icon :color="currentThemeColor" class="mr-3 opacity-80" size="large">mdi-lock</v-icon>
                                        </template>
                                    </v-text-field>
                                </div>
                                <div class="input-group mb-6">
                                    <v-text-field
                                        v-model="registerForm.confirmPass"
                                        placeholder="Confirm Password"
                                        type="password"
                                        variant="solo"
                                        density="comfortable"
                                        class="glass-input"
                                        hide-details
                                        bg-color="transparent"
                                        :class="{ 'input-focused': focusedField === 'confirm_pass' }"
                                        @focus="focusedField = 'confirm_pass'"
                                        @blur="focusedField = null"
                                    >
                                        <template v-slot:prepend-inner>
                                            <v-icon :color="currentThemeColor" class="mr-3 opacity-80" size="large">mdi-lock-check</v-icon>
                                        </template>
                                    </v-text-field>
                                </div>
                            </div>

                            <!-- Login Fields -->
                            <div v-else>
                                <div class="input-group mb-6">
                                    <v-text-field
                                        v-model="username"
                                        :placeholder="currentTab === 'user' ? 'Enter ID Card Number' : 'Enter Username'"
                                        variant="solo"
                                        density="comfortable"
                                        class="glass-input"
                                        hide-details
                                        bg-color="transparent"
                                        :class="{ 'input-focused': focusedField === 'username' }"
                                        @focus="focusedField = 'username'"
                                        @blur="focusedField = null"
                                    >
                                        <template v-slot:prepend-inner>
                                            <v-icon :color="currentThemeColor" class="mr-3 opacity-80" size="large">
                                                {{ currentTab === 'user' ? 'mdi-card-text-outline' : 'mdi-account-key-outline' }}
                                            </v-icon>
                                        </template>
                                    </v-text-field>
                                </div>

                                <div class="input-group mb-10">
                                    <v-text-field
                                        v-model="password"
                                        placeholder="Enter Password"
                                        :type="showPassword ? 'text' : 'password'"
                                        variant="solo"
                                        density="comfortable"
                                        class="glass-input"
                                        hide-details
                                        bg-color="transparent"
                                        :class="{ 'input-focused': focusedField === 'password' }"
                                        @focus="focusedField = 'password'"
                                        @blur="focusedField = null"
                                    >
                                        <template v-slot:prepend-inner>
                                            <v-icon :color="currentThemeColor" class="mr-3 opacity-80" size="large">mdi-lock-outline</v-icon>
                                        </template>
                                        <template v-slot:append-inner>
                                            <v-icon 
                                                @click="showPassword = !showPassword"
                                                class="cursor-pointer opacity-70 hover-opacity-100"
                                                size="default"
                                            >
                                                {{ showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
                                            </v-icon>
                                        </template>
                                    </v-text-field>
                                </div>
                            </div>

                        </div>
                    </transition>
                </div>

                <v-btn
                  type="submit"
                  height="64"
                  block
                  class="login-btn text-white text-h6 font-weight-bold letter-spacing-1 mb-4"
                  :class="{'btn-glow': !loading}"
                  :style="btnStyle"
                  :loading="loading"
                  elevation="0"
                >
                  {{ isRegistering ? 'Register' : 'Sign In' }}
                  <v-icon right class="ml-2">mdi-arrow-right-thin</v-icon>
                </v-btn>

                <div class="text-center" v-if="currentTab === 'user'">
                    <a href="#" class="text-white opacity-80 text-decoration-none hover-underline" @click.prevent="isRegistering = !isRegistering">
                        {{ isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register" }}
                    </a>
                </div>
                
              </v-form>
            </v-card>
          </div>
        </div>

        <v-card v-else class="success-card pa-16 text-center" max-width="500" rounded="xl" elevation="24" key="login-success">
          <div class="success-icon-wrapper mb-8">
             <v-icon color="white" size="80">mdi-check</v-icon>
             <div class="ripple-ring"></div>
          </div>
          <h2 class="text-h4 font-weight-bold text-white mb-2 tracking-wide">WELCOME BACK</h2>
          <p class="text-blue-grey-lighten-5 opacity-80 text-h6">Authenticating your session...</p>
        </v-card>
      </transition>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2'; 
const router = useRouter(); 

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const isLoggedIn = ref(false);
const currentTab = ref('user'); 
const focusedField = ref(null);

const switchTab = (tab) => {
    currentTab.value = tab;
};

// Colors & Gradients
const userColor = '#00f2ff'; 
const userGradient = 'linear-gradient(90deg, #00c6ff, #0072ff)'; 

const adminColor = '#ffd000';
const adminGradient = 'linear-gradient(90deg, #fce38a, #f38181)'; 

const currentThemeColor = computed(() => {
    return currentTab.value === 'user' ? userColor : adminColor;
});

const currentThemeGradient = computed(() => {
    return currentTab.value === 'user' ? userGradient : adminGradient;
});

// Neon Border Gradients (Conic)
const borderStyle = computed(() => ({
    background: currentTab.value === 'user'
        ? `conic-gradient(transparent 0deg, transparent 80deg, #00c6ff 100deg, #0072ff 140deg, transparent 180deg)`
        : `conic-gradient(transparent 0deg, transparent 80deg, #fce38a 100deg, #f38181 140deg, transparent 180deg)`
}));

const glowStyle = computed(() => ({
    background: currentTab.value === 'user' 
        ? `radial-gradient(circle at 50% 50%, rgba(0, 198, 255, 0.4), transparent 70%)`
        : `radial-gradient(circle at 50% 50%, rgba(255, 208, 0, 0.3), transparent 70%)`
}));

const btnStyle = computed(() => ({
    background: currentThemeGradient.value,
    boxShadow: `0 10px 30px -10px ${currentTab.value === 'user' ? 'rgba(0,114,255,0.5)' : 'rgba(243,129,129,0.5)'}`
}));


const isRegistering = ref(false);
const registerForm = ref({
    userFullname: '',
    userName: '',
    userPass: '',
    confirmPass: ''
});

const login = async () => {
  loading.value = true;
  try {
    const { data: response } = await useFetch('/api/user', {
        method: 'POST', body: { fn: 'userAuth', userName: username.value, userPass: password.value }
    })
    if (response.value && response.value.status) {
        await new Promise(resolve => setTimeout(resolve, 800));
        isLoggedIn.value = true;
        sessionStorage.setItem('loginUser', JSON.stringify(response.value.data))
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (response.value.data.userStatus === 'Admin') {
            router.push('/Admin');
        } else {
            router.push('/home');
        }
    } else { throw new Error('Invalid credentials'); }
  } catch (error) {
    loading.value = false;
    Swal.fire({ icon: 'error', title: 'Authentication Failed', text: 'Please check your information.', background: 'rgba(30, 30, 35, 0.95)', color: '#fff', confirmButtonColor: '#303030', backdrop: 'rgba(0,0,0,0.4)' });
  }
};

const register = async () => {
    if (!registerForm.value.userFullname || !registerForm.value.userName || !registerForm.value.userPass) {
        Swal.fire({ icon: 'warning', title: 'Missing Information', text: 'Please fill in all fields.', background: 'rgba(30, 30, 35, 0.95)', color: '#fff', confirmButtonColor: '#303030' });
        return;
    }
    if (registerForm.value.userPass !== registerForm.value.confirmPass) {
        Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match.', background: 'rgba(30, 30, 35, 0.95)', color: '#fff', confirmButtonColor: '#303030' });
        return;
    }

    loading.value = true;
    try {
        const { data: response } = await useFetch('/api/user', {
            method: 'POST',
            body: { 
                fn: 'insert', 
                userFullname: registerForm.value.userFullname,
                userName: registerForm.value.userName,
                userPass: registerForm.value.userPass
            }
        });

        if (response.value && response.value.status) {
            Swal.fire({ icon: 'success', title: 'Registration Successful', text: 'Please login with your new account.', background: 'rgba(30, 30, 35, 0.95)', color: '#fff', confirmButtonColor: '#303030' });
            isRegistering.value = false;
            // Pre-fill login
            username.value = registerForm.value.userName;
            password.value = '';
        } else {
            throw new Error(response.value?.message || 'Registration failed');
        }
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'Registration Failed', text: error.message || 'Something went wrong.', background: 'rgba(30, 30, 35, 0.95)', color: '#fff', confirmButtonColor: '#303030' });
    } finally {
        loading.value = false;
    }
};

definePageMeta({ layout: 'empty' })
</script>

<style scoped>
@import url('~/assets/css/login.css');
</style>