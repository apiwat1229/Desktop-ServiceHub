import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';

const routes = [
    {
        path: '/public/log/:id',
        name: 'PublicRepairLog',
        component: () => import('../views/public/PublicRepairView.vue'),
    },
    {
        path: '/',
        component: () => import('@/components/layout/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('../views/admin/Dashboard.vue'),
            },
            {
                path: 'queue',
                name: 'Queue & Booking',
                component: () => import('../views/Placeholder.vue'),
            },
            {
                path: 'suppliers',
                name: 'Suppliers',
                component: () => import('../views/Placeholder.vue'),
            },
            {
                path: 'users',
                name: 'Users',
                component: () => import('../views/Placeholder.vue'),
            },

            {
                path: 'my-notifications',
                name: 'MyNotifications',
                component: () => import('../views/MyNotifications.vue'),
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('../views/Profile.vue'),
            },

        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresGuest: true }
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('../views/Signup.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/pending-approval',
        name: 'PendingApproval',
        component: () => import('../views/PendingApproval.vue'),
        meta: { requiresAuth: true }
    },

    {
        path: '/admin',
        component: () => import('@/components/layout/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/',
            },
            {
                path: 'system-status',
                redirect: { path: '/admin/settings', query: { tab: 'system-status' } },
            },
            {
                path: 'roles',
                redirect: { path: '/admin/settings', query: { tab: 'roles' } },
            },
            {
                path: 'users',
                redirect: { path: '/admin/settings', query: { tab: 'users' } },
            },

            {
                path: 'notifications',
                name: 'Notifications',
                component: () => import('../views/admin/NotificationsManagement.vue'),
            },
            {
                path: 'purchasing',
                name: 'Purchasing',
                component: () => import('../views/Placeholder.vue'),
            },

            {
                path: 'analytics',
                name: 'Analytics',
                component: () => import('../views/Placeholder.vue'),
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('../views/Settings.vue'),
            },
            {
                path: 'helpdesk',
                component: () => import('../views/admin/it-helpdesk/Layout.vue'),
                children: [
                    {
                        path: '',
                        redirect: '/admin/helpdesk/overview'
                    },
                    {
                        path: 'overview',
                        name: 'Help Desk Overview',
                        component: () => import('../views/admin/it-helpdesk/Overview.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'Overview' }
                            ]
                        }
                    },
                    {
                        path: 'tickets',
                        name: 'Help Desk Tickets',
                        component: () => import('../views/admin/it-helpdesk/TicketList.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'Tickets' }
                            ]
                        }
                    },
                    {
                        path: 'kb',
                        name: 'Knowledge Base',
                        component: () => import('../views/admin/it-helpdesk/KnowledgeBase.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'Knowledge Base' }
                            ]
                        }
                    },
                    {
                        path: 'inventory',
                        name: 'IT Inventory',
                        component: () => import('../views/admin/it-helpdesk/Inventory.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'Inventory' }
                            ]
                        }
                    },
                    {
                        path: 'asset-requests',
                        name: 'Asset Requests',
                        component: () => import('../views/admin/it-helpdesk/AssetRequests.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'Asset Requests' }
                            ]
                        }
                    },
                    {
                        path: 'analytics',
                        name: 'Help Desk Analytics',
                        component: () => import('../views/admin/it-helpdesk/Analytics.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'Analytics' }
                            ]
                        }
                    },
                    {
                        path: 'manage-test-tickets',
                        name: 'Manage Test Tickets',
                        component: () => import('../views/admin/ManageTestTickets.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'Manage Test Tickets' }
                            ]
                        }
                    },
                    {
                        path: 'cctv',
                        name: 'CCTV Management',
                        component: () => import('../views/admin/it-helpdesk/CCTVManagement.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'CCTV Management' }
                            ]
                        }
                    },
                    {
                        path: 'backup',
                        name: 'Backup Data Management',
                        component: () => import('../views/admin/it-helpdesk/BackupDataManagement.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'Backup Data' }
                            ]
                        }
                    },
                    {
                        path: 'preventive-maintenance',
                        name: 'Preventive Maintenance',
                        component: () => import('../views/admin/it-helpdesk/PreventiveMaintenance.vue'),
                        meta: {
                            breadcrumbs: [
                                { label: 'IT Help Desk', to: '/admin/helpdesk' },
                                { label: 'Preventive Maintenance' }
                            ]
                        }
                    }
                ]
            },
        ]
    },
    {
        path: '/approvals',
        component: () => import('@/components/layout/NavbarOnlyLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Approvals',
                component: () => import('@/views/approvals/ApprovalsList.vue'),
            },
            {
                path: ':id',
                name: 'Approval Detail',
                component: () => import('@/views/approvals/ApprovalDetail.vue'),
            },
        ]
    },
    {
        path: '/change-password',
        name: 'ChangePassword',
        component: () => import('../views/ChangePassword.vue'),
    },
    {
        path: '/error',
        name: 'Error',
        component: () => import('../views/Error.vue'),
    },


    {
        path: '/my-machine',
        component: () => import('@/components/layout/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'My Machine',
                component: () => import('../views/admin/MyMachine.vue'),
            },
            {
                path: 'stock/add',
                name: 'AddStock',
                component: () => import('../views/admin/StockFormPage.vue'),
            },
            {
                path: ':id',
                name: 'MachineDetail',
                component: () => import('../views/admin/components/mymachine/MachineDetail.vue'),
            }
        ]
    },
    {
        path: '/maintenance',
        component: () => import('@/components/layout/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Maintenance',
                component: () => import('../views/admin/Maintenance.vue'),
            },
            {
                path: ':id',
                name: 'MaintenanceDetail',
                component: () => import('../views/admin/components/maintenance/MachineDetail.vue'),
            }
        ]
    },


    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.meta.requiresGuest && isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
