<template>
    <div class="product-management fill-height pa-6">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-8">
            <div>
                <h1 class="text-h4 font-weight-black text-white mb-1">Product Management</h1>
                <div class="text-subtitle-1 text-grey-lighten-2">Manage inventory, prices, and details</div>
            </div>
            <v-btn
                color="green-accent-3"
                prepend-icon="mdi-plus"
                class="font-weight-bold"
                rounded="xl"
                @click="openDialog('add')"
            >
                Add New Product
            </v-btn>
        </div>

        <!-- Product Table -->
        <v-card class="glass-card" elevation="0">
            <v-data-table
                :headers="headers"
                :items="products"
                :loading="loading"
                class="bg-transparent text-white"
                hover
            >
                <template v-slot:item.image="{ item }">
                    <v-avatar rounded="lg" size="50" class="my-2">
                        <v-img :src="item.image" cover></v-img>
                    </v-avatar>
                </template>

                <template v-slot:item.price="{ item }">
                    <span class="font-weight-bold text-green-accent-2">฿{{ item.price }}</span>
                </template>

                <template v-slot:item.quantity="{ item }">
                    <v-chip
                        :color="item.quantity > 10 ? 'success' : (item.quantity > 0 ? 'warning' : 'error')"
                        size="small"
                        label
                        class="font-weight-bold"
                    >
                        {{ item.quantity }}
                    </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                        <v-btn icon="mdi-pencil" size="small" variant="text" color="blue-accent-2" @click="openDialog('edit', item)"></v-btn>
                        <v-btn icon="mdi-delete" size="small" variant="text" color="red-accent-2" @click="confirmDelete(item)"></v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>

        <!-- Edit/Add Dialog -->
        <v-dialog v-model="dialog" max-width="600px">
            <v-card class="glass-card-dialog">
                <v-card-title class="text-h5 font-weight-bold text-white pa-4">
                    {{ dialogType === 'add' ? 'Add New Product' : 'Edit Product' }}
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="editedItem.name" label="Product Name" variant="outlined" density="comfortable" class="text-white"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select
                                    v-model="editedItem.categoryID"
                                    :items="categories"
                                    item-title="name"
                                    item-value="categoryID"
                                    label="Category"
                                    variant="outlined"
                                    density="comfortable"
                                    class="text-white"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select v-model="editedItem.type" :items="['equipment', 'textbook']" label="Type" variant="outlined" density="comfortable" class="text-white"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="editedItem.price" label="Price" type="number" prefix="฿" variant="outlined" density="comfortable" class="text-white"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="editedItem.quantity" label="Stock Quantity" type="number" variant="outlined" density="comfortable" class="text-white"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="editedItem.image" label="Image URL" variant="outlined" density="comfortable" class="text-white"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="editedItem.details" label="Details" rows="3" variant="outlined" density="comfortable" class="text-white"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="pa-4">
                     <v-spacer></v-spacer>
                     <v-btn color="grey-lighten-1" variant="text" @click="dialog = false">Cancel</v-btn>
                     <v-btn color="blue-accent-2" variant="flat" @click="save" :loading="saving">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({
    layout: 'admin-layout'
})

const loading = ref(false)
const saving = ref(false)
const products = ref([])
const categories = ref([])
const dialog = ref(false)
const dialogType = ref('add') // 'add' or 'edit'

const headers = [
    { title: 'Image', key: 'image', sortable: false },
    { title: 'Name', key: 'name' },
    { title: 'Category', key: 'Category.name' },
    { title: 'Type', key: 'type' },
    { title: 'Price', key: 'price' },
    { title: 'Stock', key: 'quantity' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

// Default item structure
const defaultItem = {
    productID: null,
    name: '',
    type: 'equipment',
    price: 0,
    quantity: 0,
    image: '',
    details: '',
    categoryID: null
}

const editedItem = reactive({ ...defaultItem })

async function fetchProducts() {
    loading.value = true
    try {
        const response = await $fetch('/api/product')
        if (response && response.status) {
            products.value = response.data
        }
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

async function fetchCategories() {
    try {
        const { data: response } = await useFetch('/api/category')
        if (response && response.value && response.value.status) {
            categories.value = response.value.data
        }
    } catch (e) {
        console.error("Error fetching categories", e)
    }
}

function openDialog(type, item) {
    dialogType.value = type
    if (type === 'edit') {
        Object.assign(editedItem, item)
    } else {
        Object.assign(editedItem, defaultItem)
    }
    dialog.value = true
}

async function save() {
    saving.value = true
    try {
        const payload = {
            fn: dialogType.value === 'add' ? 'insert' : 'update',
            ...editedItem
        }
        
        const { data: response } = await useFetch('/api/product', {
            method: 'POST',
            body: payload
        })

        if (response.value && response.value.status) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product saved successfully',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                background: '#1e1e1e',
                color: '#fff'
            })
            
            // Close dialog for both add and edit
            dialog.value = false
            
            // Refresh list
            await fetchProducts()
        } else {
             throw new Error(response.value?.message || 'Failed to save')
        }
    } catch (e) {
        Swal.fire('Error', 'Could not save product', 'error')
    } finally {
        saving.value = false
    }
}

async function confirmDelete(item) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
        try {
            const { data: response } = await useFetch('/api/product', {
                method: 'POST',
                body: { fn: 'delete', productID: item.productID }
            })
            
            if (response.value && response.value.status) {
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
                fetchProducts()
            } else {
                Swal.fire('Error', response.value?.message || 'Could not delete product', 'error')
            }
        } catch (e) {
            Swal.fire('Error', 'An unexpected error occurred', 'error')
        }
    }
}

onMounted(() => {
    fetchProducts()
    fetchCategories()
})
</script>

<style scoped>
.product-management {
    background: radial-gradient(circle at top right, #1a237e, #000000);
    min-height: 100vh;
}

.glass-card {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
}

.glass-card-dialog {
    background: #1e1e1e !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 600px) {
    .product-management {
        padding: 16px !important;
    }
    /* Hide optional columns on mobile if needed or rely on horizontal scroll */
}
</style>
