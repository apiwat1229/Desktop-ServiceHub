import { useAuthStore } from '@/stores/auth';
import { io, Socket } from 'socket.io-client';
import { storage } from './storage';

class SocketService {
    private socket: Socket | null = null;
    private isConnected = false;
    private pendingRoomUserId: string | null = null;

    connect() {
        if (this.socket) return;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const authStore = useAuthStore();
        // Allow connection if token exists, but we might need to wait for user ID for room joining
        const token = storage.get('accessToken') || authStore.accessToken;
        if (!token) {
            console.warn('SocketService: No token found, aborting connection.');
            return;
        }

        const apiUrl = (storage.get('apiBaseUrl') || import.meta.env.VITE_API_URL || '/api').toString();
        const isProxyMode = apiUrl.startsWith('/');
        const socketUrl = isProxyMode
            ? window.location.origin
            : apiUrl.replace(/\/?api\/v1$/, '').replace(/\/?api$/, '');
        const socketPath = isProxyMode ? `${apiUrl}/socket.io/` : '/socket.io/';

        this.socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            path: socketPath,
            auth: {
                token: token
            }
        });

        this.socket.on('connect', () => {
            this.isConnected = true;

            if (this.pendingRoomUserId) {
                this.joinRoom(this.pendingRoomUserId);
                this.pendingRoomUserId = null;
            } else if (authStore.user?.id) {
                this.joinRoom(authStore.user.id);
            }
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
        });

        this.socket.on('connect_error', (err) => {
            console.error('SocketService: Connection error:', err);
        });
    }

    joinRoom(userId: string) {
        if (this.socket && this.isConnected) {
            this.socket.emit('join', userId);
        } else {
            this.pendingRoomUserId = userId;
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: string, callback: (...args: any[]) => void) {
        if (!this.socket) this.connect(); // Lazy connect
        this.socket?.on(event, callback);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    off(event: string, callback?: (...args: any[]) => void) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }
}

// Singleton pattern handling for HMR
const globalKey = Symbol.for('AppSocketService');
const globalScope = window as any;

if (!globalScope[globalKey]) {
    globalScope[globalKey] = new SocketService();
}

export const socketService = globalScope[globalKey] as SocketService;
