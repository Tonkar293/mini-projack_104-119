<template>
  <v-app id="admin-layout" class="bg-grey-darken-4">
    <!-- Top Bar -->
    <v-app-bar :elevation="0" class="border-b border-grey-darken-3" color="transparent">
        <v-app-bar-nav-icon variant="text" color="white" @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title class="font-weight-bold text-white">
            STATIONERY <span class="text-blue-accent-2">ADMIN</span>
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn icon color="grey-lighten-1">
            <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
        <v-avatar color="blue-accent-4" size="36" class="ml-2 mr-4">
            <span class="text-caption font-weight-bold text-white">AD</span>
        </v-avatar>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      class="glass-drawer border-0"
      elevation="0"
    >
        <div class="pa-4 d-flex align-center justify-center">
             <div class="text-h6 font-weight-black text-white">MENU</div>
        </div>
        
        <v-divider color="rgba(255,255,255,0.1)"></v-divider>

        <v-list class="pa-4" density="compact" nav>
            <v-list-item
                rounded="lg"
                to="/Admin"
                active-class="nav-item--active"
                class="nav-item mb-2"
                prepend-icon="mdi-view-dashboard-outline"
            >
                <v-list-item-title class="font-weight-bold">Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item
                rounded="lg"
                to="/Admin/customers"
                active-class="nav-item--active"
                class="nav-item mb-2"
                prepend-icon="mdi-account-group-outline"
            >
                <v-list-item-title class="font-weight-bold">ข้อมูลลูกค้า</v-list-item-title>
            </v-list-item>

            <v-list-item
                rounded="lg"
                to="/Admin/student"
                active-class="nav-item--active"
                class="nav-item mb-2"
                prepend-icon="mdi-account-school-outline"
            >
                <v-list-item-title class="font-weight-bold">จัดการนักศึกษา</v-list-item-title>
            </v-list-item>

            <v-list-item
                rounded="lg"
                to="/Admin/categories"
                active-class="nav-item--active"
                class="nav-item mb-2"
                prepend-icon="mdi-shape-outline"
            >
                <v-list-item-title class="font-weight-bold">หมวดหมู่สินค้า</v-list-item-title>
            </v-list-item>

            <v-list-item
                rounded="lg"
                to="/Admin/orders"
                active-class="nav-item--active"
                class="nav-item mb-2"
                prepend-icon="mdi-file-document-outline"
            >
                <v-list-item-title class="font-weight-bold">รายการคำสั่งซื้อ</v-list-item-title>
            </v-list-item>
        </v-list>

        <template v-slot:append>
            <div class="pa-4">
                <v-btn block color="error" variant="tonal" rounded="lg" @click="signout">
                    <v-icon start>mdi-logout</v-icon>
                    ออกจากระบบ
                </v-btn>
            </div>
        </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
        <v-container class="pa-0" fluid>
            <slot />
        </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  const drawer = ref(true)

  onMounted(()=>{
    const loginUser = JSON.parse(sessionStorage.getItem('loginUser')) || {}
    if(loginUser?.userStatus != 'Admin') {
        navigateTo('/', {replace: true})
    }
  })

  function signout() {
    sessionStorage.clear()
    navigateTo('/', {replace: true})
  }
</script>

<style>
@import url('~/assets/css/admin.css');
</style>