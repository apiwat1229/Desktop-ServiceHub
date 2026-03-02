import axios from 'axios';

const API_BASE_URL = 'http://localhost:2530/api';

interface CreateTicketDto {
    title: string;
    description?: string;
    category: string;
    priority: string;
    location?: string;
    createdAt?: string;
}

const categories = [
    'Hardware > Computer > Slow Performance',
    'Hardware > Computer > Not Booting',
    'Hardware > Printer > Paper Jam',
    'Hardware > Printer > Not Printing',
    'Software > Application > Installation',
    'Software > Application > Error',
    'Software > Email > Cannot Send',
    'Software > Email > Cannot Receive',
    'Network > Internet > Slow Connection',
    'Network > Internet > No Connection',
    'Network > WiFi > Cannot Connect',
    'Access > Account > Password Reset',
    'Access > Account > Locked Account',
    'Access > Permissions > File Access',
];

const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
const locations = ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Meeting Room A', 'Meeting Room B', 'Office 101', 'Office 102'];

const titles = [
    'Computer running very slow',
    'Cannot access printer',
    'Email not working',
    'Internet connection issues',
    'Software installation needed',
    'Password reset request',
    'File access permission needed',
    'System error message',
    'Application crash',
    'Network drive not accessible',
    'VPN connection failed',
    'Monitor display issues',
    'Keyboard not working',
    'Mouse not responding',
    'Headset audio problems',
];

const descriptions = [
    'Need urgent assistance with this issue',
    'This has been happening since yesterday',
    'Multiple users are affected',
    'Cannot complete my work without this',
    'Please help as soon as possible',
    'This is blocking my daily tasks',
    'Tried restarting but still not working',
    'Getting error messages repeatedly',
    'Need this fixed before the meeting',
    'Critical for project deadline',
];

async function getAuthToken(): Promise<string> {
    console.log('Please provide your authentication token.');
    console.log('You can get it from:');
    console.log('1. Login to the application');
    console.log('2. Open browser DevTools (F12)');
    console.log('3. Go to Application/Storage > Local Storage');
    console.log('4. Copy the "accessToken" value');
    console.log('\nOr provide it as an environment variable: AUTH_TOKEN=your_token');
    
    const token = process.env.AUTH_TOKEN;
    if (!token) {
        throw new Error('AUTH_TOKEN environment variable is required');
    }
    return token;
}

async function deleteAllTickets(token: string) {
    try {
        console.log('🗑️  Fetching all tickets...');
        const response = await axios.get(`${API_BASE_URL}/it-tickets`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const tickets = response.data;
        console.log(`Found ${tickets.length} tickets to delete`);
        
        for (const ticket of tickets) {
            try {
                await axios.delete(`${API_BASE_URL}/it-tickets/${ticket.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(`✅ Deleted ticket: ${ticket.ticketNo} - ${ticket.title}`);
            } catch (error: any) {
                console.error(`❌ Failed to delete ticket ${ticket.ticketNo}:`, error.response?.data || error.message);
            }
        }
        
        console.log(`\n✅ Deleted ${tickets.length} tickets successfully\n`);
    } catch (error: any) {
        console.error('❌ Error deleting tickets:', error.response?.data || error.message);
        throw error;
    }
}

async function createTestTickets(token: string, count: number = 30) {
    console.log(`📝 Creating ${count} test tickets for the past month...\n`);
    
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const createdTickets = [];
    
    for (let i = 0; i < count; i++) {
        // Random date within the past month
        const randomTime = oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime());
        const createdAt = new Date(randomTime);
        
        const ticket: CreateTicketDto = {
            title: titles[Math.floor(Math.random() * titles.length)],
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            createdAt: createdAt.toISOString(),
        };
        
        try {
            const response = await axios.post(`${API_BASE_URL}/it-tickets`, ticket, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            createdTickets.push(response.data);
            console.log(`✅ Created ticket #${i + 1}: ${response.data.ticketNo} - ${ticket.title} (${createdAt.toLocaleDateString()})`);
            
            // Random delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error: any) {
            console.error(`❌ Failed to create ticket #${i + 1}:`, error.response?.data || error.message);
        }
    }
    
    console.log(`\n✅ Created ${createdTickets.length} test tickets successfully`);
    return createdTickets;
}

async function updateTicketStatuses(token: string, tickets: any[]) {
    console.log('\n🔄 Updating ticket statuses randomly...\n');
    
    for (const ticket of tickets) {
        // 70% chance to update status
        if (Math.random() > 0.3) {
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            try {
                await axios.patch(`${API_BASE_URL}/it-tickets/${ticket.id}`, 
                    { status: randomStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log(`✅ Updated ${ticket.ticketNo} to status: ${randomStatus}`);
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error: any) {
                console.error(`❌ Failed to update ${ticket.ticketNo}:`, error.response?.data || error.message);
            }
        }
    }
}

async function main() {
    try {
        console.log('🚀 Starting ticket management script...\n');
        
        const token = await getAuthToken();
        
        // Step 1: Delete all existing tickets
        await deleteAllTickets(token);
        
        // Step 2: Create test tickets
        const createdTickets = await createTestTickets(token, 30);
        
        // Step 3: Update some tickets with different statuses
        await updateTicketStatuses(token, createdTickets);
        
        console.log('\n✅ All operations completed successfully!');
        console.log(`📊 Summary: Created ${createdTickets.length} tickets spanning the past month`);
        
    } catch (error: any) {
        console.error('\n❌ Script failed:', error.message);
        process.exit(1);
    }
}

main();
