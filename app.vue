<template>
  <v-app class="fill-height">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<style>
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #111827; /* Dark background to match admin theme */
}
</style>

<script setup>
import { useTheme } from 'vuetify'
import { onMounted } from 'vue'

const theme = useTheme()

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  } else {
    // Optional: Check system preference
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    if (userPrefersDark) {
           theme.global.name.value = 'dark'
    }
  }
})
</script>

