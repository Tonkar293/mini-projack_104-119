<template>
  <v-main class="fill-height position-relative overflow-hidden" id="home-container" :class="themeClass">
    <!-- Animated Background -->
    <div class="animated-background"></div>
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <!-- Navigation Bar -->
    <v-app-bar :elevation="0" color="transparent" class="px-4 mt-2" absolute>
        <v-container class="d-flex align-center py-2 fill-height">
            <!-- Logo area -->
            <div class="d-flex align-center mr-8 logo-container" @click="visualEffect">
                <div class="rounded-circle d-flex align-center justify-center mr-3 glass-icon elevation-4">
                    <v-img src="/images/logo_tech.png" width="50" height="50" cover class="logo-spin"></v-img>
                </div>
                <div class="logo-text">
                    <div class="text-h5 font-weight-black text-white" style="line-height: 1; letter-spacing: 1px;">
                        STATIONERY
                    </div>
                    <div class="text-subtitle-2 font-weight-bold text-cyan-accent-2" style="letter-spacing: 2px;">
                        STORE
                    </div>
                </div>
            </div>

            <v-spacer></v-spacer>

            <!-- Search Bar (Glass) -->
            <div class="search-wrapper mx-4 flex-grow-1 hidden-sm-and-down" style="max-width: 500px;">
                <v-menu v-model="searchMenu" :close-on-content-click="false" location="bottom center" offset="10">
                    <template v-slot:activator="{ props }">
                        <v-text-field
                            v-bind="props"
                            v-model="searchQuery"
                            placeholder="Search for items..."
                            variant="solo"
                            density="comfortable"
                            hide-details
                            rounded="xl"
                            class="glass-search"
                            prepend-inner-icon="mdi-magnify"
                            @focus="searchQuery && searchQuery.length > 1 ? searchMenu = true : null"
                        ></v-text-field>
                    </template>
                    <v-list v-if="searchResults.length > 0" class="glass-card rounded-xl pa-0 overflow-hidden" elevation="10" bg-color="transparent">
                        <v-list-item
                            v-for="item in searchResults"
                            :key="item.id"
                            @click="openDetails(item); searchMenu = false"
                            class="px-4 py-3 search-item"
                            link
                            active-color="cyan-accent-3"
                        >
                            <template v-slot:prepend>
                                <v-avatar rounded="lg" size="40" class="mr-3 bg-white">
                                    <v-img :src="item.image" cover></v-img>
                                </v-avatar>
                            </template>
                            <v-list-item-title class="font-weight-bold" style="color: var(--text-primary);">{{ item.name }}</v-list-item-title>
                            <v-list-item-subtitle class="text-cyan-accent-2 font-weight-bold">฿{{ item.price }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                     <v-list v-else-if="searchQuery && searchQuery.length > 1" class="glass-card rounded-xl pa-4 text-center" elevation="10" bg-color="transparent" style="color: var(--text-secondary);">
                        <div class="text-caption font-weight-bold">No results found</div>
                    </v-list>
                </v-menu>
            </div>

            <!-- Actions -->
            <v-btn icon class="glass-btn mx-1" @click="toggleTheme">
                <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-white-balance-sunny' }}</v-icon>
            </v-btn>

            <v-btn icon class="glass-btn mx-1" @click="cartDrawer = !cartDrawer">
                <v-badge :content="cart.length.toString()" color="cyan-accent-3" v-if="cart.length > 0" class="cart-badge">
                    <v-icon>mdi-cart-outline</v-icon>
                </v-badge>
                <v-icon v-else>mdi-cart-outline</v-icon>
            </v-btn>

            <!-- User Profile & Logout -->
            <div class="d-flex align-center ml-4 glass-profile px-3 py-1 rounded-pill" v-if="userData">
                <div class="d-flex align-center cursor-pointer" @click="router.push('/profile')">
                    <v-avatar size="32" class="mr-2 border-sm">
                        <v-img src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Sunglasses&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light" alt="User"></v-img>
                    </v-avatar>
                    <div class="text-subtitle-2 font-weight-bold mr-3 hidden-xs">
                        {{ userData.userFullname || userData.userName || 'User' }}
                    </div>
                </div>
                <v-divider vertical class="mx-2" thickness="2" style="height: 20px; opacity: 0.3;"></v-divider>
                <v-btn icon size="x-small" density="comfortable" variant="text" color="red-accent-2" @click="logout" title="Logout">
                    <v-icon>mdi-power</v-icon>
                </v-btn>
            </div>
            <div v-else class="ml-4">
                <v-btn rounded="xl" color="cyan-accent-3" class="font-weight-bold text-white glass-btn" to="/">
                    Login
                </v-btn>
            </div>
        </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-container class="pt-16 mt-16 pb-16 position-relative z-index-1">
        <!-- Hero Section -->
        <v-row class="align-center mb-16 hero-row justify-center">
            <v-col cols="12" md="11" lg="10">
                <transition name="slide-up" appear>
                    <div class="glass-hero-card rounded-xl d-flex flex-column flex-md-row align-center overflow-hidden position-relative" style="min-height: 400px;">
                        
                        <!-- Text Content -->
                        <div class="pa-8 pa-md-12 text-white position-relative z-index-2 flex-grow-1 hero-text-content">
                            <v-chip color="cyan-accent-2" class="mb-4 font-weight-bold px-4" label variant="flat">
                                🚀 โปรโมชั่นต้อนรับเปิดเทอม
                            </v-chip>
                            <h1 class="text-h3 text-md-h2 font-weight-black mb-4 hero-title text-shadow-glow" style="line-height: 1.2;">
                                ยกระดับ <br>
                                <span class="text-transparent bg-clip-text bg-gradient-premium">การเรียนรู้ของคุณ</span>
                            </h1>
                            <p class="text-body-1 text-md-h6 font-weight-light text-grey-lighten-1 mb-8 hero-subtitle" style="max-width: 500px; line-height: 1.6;">
                                อุปกรณ์เครื่องเขียนและหนังสือเรียนคุณภาพสูง คัดสรรมาเพื่อนักศึกษาวิทยาลัยเทคนิคโดยเฉพาะ สัมผัสประสบการณ์การเรียนรู้แห่งอนาคต
                            </p>
                            <div class="d-flex gap-4">
                                <v-btn 
                                    color="white" 
                                    size="x-large" 
                                    rounded="xl" 
                                    class="text-primary font-weight-bold px-8 btn-pulse"
                                    elevation="10"
                                    @click="scrollToProducts"
                                >
                                    ช้อปเลย
                                </v-btn>
                                <v-btn 
                                    variant="outlined" 
                                    color="white" 
                                    size="x-large" 
                                    rounded="xl" 
                                    class="px-8 glass-btn-outline"
                                >
                                    ดูสินค้า
                                </v-btn>
                            </div>
                        </div>

                        <!-- Hero Image Inside Card -->
                        <div class="hero-image-container position-absolute d-none d-md-block" style="right: 0; top: 0; height: 100%; width: 60%;">
                             <v-img
                                src="/images/home-hero-v2.png"
                                height="100%"
                                width="100%"
                                cover
                                class="hero-inner-image"
                            ></v-img>
                        </div>

                        <!-- Mobile Image (Optional or different positioning) -->
                         <div class="d-md-none w-100 pa-4">
                            <v-img
                                src="/images/home-hero-v2.png"
                                max-height="300"
                                width="100%"
                                cover
                            ></v-img>
                        </div>

                    </div>
                </transition>
            </v-col>
        </v-row>

        <!-- Product Section -->
        <div id="products-section" class="d-flex justify-center mb-10">
            <div class="tabs-container glass-tabs rounded-xl pa-2">
                <v-tabs
                    v-model="activeTab"
                    align-tabs="center"
                    hide-slider
                    height="60"
                    class="bg-transparent"
                >
                    <v-tab
                        value="all"
                        class="rounded-xl px-6 text-body-1 font-weight-bold tab-item"
                        selected-class="tab-active"
                        prepend-icon="mdi-apps"
                    >
                        All Items
                    </v-tab>
                    <v-tab
                        value="equipment"
                        class="rounded-xl px-6 text-body-1 font-weight-bold tab-item"
                        selected-class="tab-active"
                        prepend-icon="mdi-pencil-ruler"
                    >
                        Equipment
                    </v-tab>
                    <v-tab
                        value="textbook"
                        class="rounded-xl px-6 text-body-1 font-weight-bold tab-item"
                        selected-class="tab-active"
                        prepend-icon="mdi-book-open-variant"
                    >
                        Books
                    </v-tab>
                </v-tabs>
            </div>
        </div>

        <v-row>
            <transition-group 
                name="staggered-fade" 
                tag="div" 
                class="v-row w-100 ma-0 position-relative"
                @before-leave="beforeLeave"
            >
                <v-col
                    v-for="(product, index) in filteredProducts"
                    :key="product.id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    class="product-col"
                    :style="{ '--delay': `${index * 0.05}s` }"
                >
                    <v-hover v-slot="{ isHovering, props }">
                        <v-card
                            v-bind="props"
                            color="transparent"
                            class="product-card glass-card rounded-xl fill-height"
                            elevation="0"
                            :class="{ 'on-hover': isHovering }"
                        >
                            <div class="product-image-container pa-4 position-relative">
                                <!-- Flash Sale Badge Breaking Frame -->
                                <div class="flash-sale-badge">
                                    <v-icon icon="mdi-fire" class="flame-anim mb-1" size="small"></v-icon>
                                    <span>ลดด่วน!</span>
                                </div>

                                <v-img
                                    :src="product.image"
                                    height="200"
                                    contain
                                    class="product-image transition-swing"
                                    :style="isHovering ? 'transform: scale(1.1) translateY(-10px);' : ''"
                                ></v-img>
                                <v-btn 
                                    icon="mdi-eye" 
                                    variant="text" 
                                    color="cyan-accent-2" 
                                    class="details-btn"
                                    :class="{ 'visible': isHovering }"
                                    @click.stop="openDetails(product)"
                                ></v-btn>
                                <v-btn 
                                    icon="mdi-heart" 
                                    variant="text" 
                                    color="pink-accent-2" 
                                    class="wishlist-btn"
                                    :class="{ 'visible': isHovering }"
                                ></v-btn>
                            </div>

                            <v-card-item class="pt-0">
                                <div class="text-overline font-weight-bold text-cyan-accent-2 mb-1">
                                    {{ formatType(product.type) }}
                                </div>
                                <div class="text-h6 font-weight-bold text-white text-truncate mb-1">
                                    {{ product.name }}
                                </div>
                                <div class="d-flex align-center justify-space-between mt-4">
                                    <div class="d-flex flex-column">
                                        <div class="d-flex align-center mb-1">
                                            <span class="text-caption text-grey-lighten-1 text-decoration-line-through">฿{{ product.originalPrice?.toLocaleString() }}</span>
                                        </div>
                                        <div class="text-h5 font-weight-black text-cyan-accent-2 price-glow">
                                            ฿{{ product.price?.toLocaleString() }}
                                        </div>
                                    </div>
                                    <v-btn
                                        icon
                                        color="cyan-accent-3"
                                        class="add-btn"
                                        elevation="4"
                                        @click="addToCart(product)"
                                    >
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </div>
                            </v-card-item>
                        </v-card>
                    </v-hover>
                </v-col>
            </transition-group>
        </v-row>
    </v-container>

    <!-- Cart Backdrop -->
    <transition name="fade">
        <div 
            v-if="cartDrawer" 
            class="position-fixed w-100 h-100 top-0 left-0" 
            style="background: rgba(0,0,0,0.6); z-index: 1000; backdrop-filter: blur(2px);"
            @click="cartDrawer = false"
        ></div>
    </transition>

    <!-- Custom Dynamic Height Cart Panel -->
    <transition name="slide-right">
        <div 
            v-if="cartDrawer" 
            class="cart-panel-container"
        >
            <v-card
                class="glass-drawer rounded-xl d-flex flex-column"
                elevation="10"
                width="600"
                max-height="85vh"
            >
                <div class="pa-4 flex-grow-0">
                    <div class="text-h5 font-weight-bold mb-2 d-flex align-center text-white">
                        <v-icon start color="cyan-accent-2">mdi-shopping</v-icon>
                        Your Cart
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-close" variant="text" @click="cartDrawer = false"></v-btn>
                    </div>
                    <v-divider class="border-opacity-25 mb-2"></v-divider>
                </div>

                <div v-if="cart.length === 0" class="d-flex flex-column align-center justify-center pa-8 text-white opacity-50">
                    <v-icon size="80" class="mb-4">mdi-cart-off</v-icon>
                    <div class="text-h6">Your cart is empty</div>
                </div>

                <div v-else class="flex-grow-1 overflow-y-auto px-4 pb-2 text-white custom-scrollbar" style="min-height: 100px;">
                    <v-card
                        v-for="(item, index) in cart"
                        :key="index"
                        class="mb-3 glass-card-light rounded-lg pa-2 d-flex align-center"
                        elevation="0"
                    >
                        <v-avatar rounded="lg" size="64" class="bg-white mr-3">
                            <v-img :src="item.image" cover></v-img>
                        </v-avatar>
                        <div class="flex-grow-1">
                            <div class="text-subtitle-2 font-weight-bold text-truncate">{{ item.name }}</div>
                            <div class="text-caption text-cyan-accent-2 font-weight-bold">฿{{ item.price }}</div>
                        </div>
                        <div class="d-flex align-center ml-4">
                             <v-btn icon="mdi-minus" size="x-small" variant="tonal" color="white" class="mr-2" @click="updateQuantity(index, -1)"></v-btn>
                             <span class="text-subtitle-1 font-weight-bold px-2">{{ item.quantity }}</span>
                             <v-btn icon="mdi-plus" size="x-small" variant="tonal" color="white" class="ml-2" @click="updateQuantity(index, 1)"></v-btn>
                        </div>
                        <v-btn icon="mdi-delete" size="small" variant="text" color="red-accent-2" class="ml-1" @click="removeFromCart(index)"></v-btn>
                    </v-card>
                </div>

                <div class="pa-4 pt-2 flex-grow-0 text-white">
                    <div class="border-t border-opacity-25 pt-4">
                        <div class="d-flex justify-space-between mb-4">
                            <span class="text-h6 font-weight-bold">Total</span>
                            <span class="text-h5 font-weight-black text-cyan-accent-2">฿{{ cartTotal }}</span>
                        </div>
                        <v-btn
                            block
                            height="56"
                            rounded="xl"
                            color="cyan-accent-3"
                            class="font-weight-bold text-white glow-btn"
                            @click="checkout"
                            :disabled="cart.length === 0"
                        >
                            Checkout
                            <v-icon end>mdi-arrow-right</v-icon>
                        </v-btn>
                    </div>
                </div>
            </v-card>
        </div>
    </transition>

    <!-- Product Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800" scrim="black" style="--v-overlay-scrim-opacity: 0.85;">
        <v-card v-if="selectedProduct" class="glass-card pa-0 rounded-xl overflow-hidden">
            <v-row class="ma-0">
                <v-col cols="12" md="6" class="pa-0 bg-dark-glass d-flex align-center justify-center">
                     <v-img
                        :src="selectedProduct.image"
                        height="100%"
                        max-height="400"
                        contain
                        class="product-detail-image"
                    ></v-img>
                </v-col>
                <v-col cols="12" md="6" class="pa-6 text-white d-flex flex-column">
                    <div class="d-flex justify-space-between align-start mb-4">
                        <div>
                             <v-chip color="cyan-accent-2" size="small" class="mb-2 font-weight-bold" label>
                                {{ formatType(selectedProduct.type) }}
                            </v-chip>
                            <h2 class="text-h4 font-weight-bold text-white mb-1">{{ selectedProduct.name }}</h2>
                        </div>
                        <v-btn icon="mdi-close" variant="text" @click="detailsDialog = false"></v-btn>
                    </div>
                    
                    <div class="d-flex align-center mb-6">
                        <v-chip color="red-accent-2" size="default" label class="font-weight-black px-4 mr-3 animate-pulse custom-chip-large">
                            <v-icon start icon="mdi-fire" class="flame-anim"></v-icon>
                            ลดด่วน!
                        </v-chip>
                        <span class="text-h6 text-grey-lighten-1 text-decoration-line-through mr-3">฿{{ selectedProduct.originalPrice?.toLocaleString() }}</span>
                        <div class="text-h4 font-weight-black text-cyan-accent-2 price-glow">
                            ฿{{ selectedProduct.price?.toLocaleString() }}
                        </div>
                    </div>
                    
                    <div class="d-flex gap-4 mb-6">
                         <v-btn
                            block
                            height="50"
                            rounded="xl"
                            color="cyan-accent-3"
                            class="font-weight-bold text-white glow-btn"
                            @click="addToCart(selectedProduct); detailsDialog = false"
                        >
                            Add to Cart
                            <v-icon end>mdi-cart-plus</v-icon>
                        </v-btn>
                    </div>

                    <div class="flex-grow-1 overflow-y-auto pr-2" style="max-height: 200px;">
                        <p class="text-body-1 text-grey-lighten-3" style="line-height: 1.8;">
                            {{ selectedProduct.details }}
                        </p>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>

    <!-- Payment Success Dialog (Mock) -->
    <v-dialog v-model="successDialog" max-width="400">
        <v-card class="glass-card text-center pa-8 rounded-xl">
             <div class="success-anim mb-6">
                <v-icon size="80" color="green-accent-3">mdi-check-circle</v-icon>
             </div>
             <h3 class="text-h4 font-weight-bold text-white mb-2">Success!</h3>
             <p class="text-grey-lighten-3 mb-6">Your order has been placed successfully.</p>
             <v-btn color="white" block rounded="xl" class="text-primary font-weight-bold" @click="successDialog = false">
                Continue Shopping
             </v-btn>
        </v-card>
    </v-dialog>

  </v-main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import Swal from 'sweetalert2'

const theme = useTheme()
const router = useRouter()
const searchQuery = ref('')
const searchMenu = ref(false)
const activeTab = ref('all')

watch(searchQuery, (val) => {
    if (val && val.length > 1) {
        searchMenu.value = true
    }
})
const cartDrawer = ref(false)
const detailsDialog = ref(false)
const successDialog = ref(false)
const selectedProduct = ref(null)
const cart = ref([])
// userData state
const userData = ref(null)

// useAsyncData for SSR-friendly fetching
const { data: products } = await useAsyncData('products', async () => {
    try {
        const response = await $fetch('/api/product')
        if (response && response.status) {
            return response.data.map(p => ({
                id: p.productID,
                name: p.name,
                price: p.price,
                type: p.type,
                details: p.details || 'No description available.',
                image: p.image || '/images/no-image.png',
                quantity: p.quantity,
                // Calculate original price here so it's consistent between server/client via hydration
                originalPrice: Math.round(p.price * (1 + (Math.random() * 0.3 + 0.1))) 
            }))
        }
        return []
    } catch (e) {
        console.error('Failed to fetch products', e)
        return []
    }
}, {
    default: () => [] // Default value while fetching
})

function logout() {
    sessionStorage.removeItem('loginUser')
    userData.value = null
    router.push('/')
}

function visualEffect(event) {
    // keeping empty as per original
}

function openDetails(product) {
    selectedProduct.value = product
    detailsDialog.value = true
}

function formatType(type) {
    if (!type) return ''
    return type.toLowerCase() === 'textbook' ? 'Book' : type.charAt(0).toUpperCase() + type.slice(1)
}

const filteredProducts = computed(() => {
    let result = products.value || [] // Ensure it's an array
    if (activeTab.value !== 'all') {
        result = result.filter(p => p.type && p.type.toLowerCase() === activeTab.value.toLowerCase())
    }
    if (searchQuery.value) {
        result = result.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    }
    return result
})

const searchResults = computed(() => {
    if (!searchQuery.value || searchQuery.value.length < 2) return []
    const query = searchQuery.value.toLowerCase()
    return products.value.filter(p => 
        p.name.toLowerCase().includes(query)
    ).slice(0, 5)
})

const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

function addToCart(product) {
    const index = cart.value.findIndex(item => item.id === product.id)
    if (index !== -1) {
        cart.value[index].quantity++
    } else {
        cart.value.push({ ...product, quantity: 1 })
    }
    
    Swal.fire({
        icon: 'success',
        title: 'Added to Cart',
        text: product.name,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        background: 'rgba(255, 255, 255, 0.9)',
        iconColor: '#00e5ff'
    })

    cartDrawer.value = true
}

function removeFromCart(index) {
    cart.value.splice(index, 1)
}

function updateQuantity(index, delta) {
    const newQty = cart.value[index].quantity + delta
    if (newQty > 0) {
        cart.value[index].quantity = newQty
    } else {
        removeFromCart(index)
    }
}

async function checkout() {
    let userID = null;
    const storedUser = sessionStorage.getItem('loginUser')
    if(storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser)
            if (parsedUser && parsedUser.userID) {
                userID = parsedUser.userID
            }
        } catch (e) {
            console.error('Error parsing stored user:', e)
        }
    }
    
    console.log('Checkout with UserID:', userID)

    if (!userID) {
        Swal.fire({
            icon: 'warning',
            title: 'Authentication Required',
            text: 'Please login again to continue.',
            confirmButtonText: 'Login',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                logout()
            }
        })
        return
    }

    try {
        const { data: response, error } = await useFetch('/api/order', {
            method: 'POST',
            body: {
                userID: userID,
                cartItems: cart.value.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        })

        if (error.value) {
            throw new Error(error.value.message || 'Network/Server Error')
        }

        if(response.value && response.value.status) {
            cartDrawer.value = false
            successDialog.value = true
            cart.value = []
        } else {
             throw new Error(response.value?.message || 'Order failed')
        }

    } catch(e) {
        Swal.fire('Error', e.message || 'Failed to place order', 'error')
    }
}

onMounted(() => {
    // Only client-side logic remains here
    const storedUser = sessionStorage.getItem('loginUser')
    if(storedUser) {
        userData.value = JSON.parse(storedUser)
    }

    // Load Cart from Session
    const storedCart = sessionStorage.getItem('shoppingCart')
    if (storedCart) {
        try {
            cart.value = JSON.parse(storedCart)
        } catch (e) {
            console.error('Failed to parse cart', e)
        }
    }

    // Always enforce Dark Theme
    theme.global.name.value = 'dark'
    localStorage.setItem('theme', 'dark')
})

// Persist Cart
watch(cart, (newCart) => {
    if (process.client) {
        sessionStorage.setItem('shoppingCart', JSON.stringify(newCart))
    }
}, { deep: true })

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const themeClass = computed(() => theme.global.current.value.dark ? 'theme-dark' : 'theme-light')

function scrollToProducts() {
    const element = document.getElementById('products-section')
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}

// FLIP Animation Hook
function beforeLeave(el) {
    const { marginLeft, marginTop, width, height } = window.getComputedStyle(el)
    el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`
    el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`
    el.style.width = width
    el.style.height = height
}

definePageMeta({
    layout: 'empty'
})
</script>

<style scoped>
/* Theme Variables */
.theme-dark {
    --bg-gradient: linear-gradient(rgba(15, 12, 41, 0.7), rgba(48, 43, 99, 0.65)), url('/images/home-hero.png');
    --glass-bg: rgba(20, 20, 35, 0.6);
    --glass-border: rgba(255, 255, 255, 0.1);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --card-bg: rgba(30, 30, 50, 0.7);
    --accent-glow: rgba(0, 242, 255, 0.5);
    --shadow-color: rgba(0, 0, 0, 0.5);
    --input-bg: rgba(255, 255, 255, 0.1);
    --text-accent: #18ffff; /* Cyan accent 2 */
    --premium-gradient: linear-gradient(to right, #00f2ff, #00c6ff);
}

.theme-light {
    --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    --glass-bg: rgba(255, 255, 255, 0.65);
    --glass-border: rgba(255, 255, 255, 0.4);
    --text-primary: #2c3e50;
    --text-secondary: #546e7a;
    --card-bg: rgba(255, 255, 255, 0.8);
    --accent-glow: rgba(0, 198, 255, 0.6);
    --shadow-color: rgba(100, 100, 111, 0.2);
    --input-bg: rgba(255, 255, 255, 0.8);
    --text-accent: #0097a7; /* Darker cyan for light mode */
    --premium-gradient: linear-gradient(to right, #0097a7, #006064);
}

/* Base Styles using Variables */
#home-container {
    color: var(--text-primary);
    transition: color 0.5s ease;
}

/* Animated Background */
/* Background Image with Overlay */
.animated-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--bg-gradient) !important;
    background-size: cover !important;
    transition: background 0.8s ease;
    z-index: 0;
}

/* 
@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
} 
*/

/* Floating Shapes */
.floating-shapes .shape {
    position: absolute;
    filter: blur(50px);
    z-index: 0;
    opacity: 0.6;
    animation: float 20s infinite;
    mix-blend-mode: screen; 
}

.theme-light .floating-shapes .shape {
    mix-blend-mode: multiply;
    opacity: 0.4;
}

.shape-1 {
    width: 300px;
    height: 300px;
    background: #00f2ff;
    top: -50px;
    left: -50px;
    border-radius: 50%;
}

.shape-2 {
    width: 400px;
    height: 400px;
    background: #ff00cc;
    bottom: -100px;
    right: -100px;
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    animation-delay: -5s;
}

.shape-3 {
    width: 200px;
    height: 200px;
    background: #7000ff;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    animation-delay: -10s;
}

@keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -50px) rotate(10deg); }
    66% { transform: translate(-20px, 20px) rotate(-5deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
}

/* Glassmorphism Classes */
.glass-icon {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
}

.glass-search :deep(.v-field) {
    background: var(--input-bg) !important;
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    color: var(--text-primary) !important;
}

.glass-search :deep(input::placeholder) {
    color: var(--text-secondary) !important;
    opacity: 1;
}

.glass-search :deep(.v-icon) {
    color: var(--text-secondary) !important;
}

.glass-btn {
    background: var(--glass-bg);
    backdrop-filter: blur(5px);
    border: 1px solid var(--glass-border);
    color: var(--text-primary) !important;
}

.glass-profile {
    background: var(--glass-bg);
    backdrop-filter: blur(8px);
    border: 1px solid var(--glass-border);
    transition: all 0.3s ease;
}

.glass-profile:hover {
    background: var(--glass-border);
    transform: translateY(-1px);
}

.cursor-pointer {
    cursor: pointer;
}

.border-sm {
    border: 2px solid var(--glass-border);
}

.glass-card {
    background: var(--glass-bg) !important;
    backdrop-filter: blur(16px);
    box-shadow: 0 4px 30px var(--shadow-color);
    border: 1px solid var(--glass-border);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    color: var(--text-primary) !important;
}

.on-hover {
    transform: translateY(-10px) scale(1.02);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
}

.bg-gradient-premium {
    background: var(--premium-gradient);
    -webkit-background-clip: text;
    background-clip: text;
}

.text-transparent {
    color: transparent;
}

/* Hero Section */
.hero-3d-image {
    filter: drop-shadow(0 0 20px rgba(0, 242, 255, 0.5));
    animation: floatHero 6s ease-in-out infinite;
}

@keyframes floatHero {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

/* Product Card */
.wishlist-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.details-btn {
    position: absolute;
    top: 10px;
    right: 50px; /* Positioned next to wishlist */
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease 0.1s; /* Slight delay */
}

.wishlist-btn.visible, .details-btn.visible {
    opacity: 1;
    transform: translateY(0);
}

.bg-dark-glass {
    background: rgba(0, 0, 0, 0.3);
}

.add-btn {
    transition: transform 0.2s ease;
}

.add-btn:active {
    transform: scale(0.9);
}

/* Drawer */
.glass-drawer {
    background: var(--glass-bg) !important;
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    color: var(--text-primary);
}

.glass-card-light {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    color: var(--text-primary);
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: opacity 0.8s ease, transform 0.8s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

/* Premium Spring & Blur Transition */
.staggered-fade-move,
.staggered-fade-enter-active,
.staggered-fade-leave-active {
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* Spring-like overshoot */
}

.staggered-fade-enter-active {
    transition-delay: var(--delay);
}

.staggered-fade-leave-active {
    position: absolute;
    z-index: -1;
    transition: all 0.4s ease-in; /* Faster, smoother exit */
}

.staggered-fade-enter-from {
    opacity: 0;
    transform: scale(0.8) translateY(40px);
    filter: blur(10px);
}

.staggered-fade-leave-to {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
    filter: blur(15px); /* Ghosting effect */
}

/* Custom Cart Panel */
.cart-panel-container {
    position: fixed;
    top: 80px; /* Below navbar roughly, or adjust */
    right: 20px;
    z-index: 2000;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 242, 255, 0.3);
    border-radius: 4px;
}

/* Slide Right Transition for Panel */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-right-enter-from,
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(50px) scale(0.95);
}

/* Fade Transition for Backdrop */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Tabs */
.glass-tabs {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    display: inline-block; /* Make container fit content */
}

.tab-item {
    color: var(--text-secondary) !important;
    transition: all 0.4s ease;
    letter-spacing: 1px;
    text-transform: none !important; 
    margin: 0 4px;
}

.tab-item:hover {
    color: var(--text-primary) !important;
    background: var(--glass-border);
}

.tab-active {
    background: linear-gradient(135deg, #00f2ff 0%, #00c6ff 100%) !important;
    color: #0f0c29 !important; /* Dark text for contrast */
    box-shadow: 0 0 20px rgba(0, 242, 255, 0.5);
    transform: translateY(-2px);
}

.tab-active :deep(.v-icon) {
    color: #0f0c29 !important;
}

/* Glow Button */
.glow-btn {
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
    transition: all 0.3s ease;
}

.glow-btn:hover {
    box-shadow: 0 0 25px rgba(0, 229, 255, 0.8);
    transform: translateY(-2px);
}

.glass-hero-card {
    background: var(--card-bg) !important;
    backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    box-shadow: 0 8px 32px 0 var(--shadow-color);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    color: var(--text-primary);
}

.glass-hero-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
    );
    transition: 0.5s;
    animation: shimmer 3s infinite;
}

.glass-hero-card:hover {
    transform: translateY(-5px) scale(1.01);
    background: rgba(20, 20, 35, 0.35);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 15px 40px rgba(0, 242, 255, 0.15); /* Glow shadow */
}

@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

.text-shadow-glow {
    text-shadow: 0 0 20px rgba(0, 242, 255, 0.4);
}

.btn-pulse {
    animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 242, 255, 0.7);
    }
    70% {
        box-shadow: 0 0 0 15px rgba(0, 242, 255, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(0, 242, 255, 0);
    }
}

/* Responsiveness */
@media (max-width: 600px) {
    .hero-title {
        font-size: 2.5rem !important;
        line-height: 1.2 !important;
    }
    .hero-subtitle {
        font-size: 1rem !important;
    }
    .hero-row {
        text-align: center;
    }
    .logo-container {
        margin-right: 0 !important;
    }
    .logo-text {
        display: none;
    }
}

.z-index-2 {
    z-index: 2;
}

.hero-inner-image {
    /* filter: drop-shadow(-20px 0 30px rgba(0, 0, 0, 0.5)); */
    transition: transform 0.5s ease;
    mix-blend-mode: screen;
}

.glass-hero-card:hover .hero-inner-image {
    transform: scale(1.05);
}

.price-glow {
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
}

.animate-pulse {
    animation: Pulsered 1.5s infinite;
}

@keyframes Pulsered {
    0% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
    70% { box-shadow: 0 0 0 6px rgba(255, 82, 82, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
}

.flame-anim {
    animation: flame-flicker 1s infinite alternate;
    color: #FFD700 !important; /* Gold/Yellow flame center */
    filter: drop-shadow(0 -2px 4px rgba(255, 69, 0, 0.8));
}

@keyframes flame-flicker {
    0% { transform: scale(1) rotate(-5deg); opacity: 0.8; }
    50% { transform: scale(1.2) rotate(5deg); opacity: 1; text-shadow: 0 0 10px #ff9800; }
    100% { transform: scale(1) rotate(-5deg); opacity: 0.8; }
}

.custom-chip {
    font-size: 0.85rem !important; /* Larger than default x-small/small */
    letter-spacing: 0.5px;
}

.custom-chip-large {
    font-size: 1.1rem !important;
}

.product-card {
    overflow: visible !important;
}

.flash-sale-badge {
    position: absolute;
    top: -25px;
    left: -25px;
    background: linear-gradient(135deg, #FF1744 0%, #D50000 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 14px;
    font-weight: 900;
    font-size: 1.2rem;
    transform: rotate(-20deg) scale(1);
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.1;
    overflow: visible; /* Changed to visible to show box-shadow flames */
    animation: flame-pulse 1.5s infinite alternate; /* Main flame animation */
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Intense Flame Animation */
@keyframes flame-pulse {
    0% {
        transform: rotate(-20deg) scale(1);
        box-shadow: 
            0 0 10px rgba(255, 69, 0, 0.6),
            0 0 20px rgba(255, 140, 0, 0.4),
            0 0 30px rgba(255, 215, 0, 0.2),
            0 -10px 20px rgba(255, 0, 0, 0.5); /* Top flame lick */
    }
    25% {
        box-shadow: 
            0 0 15px rgba(255, 69, 0, 0.7),
            2px -5px 25px rgba(255, 140, 0, 0.5),
            -2px -10px 35px rgba(255, 215, 0, 0.3),
            0 -15px 30px rgba(255, 0, 0, 0.6);
    }
    50% {
        transform: rotate(-20deg) scale(1.05);
        box-shadow: 
            0 0 20px rgba(255, 69, 0, 0.8),
            -3px -8px 30px rgba(255, 140, 0, 0.6),
            3px -15px 40px rgba(255, 215, 0, 0.4),
            0 -20px 40px rgba(255, 0, 0, 0.7);
    }
    75% {
        box-shadow: 
            0 0 15px rgba(255, 69, 0, 0.7),
            -5px -5px 25px rgba(255, 140, 0, 0.5),
            5px -10px 35px rgba(255, 215, 0, 0.3),
            0 -15px 30px rgba(255, 0, 0, 0.6);
    }
    100% {
        transform: rotate(-20deg) scale(1);
        box-shadow: 
            0 0 10px rgba(255, 69, 0, 0.6),
            0 0 20px rgba(255, 140, 0, 0.4),
            0 0 30px rgba(255, 215, 0, 0.2),
            0 -10px 20px rgba(255, 0, 0, 0.5);
    }
}

.product-card:hover .flash-sale-badge {
    transform: rotate(-10deg) scale(1.15) translate(5px, 5px);
    animation: flame-pulse-hover 0.5s infinite alternate; /* Faster flicker on hover */
}

@keyframes flame-pulse-hover {
    0% {
        box-shadow: 
            0 0 15px rgba(255, 0, 0, 0.8),
            0 -10px 30px rgba(255, 165, 0, 0.7),
            0 -20px 50px rgba(255, 255, 0, 0.5);
    }
    100% {
        box-shadow: 
            0 0 25px rgba(255, 0, 0, 0.9),
            0 -15px 40px rgba(255, 165, 0, 0.8),
            0 -25px 60px rgba(255, 255, 0, 0.6);
    }
}

@keyframes spin-slow {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@media (min-width: 960px) {
    .hero-text-content {
        max-width: 60%;
    }
}

.text-white {
    color: var(--text-primary) !important; /* Override Vuetify utility for theme comp. */
}

.text-grey-lighten-1, .text-grey-lighten-3, .text-grey-lighten-4 {
    color: var(--text-secondary) !important;
}

/* Specific overrides for light mode visibility */
.theme-light .logo-text .text-white {
    color: #2c3e50 !important;
    text-shadow: none !important;
}

.theme-light .v-btn--icon .v-icon {
    color: var(--text-primary);
}

.text-cyan-accent-2, .text-cyan-accent-3 {
    color: var(--text-accent) !important;
}

.bg-gradient-premium {
    background: var(--premium-gradient);
    -webkit-background-clip: text;
    background-clip: text;
}
</style>
