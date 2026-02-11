<template>
    <div class="category-management fill-height pa-6">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-8">
            <div>
                <h1 class="text-h4 font-weight-black text-white mb-1">จัดการหมวดหมู่</h1>
                <div class="text-subtitle-1 text-grey-lighten-2">จัดการหมวดหมู่สินค้าทั้งหมด</div>
            </div>
            <v-btn
                color="green-accent-3"
                prepend-icon="mdi-plus"
                class="font-weight-bold"
                rounded="xl"
                @click="openDialog('add')"
            >
                เพิ่มหมวดหมู่
            </v-btn>
        </div>

        <!-- Category Table -->
        <v-card class="glass-card" elevation="0">
            <v-data-table
                :headers="headers"
                :items="categories"
                :loading="loading"
                class="bg-transparent text-white"
                hover
            >
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                        <v-btn icon="mdi-pencil" size="small" variant="text" color="blue-accent-2" @click="openDialog('edit', item)"></v-btn>
                        <v-btn icon="mdi-delete" size="small" variant="text" color="red-accent-2" @click="confirmDelete(item)"></v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>

        <!-- Edit/Add Dialog -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card class="glass-card-dialog">
                <v-card-title class="text-h5 font-weight-bold text-white pa-4">
                    {{ dialogType === 'add' ? 'เพิ่มหมวดหมู่ใหม่' : 'แก้ไขหมวดหมู่' }}
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="editedItem.name" label="ชื่อหมวดหมู่" variant="outlined" density="comfortable" class="text-white"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="editedItem.description" label="รายละเอียด" rows="3" variant="outlined" density="comfortable" class="text-white"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="pa-4">
                     <v-spacer></v-spacer>
                     <v-btn color="grey-lighten-1" variant="text" @click="dialog = false">ยกเลิก</v-btn>
                     <v-btn color="blue-accent-2" variant="flat" @click="save" :loading="saving">บันทึก</v-btn>
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
const categories = ref([])
const dialog = ref(false)
const dialogType = ref('add') // 'add' or 'edit'

const headers = [
    { title: 'ID', key: 'categoryID', sortable: true },
    { title: 'ชื่อหมวดหมู่', key: 'name' },
    { title: 'รายละเอียด', key: 'description' },
    { title: 'จัดการ', key: 'actions', sortable: false, align: 'end' },
]

// Default item structure
const defaultItem = {
    categoryID: null,
    name: '',
    description: ''
}

const editedItem = reactive({ ...defaultItem })

async function fetchCategories() {
    loading.value = true
    try {
        const { data: response } = await useFetch('/api/category')
        if (response.value && response.value.status) {
            categories.value = response.value.data
        }
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
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
    if (!editedItem.name) return
    
    saving.value = true
    try {
        const payload = {
            fn: dialogType.value === 'add' ? 'insert' : 'update',
            ...editedItem
        }
        
        const { data: response } = await useFetch('/api/category', {
            method: 'POST',
            body: payload
        })

        if (response.value && response.value.status) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Category saved successfully',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                background: '#1e1e1e',
                color: '#fff'
            })
            dialog.value = false
            fetchCategories()
        } else {
             throw new Error(response.value?.message || 'Failed to save')
        }
    } catch (e) {
        Swal.fire('Error', 'Could not save category', 'error')
    } finally {
        saving.value = false
    }
}

async function confirmDelete(item) {
    const result = await Swal.fire({
        title: 'ยืนยันการลบ?',
        text: "คุณจะไม่สามารถกู้คืนข้อมูลได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ลบเลย!'
    })

    if (result.isConfirmed) {
        try {
            await useFetch('/api/category', {
                method: 'POST',
                body: { fn: 'delete', categoryID: item.categoryID }
            })
            Swal.fire('Deleted!', 'ลบหมวดหมู่เรียบร้อยแล้ว.', 'success')
            fetchCategories()
        } catch (e) {
            Swal.fire('Error', 'Could not delete category', 'error')
        }
    }
}

onMounted(() => {
    fetchCategories()
})
</script>

<style scoped>
.category-management {
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
</style>
