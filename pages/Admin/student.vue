<template>
    <div class="student-management fill-height pa-6">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-8">
            <div>
                <h1 class="text-h4 font-weight-black text-white mb-1 is-uppercase">Student Management</h1>
                <div class="text-subtitle-1 text-grey-lighten-2">View and manage registered students</div>
            </div>
            <v-chip color="blue-accent-2" variant="flat" class="font-weight-bold px-4" size="large">
                <v-icon start>mdi-account-group</v-icon>
                {{ students.length }} Students
            </v-chip>
        </div>

        <!-- Student Table -->
        <v-card class="glass-card" elevation="10" border>
            <v-data-table
                :headers="headers"
                :items="students"
                :loading="loading"
                class="bg-transparent text-white"
                hover
            >
                <template v-slot:item.userFullname="{ item }">
                    <div class="d-flex align-center py-2">
                        <v-avatar color="indigo-accent-3" size="40" class="mr-3 elevation-2 font-weight-bold text-white">
                            {{ item.userFullname?.charAt(0).toUpperCase() || 'U' }}
                        </v-avatar>
                        <div>
                            <div class="font-weight-bold text-body-1">{{ item.userFullname }}</div>
                            <div class="text-caption text-grey-lighten-1">{{ item.userName }}</div>
                        </div>
                    </div>
                </template>

                <template v-slot:item.userStatus="{ item }">
                    <v-chip
                        :color="item.userStatus === 'Admin' ? 'amber-accent-3' : 'success'"
                        size="small"
                        variant="flat"
                        class="font-weight-bold text-uppercase letter-spacing-1"
                    >
                         <v-icon start size="x-small" :icon="item.userStatus === 'Admin' ? 'mdi-shield-crown' : 'mdi-account-school'"></v-icon>
                        {{ item.userStatus }}
                    </v-chip>
                </template>

                <template v-slot:item.userID="{ item }">
                    <span class="text-grey-lighten-1 font-family-mono">#{{ String(item.userID).padStart(4, '0') }}</span>
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

const students = ref([])
const loading = ref(false)

const headers = [
    { title: 'Information', key: 'userFullname', align: 'start' },
    { title: 'ID', key: 'userID', align: 'start' },
    { title: 'Role / Status', key: 'userStatus', align: 'end' },
];

const fetchStudents = async () => {
    loading.value = true
    try {
        const { data } = await useFetch('/api/user', {
            query: { status: 'Student' }
        })
        // Handle API response structure variations
        if (data.value) {
            if (Array.isArray(data.value)) {
                students.value = data.value
            } else if (data.value.data && Array.isArray(data.value.data)) {
                 students.value = data.value.data
            } else if (data.value.status && data.value.data) {
                 students.value = data.value.data
            }
        }
    } catch (error) {
        console.error('Error fetching students:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchStudents()
})
</script>

<style scoped>
.glass-card {
    background: rgba(30, 41, 59, 0.7) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.text-shadow-glow {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.letter-spacing-1 {
    letter-spacing: 1px;
}

.font-family-mono {
    font-family: monospace;
}
</style>
