import { usePermissions } from '@/composables/usePermissions';
import {
    BarChart3,
    BookOpen,
    Camera,
    ClipboardList,
    Database,
    FileText,
    Headset,
    LayoutDashboard,
    Monitor,
    Package,
    Server,
    Settings,
    Shield,
    Users,
    Wrench
} from 'lucide-vue-next';
import { computed, type FunctionalComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export interface MenuItem {
    name: string;
    path: string;
    icon: FunctionalComponent;
    permission?: string;
    children?: MenuItem[];
}

export interface MenuGroup {
    title: string;
    items: MenuItem[];
}

export function useSidebarMenu() {
    const { hasPermission, isAdmin } = usePermissions();
    const { t } = useI18n();

    const allMenuGroups = computed<MenuGroup[]>(() => [
        {
            title: t('admin.sidebar.main'),
            items: [
                { name: t('admin.sidebar.dashboard'), path: '/', icon: LayoutDashboard },
                {
                    name: t('services.maintenance.name'),
                    path: '/maintenance',
                    icon: Wrench,
                    permission: 'maintenance:read',
                    children: [
                        { name: t('services.maintenance.tabs.overview'), path: '/maintenance?tab=dashboard', icon: LayoutDashboard },
                        { name: t('services.maintenance.tabs.machines'), path: '/maintenance?tab=machines', icon: Settings },
                        { name: t('services.maintenance.tabs.repairs'), path: '/maintenance?tab=repairs', icon: ClipboardList },
                        { name: t('services.maintenance.tabs.parts'), path: '/maintenance?tab=stock', icon: Package },
                    ]
                },
                {
                    name: t('services.itHelp.name'),
                    path: '/admin/helpdesk',
                    icon: Headset,
                    permission: 'helpdesk:read',
                    children: [
                        { name: t('services.itHelp.tabs.overview'), path: '/admin/helpdesk/overview', icon: LayoutDashboard },
                        { name: t('services.itHelp.tabs.tickets'), path: '/admin/helpdesk/tickets', icon: FileText },
                        { name: t('services.itHelp.tabs.kb'), path: '/admin/helpdesk/kb', icon: BookOpen },
                        { name: t('services.itHelp.tabs.stock'), path: '/admin/helpdesk/inventory', icon: Package },
                        { name: t('services.itHelp.tabs.assetRequests'), path: '/admin/helpdesk/asset-requests', icon: Monitor },
                        { name: 'CCTV Management', path: '/admin/helpdesk/cctv', icon: Camera },
                        { name: 'Backup Data', path: '/admin/helpdesk/backup', icon: Database },
                        { name: 'Preventive Maintenance', path: '/admin/helpdesk/preventive-maintenance', icon: Wrench },
                        { name: t('services.itHelp.tabs.analytics'), path: '/admin/helpdesk/analytics', icon: BarChart3 },
                    ]
                },
                {
                    name: t('admin.sidebar.settings'),
                    path: '/admin/settings',
                    icon: Settings,
                    children: [
                        { name: t('admin.sidebar.roles'), path: '/admin/settings?tab=roles', icon: Shield },
                        { name: t('admin.sidebar.users'), path: '/admin/settings?tab=users', icon: Users },
                        { name: t('admin.sidebar.systemStatus'), path: '/admin/settings?tab=system-status', icon: Server },

                    ]
                },
            ],
        },
    ]);

    const menuGroups = computed(() => {
        return allMenuGroups.value
            .map((group) => ({
                ...group,
                items: group.items.filter((item) => {
                    if (!item.permission) return true;
                    if (isAdmin.value) return true;
                    return hasPermission(item.permission);
                }),
            }))
            .filter((group) => group.items.length > 0);
    });

    return {
        menuGroups,
    };
}
