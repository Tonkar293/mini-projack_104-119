<template>
    <div class="orders-management fill-height pa-6">
        <div class="d-flex justify-space-between align-center mb-8">
            <div>
                <h1 class="text-h4 font-weight-black text-white mb-1 is-uppercase">Order Management</h1>
                <div class="text-subtitle-1 text-grey-lighten-2">Track and manage customer orders</div>
            </div>
            <div class="d-flex gap-4">
                 <v-chip color="purple-accent-2" variant="flat" class="font-weight-bold px-4" size="large">
                    <v-icon start>mdi-receipt-text-check</v-icon>
                    {{ orders.length }} Orders
                </v-chip>
                <v-btn color="blue-accent-3" class="font-weight-bold text-white shadow-glow" rounded="xl" @click="fetchOrders" :loading="loading">
                    <v-icon start>mdi-refresh</v-icon>
                    Refresh
                </v-btn>
            </div>
        </div>
        
        <v-card class="glass-card pa-0" elevation="10" border>
            <v-card-title class="d-flex align-center py-4 px-6 border-b border-white-10">
                <v-icon color="blue-accent-2" class="mr-3">mdi-format-list-bulleted</v-icon>
                <span class="text-h6 font-weight-bold text-white">Recent Orders</span>
                <v-spacer></v-spacer>
                <div style="width: 300px">
                    <v-text-field
                        v-model="search"
                        prepend-inner-icon="mdi-magnify"
                        label="Search orders..."
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
                :items="orders"
                :search="search"
                :loading="loading"
                v-model:expanded="expanded"
                show-expand
                item-value="orderID"
                class="bg-transparent text-white"
                hover
            >
                <!-- Status Column -->
                <template v-slot:item.status="{ item }">
                    <v-chip
                        :color="getStatusColor(item.status)"
                        size="small"
                        class="font-weight-bold text-uppercase letter-spacing-1"
                        variant="flat"
                    >
                        {{ item.status || 'Completed' }}
                    </v-chip>
                </template>

                 <!-- Amount Column -->
                <template v-slot:item.totalAmount="{ item }">
                     <span class="font-weight-bold text-green-accent-3 text-body-1">฿{{ item.totalAmount?.toLocaleString() }}</span>
                </template>

                <!-- Date Column -->
                <template v-slot:item.createdAt="{ item }">
                    <div class="d-flex align-center text-grey-lighten-1">
                        <v-icon size="x-small" class="mr-1">mdi-calendar-clock</v-icon>
                        <span class="text-caption font-family-mono">{{ new Date(item.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }) }}</span>
                    </div>
                </template>

                <!-- Customer Column -->
                <template v-slot:item.user="{ item }">
                    <div class="d-flex align-center py-2">
                        <v-avatar color="indigo-accent-2" size="36" class="mr-3 elevation-2 font-weight-bold">
                            <span class="text-caption text-white font-weight-black text-h6">{{ item.user?.userFullname?.charAt(0) || 'U' }}</span>
                        </v-avatar>
                        <div class="d-flex flex-column">
                            <span class="font-weight-bold text-body-2 text-white">{{ item.user?.userFullname || 'Unknown' }}</span>
                            <span class="text-caption text-grey-lighten-1">{{ item.user?.userName }}</span>
                        </div>
                    </div>
                </template>

                <!-- Expanded Row (Order Details) -->
                <template v-slot:expanded-row="{ columns, item }">
                    <tr>
                        <td :colspan="columns.length" class="pa-0">
                            <div class="bg-grey-darken-4 pa-6" style="box-shadow: inset 0 0 20px rgba(0,0,0,0.5);">
                                <div class="d-flex align-center mb-4">
                                    <v-icon size="small" color="blue-accent-2" class="mr-2">mdi-basket-outline</v-icon>
                                    <span class="text-subtitle-2 font-weight-bold text-blue-accent-1">Order Items (#{{ item.orderID }})</span>
                                </div>
                                <v-card variant="outlined" class="bg-transparent border-white-10">
                                    <v-table density="compact" class="bg-transparent text-white">
                                        <thead>
                                            <tr>
                                                <th class="text-left text-grey-lighten-2">Product Name</th>
                                                <th class="text-center text-grey-lighten-2">Quantity</th>
                                                <th class="text-right text-grey-lighten-2">Price</th>
                                                <th class="text-right text-grey-lighten-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="orderItem in item.OrderItems" :key="orderItem.itemID">
                                                <td class="font-weight-medium text-white">{{ orderItem.productName }}</td>
                                                <td class="text-center text-grey-lighten-1">{{ orderItem.quantity }}</td>
                                                <td class="text-right text-grey-lighten-1">฿{{ orderItem.price }}</td>
                                                <td class="text-right font-weight-bold text-green-accent-2">฿{{ (orderItem.price * orderItem.quantity).toLocaleString() }}</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-card>
                            </div>
                        </td>
                    </tr>
                </template>

                <!-- Custom Expand Button -->
                <template v-slot:item.data-table-expand="{ item, toggleExpand, isExpanded }">
                    <v-btn
                        :color="isExpanded(item) ? 'blue-accent-2' : 'white'"
                        :variant="isExpanded(item) ? 'tonal' : 'text'"
                        size="small"
                        class="text-none font-weight-bold"
                        rounded="lg"
                        @click="toggleExpand(item)"
                    >
                        {{ isExpanded(item) ? 'Hide Details' : 'View Details' }}
                        <v-icon :icon="isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down'" end></v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
    layout: 'admin-layout'
})

const search = ref('')
const loading = ref(false)
const expanded = ref([])
const orders = ref([])

const headers = [
    { title: 'ID', key: 'orderID', align: 'start' },
    { title: 'Customer', key: 'user', align: 'start' },
    { title: 'Date', key: 'createdAt', align: 'start' },
    { title: 'Total', key: 'totalAmount', align: 'end' },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Actions', key: 'data-table-expand', align: 'end' },
]

const getStatusColor = (status) => {
    if (!status) return 'success'
    const s = status.toLowerCase()
    if (s === 'completed') return 'success'
    if (s === 'pending') return 'warning'
    if (s === 'cancelled') return 'error'
    return 'info'
}

const fetchOrders = async () => {
    loading.value = true
    try {
        const { data: response } = await useFetch('/api/order')
        if (response.value && response.value.status) {
            orders.value = response.value.data
        }
    } catch (error) {
        console.error('Error fetching orders:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchOrders()
})
</script>

<style scoped>
.glass-card {
    background: rgba(30, 41, 59, 0.7) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
}
.border-white-10 {
    border-color: rgba(255, 255, 255, 0.1) !important;
}
.glass-input :deep(.v-field__outline) {
    --v-field-border-opacity: 0.2;
}
.shadow-glow {
    box-shadow: 0 0 15px rgba(41, 121, 255, 0.3);
}
.letter-spacing-1 {
    letter-spacing: 1px;
}
.font-family-mono {
    font-family: monospace;
}

/* Row Animations */
/* Row Animations */
:deep(tbody tr) {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    will-change: transform, opacity;
}

:deep(tbody tr:nth-child(odd)) {
    animation: slideInLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

:deep(tbody tr:nth-child(even)) {
    animation: slideInRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* Stagger delay for first 15 rows for a clearer cascading effect */
:deep(tbody tr:nth-child(1)) { animation-delay: 0.05s; }
:deep(tbody tr:nth-child(2)) { animation-delay: 0.1s; }
:deep(tbody tr:nth-child(3)) { animation-delay: 0.15s; }
:deep(tbody tr:nth-child(4)) { animation-delay: 0.2s; }
:deep(tbody tr:nth-child(5)) { animation-delay: 0.25s; }
:deep(tbody tr:nth-child(6)) { animation-delay: 0.3s; }
:deep(tbody tr:nth-child(7)) { animation-delay: 0.35s; }
:deep(tbody tr:nth-child(8)) { animation-delay: 0.4s; }
:deep(tbody tr:nth-child(9)) { animation-delay: 0.45s; }
:deep(tbody tr:nth-child(10)) { animation-delay: 0.5s; }
:deep(tbody tr:nth-child(11)) { animation-delay: 0.55s; }
:deep(tbody tr:nth-child(12)) { animation-delay: 0.6s; }
:deep(tbody tr:nth-child(13)) { animation-delay: 0.65s; }
:deep(tbody tr:nth-child(14)) { animation-delay: 0.7s; }
:deep(tbody tr:nth-child(15)) { animation-delay: 0.75s; }

:deep(tbody tr:hover) {
    transform: scale(1.02) !important;
    background: rgba(255, 255, 255, 0.08) !important;
    z-index: 100;
    position: relative;
    box-shadow: 0 8px 25px rgba(0,0,0,0.4);
}

@keyframes slideInLeft {
    0% {
        opacity: 0;
        transform: translateX(-100px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    0% {
        opacity: 0;
        transform: translateX(100px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
