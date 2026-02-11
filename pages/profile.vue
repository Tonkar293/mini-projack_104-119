<template>
  <v-main class="fill-height position-relative overflow-hidden">
    <!-- Animated Background (Same as Home) -->
    <div class="animated-background"></div>
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <v-container class="fill-height d-flex justify-center align-center position-relative z-index-1">
      <transition name="scale-transition" appear>
        <v-card class="glass-profile-card pa-8 rounded-xl" max-width="500" width="100%">
          
          <div class="d-flex flex-column align-center mb-6">
            <div class="avatar-container mb-4">
              <v-avatar size="120" class="elevation-10 border-lg">
                <v-img src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Sunglasses&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light" alt="User Avatar"></v-img>
              </v-avatar>
              <v-btn icon="mdi-camera" size="small" color="cyan-accent-3" class="edit-avatar-btn"></v-btn>
            </div>
            
            <h2 class="text-h4 font-weight-black text-white mb-1">{{ userData?.userFullname || userData?.userName || 'User' }}</h2>
            <div class="text-subtitle-1 text-cyan-accent-2 font-weight-bold">Member</div>
          </div>

          <v-divider class="mb-6 border-opacity-25" color="white"></v-divider>

            <div class="user-stats d-flex justify-space-between mb-8 px-4">
            <div class="text-center cursor-pointer hover-scale" @click="openOrderHistory">
              <div class="text-h5 font-weight-bold text-white">{{ orderCount }}</div>
              <div class="text-caption text-grey-lighten-2">Orders</div>
            </div>
             <div class="text-center">
              <div class="text-h5 font-weight-bold text-white">0</div>
              <div class="text-caption text-grey-lighten-2">Wishlist</div>
            </div>
             <div class="text-center">
              <div class="text-h5 font-weight-bold text-white">Rank</div>
              <div class="text-caption text-grey-lighten-2">Bronze</div>
            </div>
          </div>

          <div class="d-flex flex-column gap-3">
             <v-btn
                block
                height="50"
                rounded="xl"
                variant="outlined"
                color="white"
                class="glass-btn-outline mb-3"
                prepend-icon="mdi-history"
                @click="openOrderHistory"
             >
                Order History
             </v-btn>

             <v-btn
                block
                height="50"
                rounded="xl"
                variant="outlined"
                color="white"
                class="glass-btn-outline mb-3"
                prepend-icon="mdi-account-edit"
                @click="openEditProfile"
             >
                Edit Profile
             </v-btn>
             
             <v-btn
                block
                height="50"
                rounded="xl"
                color="red-accent-2"
                class="font-weight-bold text-white shadow-btn mb-3"
                prepend-icon="mdi-logout"
                @click="logout"
             >
                Logout
             </v-btn>

             <v-btn
                block
                height="50"
                rounded="xl"
                variant="text"
                color="white"
                @click="goHome"
                prepend-icon="mdi-arrow-left"
             >
                Back to Home
             </v-btn>
          </div>

        </v-card>
      </transition>
    </v-container>

    <!-- Order History Modal -->
    <v-dialog v-model="historyDialog" max-width="600" scrollable>
        <v-card class="glass-card rounded-xl">
            <v-card-title class="text-h5 font-weight-bold text-white pa-4 d-flex justify-space-between align-center">
                My Orders
                <v-btn icon="mdi-close" variant="text" color="white" @click="historyDialog = false"></v-btn>
            </v-card-title>
            <v-card-text class="pa-4 custom-scrollbar" style="max-height: 400px;">
                <div v-if="orders.length === 0" class="text-center text-grey-lighten-1 py-8">
                    <v-icon size="64" class="mb-4 opacity-50">mdi-text-box-search-outline</v-icon>
                    <div>No orders found.</div>
                </div>
                <div v-else class="d-flex flex-column gap-3">
                    <v-card
                        v-for="order in orders"
                        :key="order.orderID"
                        class="order-item pa-4 rounded-lg glass-list-item"
                        elevation="0"
                    >
                        <div class="d-flex justify-space-between mb-2">
                            <span class="text-subtitle-1 font-weight-bold text-white">Order #{{ order.orderID }}</span>
                            <v-chip color="success" size="small" variant="flat" class="font-weight-bold">Completed</v-chip>
                        </div>
                        <div class="text-caption text-grey-lighten-2 mb-3">
                            {{ new Date(order.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                        </div>
                         <div class="d-flex justify-space-between align-center border-t border-opacity-25 pt-3">
                            <span class="text-h6 font-weight-black text-cyan-accent-2">฿{{ order.totalAmount.toLocaleString() }}</span>
                            <v-btn
                                size="small"
                                color="cyan-accent-3"
                                class="text-white font-weight-bold"
                                prepend-icon="mdi-receipt-text"
                                rounded="pill"
                                @click="viewReceipt(order)"
                            >
                                Receipt
                            </v-btn>
                        </div>
                    </v-card>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- Receipt Modal -->
    <v-dialog v-model="receiptDialog" max-width="400">
        <v-card class="receipt-card rounded-xl pa-0 overflow-hidden" v-if="selectedOrder">
            <div class="receipt-header bg-cyan-accent-3 pa-6 text-center text-white">
                <v-icon size="48" class="mb-2">mdi-check-decagram</v-icon>
                <div class="text-h5 font-weight-black">PAYMENT SUCCESS</div>
                <div class="text-subtitle-2 opacity-90">Thank you for your purchase!</div>
            </div>
            
            <div class="receipt-body pa-6 bg-white text-black">
                <div class="d-flex justify-space-between mb-4">
                    <span class="text-grey-darken-1 font-weight-bold">Date</span>
                    <span class="font-weight-medium">{{ new Date(selectedOrder.createdAt).toLocaleDateString('th-TH') }}</span>
                </div>
                <div class="d-flex justify-space-between mb-6">
                    <span class="text-grey-darken-1 font-weight-bold">Order ID</span>
                    <span class="font-weight-medium">#{{ selectedOrder.orderID }}</span>
                </div>

                <v-divider class="mb-4 border-dashed"></v-divider>

                <div class="items-list mb-6">
                    <div v-for="item in selectedOrder.OrderItems" :key="item.itemID" class="d-flex justify-space-between mb-2 text-body-2">
                        <div class="d-flex flex-column">
                            <span class="font-weight-bold text-truncate" style="max-width: 180px;">Product #{{ item.productID }}</span> <!-- Ideally product name if available -->
                            <span class="text-caption text-grey">Qty: {{ item.quantity }}</span>
                        </div>
                        <span class="font-weight-bold">฿{{ (item.price * item.quantity).toLocaleString() }}</span>
                    </div>
                </div>

                <v-divider class="mb-4 border-dashed"></v-divider>

                <div class="d-flex justify-space-between align-end mb-2">
                    <span class="text-h6 font-weight-bold text-grey-darken-3">Total Amount</span>
                    <span class="text-h4 font-weight-black text-cyan-darken-2">฿{{ selectedOrder.totalAmount.toLocaleString() }}</span>
                </div>
            </div>

            <div class="receipt-footer bg-grey-lighten-4 pa-4 text-center">
                 <v-btn color="cyan-darken-1" variant="text" block class="font-weight-bold" @click="receiptDialog = false">
                    Close Receipt
                 </v-btn>
            </div>
        </v-card>
    </v-dialog>

    <!-- Edit Profile Dialog (Glass) -->
    <v-dialog v-model="editDialog" max-width="500">
        <v-card class="glass-card rounded-xl pa-0 overflow-hidden">
            <div class="pa-6 border-b border-opacity-25 relative">
                <div class="text-h5 font-weight-bold text-white text-center">Edit Profile</div>
                <v-btn icon="mdi-close" variant="text" color="white" size="small" 
                    @click="editDialog = false" class="position-absolute" style="top: 16px; right: 16px;"></v-btn>
            </div>
            
            <v-card-text class="pa-6">
                 <v-form @submit.prevent="saveProfile">
                    <div class="mb-4">
                        <label class="text-caption text-grey-lighten-2 font-weight-bold mb-1 d-block">Full Name</label>
                        <v-text-field
                            v-model="editForm.userFullname"
                            variant="solo"
                            bg-color="rgba(255,255,255,0.05)"
                            color="white"
                            class="text-white"
                            hide-details
                            prepend-inner-icon="mdi-account"
                            rounded="lg"
                        ></v-text-field>
                    </div>

                    <div class="mb-4">
                         <label class="text-caption text-grey-lighten-2 font-weight-bold mb-1 d-block">New Password (Optional)</label>
                         <v-text-field
                            v-model="editForm.userPass"
                            type="password"
                            variant="solo"
                            bg-color="rgba(255,255,255,0.05)"
                            color="white"
                            class="text-white"
                            hide-details
                            prepend-inner-icon="mdi-lock"
                            rounded="lg"
                            placeholder="Leave blank to keep current"
                        ></v-text-field>
                    </div>

                    <div class="mb-6" v-if="editForm.userPass">
                         <label class="text-caption text-grey-lighten-2 font-weight-bold mb-1 d-block">Confirm New Password</label>
                         <v-text-field
                            v-model="editForm.confirmPass"
                            type="password"
                            variant="solo"
                            bg-color="rgba(255,255,255,0.05)"
                            color="white"
                            class="text-white"
                            hide-details
                            prepend-inner-icon="mdi-lock-check"
                            rounded="lg"
                        ></v-text-field>
                    </div>

                    <v-btn
                        block
                        height="50"
                        color="cyan-accent-3"
                        class="text-white font-weight-bold shadow-btn"
                        rounded="xl"
                        type="submit"
                        :loading="saving"
                    >
                        Save Changes
                    </v-btn>
                 </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>

  </v-main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const router = useRouter()
const userData = ref(null)
const orders = ref([])
const orderCount = ref(0)
const historyDialog = ref(false)
const receiptDialog = ref(false)
const selectedOrder = ref(null)

onMounted(async () => {
    const storedUser = sessionStorage.getItem('loginUser')
    console.log('Profile loaded. Stored user:', storedUser)
    if (storedUser) {
        userData.value = JSON.parse(storedUser)
        console.log('Fetching orders for UserID:', userData.value.userID)
        await fetchOrders(userData.value.userID)
    } else {
        // Redirect if not logged in
        router.push('/login')
    }
})

async function fetchOrders(userID) {
    try {
        const { data: response } = await useFetch('/api/order', {
            query: { userID }
        })
        if (response.value && response.value.status) {
            orders.value = response.value.data
            orderCount.value = orders.value.length
        }
    } catch (e) {
        console.error('Failed to fetch orders', e)
        // Swal.fire('Error', 'Could not load order history', 'error')
    }
}

function openOrderHistory() {
    historyDialog.value = true
}

function viewReceipt(order) {
    selectedOrder.value = order
    receiptDialog.value = true
}

function logout() {
    sessionStorage.removeItem('loginUser')
    router.push('/')
}

function goHome() {
    router.push('/home')
}

// Edit Profile Logic
const editDialog = ref(false)
const editForm = ref({
    userFullname: '',
    userPass: '',
    confirmPass: ''
})
const saving = ref(false)

function openEditProfile() {
    if (userData.value) {
        editForm.value = {
            userFullname: userData.value.userFullname || '',
            userPass: '',
            confirmPass: ''
        }
        editDialog.value = true
    }
}

async function saveProfile() {
    if (editForm.value.userPass && editForm.value.userPass !== editForm.value.confirmPass) {
        Swal.fire('Error', 'Passwords do not match', 'error')
        return
    }

    saving.value = true
    try {
        const payload = {
            fn: 'updateProfile',
            userID: userData.value.userID,
            userFullname: editForm.value.userFullname,
            userPass: editForm.value.userPass
        }
        
        const { data: response } = await useFetch('/api/user', {
            method: 'POST',
            body: payload
        })

        if (response.value && response.value.status) {
            Swal.fire('Success', 'Profile updated successfully', 'success')
            userData.value = response.value.data
            sessionStorage.setItem('loginUser', JSON.stringify(response.value.data))
            editDialog.value = false
        } else {
            throw new Error(response.value?.message || 'Update failed')
        }

    } catch (e) {
        console.error(e)
        Swal.fire('Error', 'Failed to update profile', 'error')
    } finally {
        saving.value = false
    }
}

definePageMeta({
    layout: 'empty'
})
</script>

<style scoped>
/* Reuse Animated Background from Home */
.animated-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #141E30);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    z-index: 0;
}

@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Floating Shapes */
.floating-shapes .shape {
    position: absolute;
    filter: blur(50px);
    z-index: 0;
    opacity: 0.6;
    animation: float 20s infinite;
}

.shape-1 { width: 300px; height: 300px; background: #00f2ff; top: -50px; left: -50px; border-radius: 50%; }
.shape-2 { width: 400px; height: 400px; background: #ff00cc; bottom: -100px; right: -100px; border-radius: 40% 60% 70% 30%; animation-delay: -5s; }
.shape-3 { width: 200px; height: 200px; background: #7000ff; top: 50%; left: 50%; border-radius: 50%; animation-delay: -10s; }

@keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -50px) rotate(10deg); }
    66% { transform: translate(-20px, 20px) rotate(-5deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
}

.glass-profile-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-card {
    background: rgba(20, 20, 35, 0.9) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.avatar-container {
    position: relative;
}

.border-lg {
    border: 4px solid rgba(255, 255, 255, 0.3);
}

.edit-avatar-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    border: 2px solid white;
}

.glass-btn-outline {
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
}

.shadow-btn {
    box-shadow: 0 4px 15px rgba(255, 82, 82, 0.4);
}

.hover-scale {
    transition: transform 0.2s ease;
}
.hover-scale:hover {
    transform: scale(1.1);
}

.glass-list-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: background 0.2s;
}
.glass-list-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Receipt Styles */
.receipt-card {
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}
.border-dashed {
    border-style: dashed;
    border-width: 2px;
    opacity: 0.3;
}

.gap-3 { gap: 12px; }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
}
</style>
