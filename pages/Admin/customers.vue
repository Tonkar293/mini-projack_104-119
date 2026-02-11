<template>
    <div class="customers-management fill-height pa-6">
        <div class="d-flex justify-space-between align-center mb-8">
            <div>
                <h1 class="text-h4 font-weight-black text-white mb-1 is-uppercase">Customer Management</h1>
                <div class="text-subtitle-1 text-grey-lighten-2">View registered users and their purchase history</div>
            </div>
            <div class="d-flex gap-4">
                 <v-chip color="cyan-accent-3" variant="flat" class="font-weight-bold px-4" size="large">
                    <v-icon start>mdi-account-group</v-icon>
                    {{ users.length }} Users
                </v-chip>
                <v-btn color="blue-accent-3" class="font-weight-bold text-white shadow-glow" rounded="xl" @click="fetchUsers" :loading="loading">
                    <v-icon start>mdi-refresh</v-icon>
                    Refresh
                </v-btn>
            </div>
        </div>
        
        <v-card class="glass-card pa-0" elevation="10" border>
            <v-card-title class="d-flex align-center py-4 px-6 border-b border-white-10">
                <v-icon color="cyan-accent-2" class="mr-3">mdi-account-details</v-icon>
                <span class="text-h6 font-weight-bold text-white">Registered Users</span>
                <v-spacer></v-spacer>
                <div style="width: 300px">
                    <v-text-field
                        v-model="search"
                        prepend-inner-icon="mdi-magnify"
                        label="Search users..."
                        single-line
                        hide-details
                        variant="solo"
                        density="compact"
                        bg-color="rgba(255,255,255,0.1)"
                        class="glass-input text-white"
                        theme="dark"
                    ></v-text-field>
                </div>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items="users"
                :search="search"
                :loading="loading"
                class="bg-transparent text-white"
                hover
            >
                <!-- Avatar Column -->
                <template v-slot:item.avatar="{ item }">
                     <v-avatar color="cyan-darken-2" size="36" class="font-weight-bold">
                        <span class="text-white">{{ item.userFullname?.charAt(0) || 'U' }}</span>
                    </v-avatar>
                </template>

                <!-- Status Column -->
                <template v-slot:item.userStatus="{ item }">
                    <v-chip
                        :color="item.userStatus === 'Admin' ? 'purple-accent-2' : 'green-accent-3'"
                        size="small"
                        class="font-weight-bold text-uppercase"
                        variant="flat"
                    >
                        {{ item.userStatus }}
                    </v-chip>
                </template>

                 <!-- Actions Column -->
                <template v-slot:item.actions="{ item }">
                    <v-btn
                        color="blue-lighten-1"
                        variant="tonal"
                        size="small"
                        class="font-weight-bold"
                        rounded="lg"
                        prepend-icon="mdi-history"
                        @click="viewOrders(item)"
                    >
                        View Orders
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- User Orders Dialog -->
        <v-dialog v-model="orderDialog" max-width="900" scrollable>
            <v-card class="glass-card rounded-xl">
                 <v-card-title class="pa-6 border-b border-white-10 d-flex justify-space-between align-center">
                    <div class="d-flex align-center">
                        <v-avatar color="cyan-darken-2" size="40" class="mr-3">
                            <span class="text-h6 font-weight-bold text-white">{{ selectedUser?.userFullname?.charAt(0) || 'U' }}</span>
                        </v-avatar>
                        <div>
                            <div class="text-h6 font-weight-bold text-white">{{ selectedUser?.userFullname }}</div>
                            <div class="text-subtitle-2 text-grey-lighten-2">{{ selectedUser?.userName }}</div>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" color="white" @click="orderDialog = false"></v-btn>
                </v-card-title>
                
                <v-card-text class="pa-6 custom-scrollbar" style="max-height: 600px;">
                     <div v-if="ordersLoading" class="text-center py-8">
                        <v-progress-circular indeterminate color="cyan-accent-3" size="64"></v-progress-circular>
                    </div>
                    <div v-else-if="userOrders.length === 0" class="text-center py-12 text-grey-lighten-2">
                        <v-icon size="64" class="mb-4 opacity-50">mdi-cart-off</v-icon>
                        <div class="text-h6">No orders found for this user.</div>
                    </div>
                    <div v-else>
                         <v-card
                            v-for="order in userOrders"
                            :key="order.orderID"
                            class="mb-4 glass-card-light rounded-lg overflow-hidden"
                            elevation="0"
                        >
                            <div class="pa-4 d-flex justify-space-between align-center bg-white-5">
                                <div>
                                    <div class="text-subtitle-1 font-weight-bold text-white">Order #{{ order.orderID }}</div>
                                    <div class="text-caption text-grey-lighten-2">
                                        {{ new Date(order.createdAt).toLocaleString('th-TH') }}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-h6 font-weight-bold text-green-accent-3">฿{{ order.totalAmount?.toLocaleString() }}</div>
                                     <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">Completed</v-chip>
                                </div>
                            </div>
                            
                            <v-divider class="border-white-10"></v-divider>
                            
                            <div class="pa-4 bg-black-20">
                                <div class="text-subtitle-2 font-weight-bold text-grey-lighten-1 mb-2">Order Items</div>
                                <div v-for="item in order.OrderItems" :key="item.itemID" class="d-flex justify-space-between align-center mb-2 px-2 py-1 rounded hover-bg">
                                    <div class="d-flex align-center">
                                         <v-icon size="small" color="cyan-accent-2" class="mr-2">mdi-package-variant-closed</v-icon>
                                         <span class="text-white">{{ item.productName }}</span>
                                         <span class="text-grey ml-2 text-caption">x{{ item.quantity }}</span>
                                    </div>
                                    <div class="text-white font-weight-medium">฿{{ (item.price * item.quantity).toLocaleString() }}</div>
                                </div>
                            </div>
                        </v-card>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
    layout: 'admin-layout'
})

const search = ref('')
const loading = ref(false)
const users = ref([])
const orderDialog = ref(false)
const selectedUser = ref(null)
const userOrders = ref([])
const ordersLoading = ref(false)

const headers = [
    { title: '', key: 'avatar', align: 'center', sortable: false, width: '50px' },
    { title: 'Full Name', key: 'userFullname', align: 'start' },
    { title: 'Username', key: 'userName', align: 'start' },
    { title: 'Status', key: 'userStatus', align: 'center' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

const fetchUsers = async () => {
    loading.value = true
    try {
        const { data: response } = await useFetch('/api/user')
        if (response.value) {
            users.value = response.value
        }
    } catch (error) {
        console.error('Error fetching users:', error)
    } finally {
        loading.value = false
    }
}

const viewOrders = async (user) => {
    selectedUser.value = user
    orderDialog.value = true
    ordersLoading.value = true
    userOrders.value = []
    
    try {
        const { data: response } = await useFetch('/api/order', {
            query: { userID: user.userID }
        })
        if (response.value && response.value.status) {
            userOrders.value = response.value.data
        }
    } catch (error) {
        console.error('Error fetching user orders:', error)
    } finally {
        ordersLoading.value = false
    }
}

onMounted(() => {
    fetchUsers()
})
</script>

<style scoped>
.glass-card {
    background: rgba(30, 41, 59, 0.7) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
}
.glass-card-light {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.border-white-10 {
    border-color: rgba(255, 255, 255, 0.1) !important;
}
.glass-input :deep(.v-field__outline) {
    --v-field-border-opacity: 0.2;
}
.shadow-glow {
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
}
.bg-white-5 {
    background: rgba(255, 255, 255, 0.05);
}
.bg-black-20 {
    background: rgba(0, 0, 0, 0.2);
}
.hover-bg:hover {
    background: rgba(255, 255, 255, 0.05);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
}
</style>
