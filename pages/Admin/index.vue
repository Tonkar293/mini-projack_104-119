<template>
    <div class="admin-dashboard fill-height pa-6">
        <!-- Header Profile Section -->
        <div class="d-flex flex-column flex-md-row justify-space-between align-center mb-8">
            <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar color="blue-accent-4" size="64" class="mr-4 elevation-4 border-2 border-white">
                    <span class="text-h4 font-weight-black text-white">{{ user.userFullname?.charAt(0) || 'A' }}</span>
                </v-avatar>
                <div>
                    <div class="d-flex align-center">
                        <h1 class="text-h4 font-weight-black text-white mb-1 mr-2 text-shadow-glow">{{ user.userFullname || 'Administrator' }}</h1>
                        <v-chip color="amber-accent-3" class="font-weight-bold px-3" size="small" variant="flat" elevation="2">
                            <v-icon start icon="mdi-shield-crown" size="small"></v-icon>
                            ADMIN
                        </v-chip>
                    </div>
                    <div class="text-subtitle-1 text-blue-grey-lighten-3 font-weight-medium">ยินดีต้อนรับสู่แดชบอร์ดของคุณ</div>
                </div>
            </div>

            <div class="d-flex gap-4">
                <v-btn
                    prepend-icon="mdi-package-variant-closed"
                    color="indigo-accent-2"
                    class="font-weight-bold text-none px-6"
                    rounded="xl"
                    elevation="4"
                    to="/Admin/products"
                    height="44"
                >
                    จัดการสินค้า
                </v-btn>
                <v-btn
                    prepend-icon="mdi-logout"
                    variant="outlined"
                    color="white"
                    class="glass-btn pl-4 pr-5 text-none"
                    rounded="xl"
                    @click="logout"
                    height="44"
                >
                    ออกจากระบบ
                </v-btn>
            </div>
        </div>

        <!-- Stats Cards -->
        <v-row class="mb-6">
            <v-col cols="12" md="4">
                <v-card class="glass-card stat-card pa-5" elevation="10" border>
                    <div class="d-flex justify-space-between align-start mb-4">
                        <div class="stat-icon-bg bg-gradient-1">
                            <v-icon color="white" size="28">mdi-account-group</v-icon>
                        </div>
                    </div>
                    <div class="text-h3 font-weight-black text-white mb-1 text-shadow-sm">{{ studentCount }}</div>
                    <div class="text-body-2 text-grey-lighten-2 font-weight-medium">นักเรียนทั้งหมด</div>
                    <v-progress-linear color="blue-accent-3" model-value="75" height="4" rounded class="mt-4 opacity-50"></v-progress-linear>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="glass-card stat-card pa-5" elevation="10" border>
                    <div class="d-flex justify-space-between align-start mb-4">
                        <div class="stat-icon-bg bg-gradient-2">
                            <v-icon color="white" size="28">mdi-shopping</v-icon>
                        </div>
                    </div>
                    <div class="text-h3 font-weight-black text-white mb-1 text-shadow-sm">{{ orderCount }}</div>
                    <div class="text-body-2 text-grey-lighten-2 font-weight-medium">คำสั่งซื้อทั้งหมด</div>
                    <v-progress-linear color="purple-accent-3" model-value="45" height="4" rounded class="mt-4 opacity-50"></v-progress-linear>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="glass-card stat-card pa-5" elevation="10" border>
                    <div class="d-flex justify-space-between align-start mb-4">
                        <div class="stat-icon-bg bg-gradient-3">
                            <v-icon color="white" size="28">mdi-currency-usd</v-icon>
                        </div>
                    </div>
                    <div class="text-h3 font-weight-black text-white mb-1 text-shadow-sm">฿{{ totalRevenue.toLocaleString() }}</div>
                    <div class="text-body-2 text-grey-lighten-2 font-weight-medium">รายได้รวม</div>
                    <v-progress-linear color="amber-accent-3" model-value="60" height="4" rounded class="mt-4 opacity-50"></v-progress-linear>
                </v-card>
            </v-col>
        </v-row>

        <!-- Charts Row -->
        <v-row class="mb-6">
            <!-- Revenue Trend Chart -->
            <v-col cols="12" md="7">
                <v-card class="glass-card pa-6 fill-height d-flex flex-column" elevation="10" border>
                    <div class="d-flex align-center justify-space-between mb-6">
                        <div>
                            <h3 class="text-h6 font-weight-black text-white mb-1">แนวโน้มรายได้</h3>
                            <div class="text-caption text-grey-lighten-1 font-weight-medium">เปรียบเทียบรายได้รายวัน</div>
                        </div>
                        <div class="d-flex align-center gap-2">
                             <v-chip size="x-small" color="cyan" variant="flat" class="font-weight-bold">7 วันล่าสุด</v-chip>
                             <v-icon color="cyan-accent-2" class="glow-icon">mdi-chart-timeline-variant</v-icon>
                        </div>
                    </div>
                    
                    <div class="chart-container flex-grow-1 position-relative" ref="chartContainer" style="min-height: 180px;">
                        <div v-if="revenueData.length === 0" class="d-flex align-center justify-center fill-height text-grey">
                            ไม่มีข้อมูล
                        </div>
                        <svg v-else viewBox="0 0 100 40" preserveAspectRatio="none" class="chart-svg">
                            <defs>
                                <linearGradient id="premiumGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.6"/>
                                    <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="1.5" result="blur"/>
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                            </defs>
                            
                            <!-- Grid Lines -->
                             <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.05)" stroke-width="0.1" />
                            <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.05)" stroke-width="0.1" stroke-dasharray="2 2" />
                            <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" stroke-width="0.1" stroke-dasharray="2 2" />
                            <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.05)" stroke-width="0.1" stroke-dasharray="2 2" />
                            <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.05)" stroke-width="0.1" />

                            <!-- Area Fill -->
                             <path 
                                :d="revenueAreaPath" 
                                fill="url(#premiumGradient)" 
                                stroke="none" 
                                class="chart-area"
                            />

                            <!-- Line Stroke -->
                             <path 
                                :d="revenueLinePath" 
                                fill="none" 
                                stroke="#00e5ff" 
                                stroke-width="0.6" 
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                filter="url(#glow)"
                                class="chart-line"
                            />
                            
                            <!-- Points -->

                            <circle 
                                v-for="(point, i) in revenuePoints" 
                                :key="i" 
                                :cx="point.x" 
                                :cy="point.y" 
                                r="1.5" 
                                fill="#1a237e" 
                                stroke="#00e5ff"
                                stroke-width="0.6"
                                class="chart-point"
                                :class="{ 'pulse-point': i === revenuePoints.length - 1 }"
                            >
                                <title>฿{{ point.val }}</title>
                            </circle>
                        </svg>
                        
                        <!-- X-Axis Labels -->
                        <div class="d-flex justify-space-between mt-2 px-1">
                            <span v-for="(label, i) in dateLabels" :key="i" class="text-caption text-grey-lighten-2 chart-label" style="font-size: 0.7rem !important;">
                                {{ label }}
                            </span>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <!-- Category Distribution Donut Chart -->
            <v-col cols="12" md="5">
                <v-card class="glass-card pa-6 fill-height d-flex flex-column" elevation="10" border>
                     <div class="d-flex align-center justify-space-between mb-4">
                        <div>
                            <h3 class="text-h6 font-weight-black text-white mb-1">ยอดขายแยกตามหมวดหมู่</h3>
                            <div class="text-caption text-grey-lighten-1 font-weight-medium">แบ่งตามประเภทสินค้า</div>
                        </div>
                        <v-icon color="purple-accent-2" class="glow-icon">mdi-chart-donut</v-icon>
                    </div>

                    <div class="d-flex align-center justify-center flex-grow-1 position-relative py-4">
                         <div v-if="categoryData.length === 0" class="text-grey">ไม่มีข้อมูล</div>
                         <svg v-else viewBox="0 0 40 40" class="donut-chart">
                            <!-- Background Circle -->
                            <circle 
                                cx="20" cy="20" r="15.91549430918954" 
                                fill="transparent" 
                                stroke="rgba(255,255,255,0.03)" 
                                stroke-width="3"
                                class="donut-bg"
                            ></circle>
                            
                            <!-- Segments -->
                            <circle 
                                v-for="(slice, i) in categorySlices" 
                                :key="i"
                                cx="20" cy="20" r="15.91549430918954" 
                                fill="transparent" 
                                :stroke="slice.color" 
                                stroke-width="3"
                                :stroke-dasharray="`${slice.dash} ${slice.gap}`"
                                :stroke-dashoffset="slice.offset"
                                stroke-linecap="round"
                                class="donut-segment"
                            >
                                <title>{{ slice.name }}: {{ slice.count }}</title>
                            </circle>
                            
                            <!-- Center Text -->
                             <text x="20" y="20" class="donut-text" text-anchor="middle" dominant-baseline="central">
                                <tspan x="20" dy="-2" fill="white" font-size="5" font-weight="900">{{ orderCount }}</tspan>
                                <tspan x="20" dy="5" fill="#aaa" font-size="2" font-weight="500">คำสั่งซื้อ</tspan>
                             </text>
                        </svg>
                    </div>
                    
                    <!-- New Grid Legend -->
                    <div class="w-100 mt-2">
                        <v-row no-gutters>
                             <v-col cols="6" v-for="(cat, i) in categoryData" :key="i" class="pa-1">
                                 <div class="d-flex align-center pa-2 rounded hover-item" style="background: rgba(255,255,255,0.02);">
                                    <div class="rounded-circle mr-2" :style="{ width: '6px', height: '6px', background: cat.color, boxShadow: `0 0 6px ${cat.color}` }"></div>
                                    <div class="d-flex flex-column" style="line-height: 1;">
                                        <span class="text-caption text-white font-weight-bold" style="font-size: 0.7rem !important;">{{ cat.name }}</span>
                                        <span class="text-caption font-weight-medium mt-1" :style="{ color: cat.color, fontSize: '0.65rem !important' }">{{ cat.percent }}%</span>
                                    </div>
                                 </div>
                             </v-col>
                        </v-row>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-4">
            <!-- Recent Orders Column -->
            <v-col cols="12">
                <v-card class="glass-card fill-height pa-0 overflow-hidden d-flex flex-column" elevation="10" border>
                    <div class="pa-6 pb-4 border-b border-white-10 d-flex justify-space-between align-center">
                        <div class="d-flex align-center">
                             <div class="icon-box bg-blue-grey-darken-4 mr-3">
                                <v-icon color="blue-accent-2" size="small">mdi-clock-outline</v-icon>
                             </div>
                             <h3 class="text-h6 font-weight-bold text-white">กิจกรรมล่าสุด</h3>
                        </div>
                        <v-btn variant="text" color="blue-accent-1" size="small" class="font-weight-bold letter-spacing-1" to="/Admin/orders">ดูทั้งหมด</v-btn>
                    </div>
                    <v-list class="bg-transparent pa-0 flex-grow-1 overflow-y-auto custom-scrollbar" style="max-height: 400px;">
                        <div v-for="(order, i) in recentOrders" :key="i">
                            <v-list-item class="py-4 px-6 hover-item">
                                <template v-slot:prepend>
                                    <v-avatar color="indigo-darken-3" size="48" class="mr-4 elevation-4 border-1 border-white-10">
                                        <span class="text-white font-weight-bold text-h6">{{ order.user?.userFullname?.charAt(0) || 'U' }}</span>
                                    </v-avatar>
                                </template>
                                <v-list-item-title class="text-white font-weight-bold text-body-1 mb-1">
                                    {{ order.user?.userFullname || 'ไม่พบบัญชีผู้ใช้' }}
                                    <span v-if="order.user?.userName" class="text-grey-lighten-1 text-caption ml-2 font-weight-regular">
                                        (@{{ order.user.userName }})
                                    </span>
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-grey-lighten-1 text-caption d-flex align-center">
                                    <v-icon size="x-small" class="mr-1" color="grey">mdi-receipt-text-outline</v-icon>
                                    <span class="mr-2">คำสั่งซื้อ #{{ order.orderID }}</span>
                                    <v-icon size="x-small" class="mr-1" color="grey">mdi-package-variant</v-icon>
                                    <span>{{ order.OrderItems?.length || 0 }} รายการ</span>
                                </v-list-item-subtitle>
                                
                                <template v-slot:append>
                                    <div class="text-right">
                                        <div class="text-h6 font-weight-black text-green-accent-3 mb-1">฿{{ order.totalAmount?.toLocaleString() }}</div>
                                        <v-chip 
                                            :color="getStatusColor(order.status || 'Completed')" 
                                            size="x-small" 
                                            variant="tonal"
                                            class="font-weight-bold text-uppercase letter-spacing-1"
                                        >
                                            {{ order.status || 'Completed' }}
                                        </v-chip>
                                    </div>
                                </template>
                            </v-list-item>
                            <v-divider v-if="i < recentOrders.length - 1" color="rgba(255,255,255,0.05)"></v-divider>
                        </div>
                        <div v-if="recentOrders.length === 0" class="text-center pa-8 text-grey">
                            ไม่มีกิจกรรมล่าสุด
                        </div>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const router = useRouter()

definePageMeta({
    layout: 'admin-layout' 
})

function logout() {
    sessionStorage.clear()
    router.push('/')
}

function getStatusColor(status) {
    if(status === 'Completed') return 'success'
    if(status === 'Pending') return 'warning'
    return 'info'
}

const studentCount = ref(0)
const orderCount = ref(0)
const totalRevenue = ref(0)
const recentOrders = ref([])
const user = ref({})

// Chart Data
const revenueData = ref([])
const dateLabels = ref([])
const categoryData = ref([])

const loadUser = () => {
    try {
        const storedUser = sessionStorage.getItem('loginUser')
        if (storedUser) {
            user.value = JSON.parse(storedUser)
        }
    } catch (e) {
        console.error('Error loading user', e)
    }
}

const fetchStats = async () => {
    try {
        loadUser()
        const students = await $fetch('/api/user', { query: { status: 'Student' } })
        if(students && students.status) studentCount.value = students.data.length
        else if (Array.isArray(students)) studentCount.value = students.length

        const ordersResponse = await $fetch('/api/order')
        const productsResult = await $fetch('/api/product')
        
        const productMap = new Map()
        if (productsResult && productsResult.status) {
            productsResult.data.forEach(p => {
                productMap.set(p.productID, p.Category ? p.Category.name : 'Uncategorized')
            })
        }

        if(ordersResponse && ordersResponse.status) {
            const orderList = ordersResponse.data
            orderCount.value = orderList.length
            totalRevenue.value = orderList.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
            recentOrders.value = orderList.slice(0, 5)

            // Revenue Data
            const dailyRevenue = {}
            const labels = []
            for (let i = 6; i >= 0; i--) {
                const d = new Date()
                d.setDate(d.getDate() - i)
                const dateStr = d.toLocaleDateString('th-TH') 
                dailyRevenue[dateStr] = 0
                labels.push(d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }))
            }
            dateLabels.value = labels

            orderList.forEach(order => {
                const d = new Date(order.createdAt)
                const dateStr = d.toLocaleDateString('th-TH')
                if (dailyRevenue[dateStr] !== undefined) {
                    dailyRevenue[dateStr] += order.totalAmount
                }
            })
            revenueData.value = Object.values(dailyRevenue)

            // Category Data
            const catCounts = {}
            let totalItems = 0
            orderList.forEach(order => {
                if (order.OrderItems) {
                    order.OrderItems.forEach(item => {
                        const catName = productMap.get(item.productID) || 'Other'
                        catCounts[catName] = (catCounts[catName] || 0) + item.quantity
                        totalItems += item.quantity
                    })
                }
            })

            const catColors = ['#00e5ff', '#d500f9', '#ffca28', '#ff1744', '#00e676']
            let colorIdx = 0
            categoryData.value = Object.keys(catCounts).map(name => {
                const count = catCounts[name]
                return {
                    name,
                    count,
                    percent: Math.round((count / totalItems) * 100),
                    color: catColors[colorIdx++ % catColors.length]
                }
            }).sort((a,b) => b.count - a.count)
        }
        
    } catch (e) {
        console.error(e)
    }
}

// Chart Computeds
const revenuePoints = computed(() => {
    if (revenueData.value.length === 0) return []
    const maxVal = Math.max(...revenueData.value, 100) 
    const w = 100
    const h = 40
    const stepX = w / (revenueData.value.length - 1)
    
    return revenueData.value.map((val, i) => ({
        x: i * stepX,
        y: h - (val / maxVal) * h * 0.8 - 5, 
        val
    }))
})

// Helper for smooth path
function getSmoothPath(points, close = false) {
    if (points.length === 0) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
        const cp1x = points[i-1].x + (points[i].x - points[i-1].x) / 2
        const cp1y = points[i-1].y
        const cp2x = points[i-1].x + (points[i].x - points[i-1].x) / 2
        const cp2y = points[i].y
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`
    }
    return d
}

const revenueLinePath = computed(() => {
    return getSmoothPath(revenuePoints.value)
})

const revenueAreaPath = computed(() => {
    const points = revenuePoints.value
    if (points.length === 0) return ''
    const lineD = getSmoothPath(points)
    const last = points[points.length - 1]
    const first = points[0]
    return lineD + ` L ${last.x} 40 L ${first.x} 40 Z`
})

const categorySlices = computed(() => {
    let offset = 25 
    const gap = 2 // Gap size in percent
    
    return categoryData.value.map(cat => {
        // Adjust percent for gap
        const drawPercent = Math.max(0, cat.percent - gap)
        
        const slice = {
            ...cat,
            dash: drawPercent,
            gap: 100 - drawPercent,
            offset: -1 * offset 
        }
        offset += cat.percent
        return slice
    })
})

onMounted(() => {
    fetchStats()
})
</script>

<style scoped>
.admin-dashboard {
    background: radial-gradient(circle at top right, #1a237e 0%, #000000 60%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
}

/* Glassmorphism */
.glass-card {
    background: rgba(20, 25, 40, 0.6) !important;
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08); /* More subtle border */
    border-top: 1px solid rgba(255, 255, 255, 0.15); /* Highlight top */
    border-radius: 24px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.glass-btn {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}
.glass-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Stat Cards */
.stat-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.stat-card:hover {
    transform: translateY(-5px);
    background: rgba(30, 35, 60, 0.7) !important;
    box-shadow: 0 15px 40px rgba(0,0,0,0.4);
    border-color: rgba(255, 255, 255, 0.2);
}

.stat-icon-bg {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

/* Charts */
.chart-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
}

.chart-area {
    opacity: 0.8;
    animation: fadeIn 1.5s ease-out;
}

.chart-line {
    animation: drawLine 2s ease-out forwards;
    filter: drop-shadow(0 0 5px rgba(0, 229, 255, 0.5));
}

.chart-point {
    transition: r 0.3s ease, stroke-width 0.3s ease;
    cursor: pointer;
}
.chart-point:hover {
    r: 4;
    stroke-width: 2;
    fill: #00e5ff;
}

.glow-icon {
    filter: drop-shadow(0 0 8px currentColor);
}


.donut-chart {
    width: 200px; /* Base size */
    height: 200px;
    /* transform: rotate(-90deg); Removed to prevent text rotation */
}

.donut-segment, .donut-bg {
    transform: rotate(-90deg);
    transform-origin: center;
}

.donut-segment {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}
.donut-segment:hover {
    stroke-width: 6; 
    filter: drop-shadow(0 0 8px currentColor);
    opacity: 1 !important;
}

@keyframes drawLine {
    from { stroke-dasharray: 0 1000; } 
    to { stroke-dasharray: 1000 0; }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 0.8; transform: translateY(0); }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7);
        stroke-width: 0.6;
        r: 1.5;
    }
    70% {
        box-shadow: 0 0 0 10px rgba(0, 229, 255, 0);
        stroke-width: 2;
        r: 2.5;
    }
    100% {
        box-shadow: 0 0 0 0 rgba(0, 229, 255, 0);
        stroke-width: 0.6;
        r: 1.5;
    }
}

.pulse-point {
    animation: pulse 2s infinite;
    transform-box: fill-box;
    transform-origin: center;
}

/* List Items */
.hover-item {
    transition: background 0.2s ease;
    border-radius: 12px;
}
.hover-item:hover {
    background: rgba(255,255,255,0.05);
}

.icon-box {
    width: 32px;
    height: 32px; 
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.2);
}

@media (max-width: 960px) {
    .stat-card {
        margin-bottom: 16px;
    }
    .admin-dashboard {
        padding: 16px !important;
    }
}

/* Enhanced Styles */
.bg-gradient-1 {
    background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
    box-shadow: 0 8px 16px rgba(33, 203, 243, 0.3);
}
.bg-gradient-2 {
    background: linear-gradient(135deg, #FF4081 0%, #F50057 100%);
    box-shadow: 0 8px 16px rgba(245, 0, 87, 0.3);
}
.bg-gradient-3 {
    background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
    box-shadow: 0 8px 16px rgba(255, 152, 0, 0.3);
}

.text-shadow-glow {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}
.text-shadow-sm {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.border-2 {
    border-width: 2px !important;
}
.border-white {
    border-color: rgba(255, 255, 255, 0.8) !important;
}
.border-white-10 {
    border-color: rgba(255, 255, 255, 0.1) !important;
}
.gap-4 {
    gap: 16px;
}
.gap-2 {
    gap: 8px;
}
.letter-spacing-1 {
    letter-spacing: 1px;
}
</style>