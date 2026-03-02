import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:2530/api';

interface CreateTicketDto {
    title: string;
    description?: string;
    category: string;
    priority: string;
    location?: string;
    createdAt?: string;
}

interface UpdateTicketDto {
    status?: string;
    assigneeId?: string;
    priority?: string;
}

interface CreateCommentDto {
    content: string;
}

const CATEGORIES = [
    'Hardware > Computer > Slow Performance',
    'Hardware > Computer > Not Booting',
    'Hardware > Computer > Blue Screen',
    'Hardware > Printer > Paper Jam',
    'Hardware > Printer > Not Printing',
    'Hardware > Printer > Toner Issue',
    'Hardware > Monitor > Display Issues',
    'Hardware > Keyboard > Keys Not Working',
    'Hardware > Mouse > Not Responding',
    'Software > Application > Installation',
    'Software > Application > Error',
    'Software > Application > License Issue',
    'Software > Email > Cannot Send',
    'Software > Email > Cannot Receive',
    'Software > Email > Spam Issues',
    'Software > Operating System > Update Failed',
    'Software > Operating System > Crash',
    'Network > Internet > Slow Connection',
    'Network > Internet > No Connection',
    'Network > WiFi > Cannot Connect',
    'Network > WiFi > Weak Signal',
    'Network > VPN > Connection Failed',
    'Access > Account > Password Reset',
    'Access > Account > Locked Account',
    'Access > Permissions > File Access',
    'Access > Permissions > Folder Access',
    'Access > Permissions > Application Access',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
const LOCATIONS = [
    'Floor 1 - Office',
    'Floor 2 - Office',
    'Floor 3 - Office',
    'Floor 4 - Executive',
    'Meeting Room A',
    'Meeting Room B',
    'Meeting Room C',
    'Conference Hall',
    'Office 101',
    'Office 102',
    'Office 201',
    'Office 202',
    'Lab 1',
    'Lab 2',
    'Warehouse',
];

const TICKET_TEMPLATES = [
    {
        title: 'Computer running very slow',
        description: 'My computer has been running extremely slow for the past few days. Applications take forever to load and the system freezes frequently. This is affecting my productivity significantly.',
    },
    {
        title: 'Cannot access network printer',
        description: "I'm unable to print documents. The printer doesn't show up in my available devices list. I've tried restarting my computer but the issue persists.",
    },
    {
        title: 'Email not working properly',
        description: 'I cannot send or receive emails since this morning. Getting error messages when trying to access my mailbox. This is urgent as I need to respond to client emails.',
    },
    {
        title: 'Internet connection keeps dropping',
        description: 'My internet connection is very unstable. It disconnects every 10-15 minutes and I have to reconnect manually. This is disrupting my video conferences.',
    },
    {
        title: 'Need software installation',
        description: 'I need Adobe Acrobat Pro installed on my workstation for document editing. Please install the latest version with full features.',
    },
    {
        title: 'Password reset required',
        description: 'I forgot my password and cannot log into the system. Please reset my password so I can access my account and continue working.',
    },
    {
        title: 'File access permission needed',
        description: "I need access to the shared drive folder for the Q1 project. Currently getting 'Access Denied' error when trying to open it.",
    },
    {
        title: 'Application showing error message',
        description: "The ERP system keeps showing 'Runtime Error 5' whenever I try to generate reports. This started happening after yesterday's update.",
    },
    {
        title: 'System crashes randomly',
        description: 'My computer crashes without warning 2-3 times per day. I lose unsaved work each time. Please investigate and fix this issue urgently.',
    },
    {
        title: 'Network drive not accessible',
        description: "Cannot access the network drive (Z:). Getting 'Network path not found' error. Other colleagues can access it without issues.",
    },
    {
        title: 'VPN connection failed',
        description: "Unable to connect to company VPN from home. Getting 'Connection timeout' error. I need this to work remotely.",
    },
    {
        title: 'Monitor display flickering',
        description: "My monitor screen flickers constantly. It's causing eye strain and headaches. Might need a replacement monitor.",
    },
    {
        title: 'Keyboard keys not responding',
        description: 'Several keys on my keyboard (E, R, T) are not working properly. Need a replacement keyboard to continue working efficiently.',
    },
    {
        title: 'Mouse cursor jumping around',
        description: 'The mouse cursor moves erratically and is very difficult to control. This makes it nearly impossible to work accurately.',
    },
    {
        title: 'Headset microphone not working',
        description: 'My headset microphone is not working during Teams calls. Others cannot hear me. The speakers work fine but mic is dead.',
    },
    {
        title: 'Blue screen error on startup',
        description: 'Getting blue screen of death (BSOD) when starting the computer. Error code: 0x0000007B. Cannot boot into Windows.',
    },
    {
        title: 'Printer paper jam issue',
        description: 'The office printer keeps jamming. Already cleared the paper tray multiple times but the problem continues. May need maintenance.',
    },
    {
        title: 'Software license expired',
        description: 'Microsoft Office license has expired. Cannot open Word or Excel files. Need license renewal urgently for daily work.',
    },
    {
        title: 'Email spam filter too aggressive',
        description: 'Important client emails are being marked as spam. Need to adjust spam filter settings to prevent legitimate emails from being blocked.',
    },
    {
        title: 'Windows update failed',
        description: 'Windows update keeps failing with error code 0x80070002. System is stuck in update loop. Please help resolve this.',
    },
];

const COMMENT_TEMPLATES = [
    "I've started looking into this issue. Will update soon.",
    'Could you please provide more details about when this started happening?',
    "I've assigned this to our senior technician for investigation.",
    'This appears to be a network configuration issue. Working on it.',
    'Please try restarting your computer and let me know if the issue persists.',
    "I've scheduled a visit to your desk tomorrow at 10 AM.",
    'The issue has been identified. Preparing the fix now.',
    'This is related to the recent system update. Rolling back the changes.',
    "I've ordered the replacement part. Should arrive by tomorrow.",
    'Can you send me a screenshot of the error message?',
    'This is affecting multiple users. Escalating to IT management.',
    "I've applied a temporary workaround. Permanent fix coming soon.",
    'The problem is resolved. Please test and confirm.',
    "Thank you for reporting this. We'll prioritize it.",
    'I need remote access to your computer to diagnose this properly.',
];

const USER_RESPONSES = [
    'Thank you for the quick response!',
    'The issue is still occurring. Please help.',
    'Yes, I can provide more information. What do you need?',
    'The problem seems to be getting worse.',
    "I tried your suggestion but it didn't work.",
    'This is very urgent. I cannot work without this.',
    'Confirmed! The issue is now resolved. Thank you!',
    'When can I expect this to be fixed?',
    'Is there a temporary solution I can use?',
    'I appreciate your help with this.',
];

async function getAuthToken(): Promise<string> {
    const token = process.env.AUTH_TOKEN;
    if (!token) {
        console.log('❌ AUTH_TOKEN environment variable is required');
        console.log('\nHow to get your token:');
        console.log('1. Login to the application');
        console.log('2. Open browser DevTools (F12)');
        console.log('3. Go to Application/Storage > Local Storage');
        console.log('4. Copy the "accessToken" value');
        console.log('\nThen run: AUTH_TOKEN=your_token npm run simulate:tickets');
        throw new Error('AUTH_TOKEN environment variable is required');
    }
    return token;
}

async function getUsers(token: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        console.error('❌ Failed to fetch users:', error.response?.data || error.message);
        return [];
    }
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

async function createTicketWithComments(
    token: string,
    ticket: CreateTicketDto,
    status: string,
    assigneeId?: string,
    numComments: number = 0
) {
    try {
        const response = await axios.post(`${API_BASE_URL}/it-tickets`, ticket, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const createdTicket = response.data;
        
        if (status !== 'Open' || assigneeId) {
            const updateData: UpdateTicketDto = {};
            if (status !== 'Open') updateData.status = status;
            if (assigneeId) updateData.assigneeId = assigneeId;
            
            await axios.patch(`${API_BASE_URL}/it-tickets/${createdTicket.id}`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        
        for (let i = 0; i < numComments; i++) {
            const content = i % 2 === 0 
                ? COMMENT_TEMPLATES[Math.floor(Math.random() * COMMENT_TEMPLATES.length)]
                : USER_RESPONSES[Math.floor(Math.random() * USER_RESPONSES.length)];
            
            try {
                await axios.post(
                    `${API_BASE_URL}/it-tickets/${createdTicket.id}/comments`,
                    { content },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return createdTicket;
    } catch (error: any) {
        console.error('❌ Failed to create ticket:', error.response?.data || error.message);
        return null;
    }
}

async function simulateTickets(count: number = 50, deleteExisting: boolean = true) {
    console.log('🚀 Starting enhanced ticket simulation...\n');
    console.log(`📊 Configuration:`);
    console.log(`   - Number of tickets: ${count}`);
    console.log(`   - Delete existing: ${deleteExisting}`);
    console.log(`   - Time range: Past 60 days\n`);
    
    try {
        const token = await getAuthToken();
        
        const users = await getUsers(token);
        if (users.length === 0) {
            console.log('❌ No users found. Cannot proceed.');
            return;
        }
        
        console.log(`👥 Found ${users.length} users\n`);
        
        const itUsers = users.filter((u: any) => 
            u.department === 'Information Technology' || 
            u.department === 'เทคโนโลยีสารสนเทศ (IT)'
        );
        
        if (deleteExisting) {
            await deleteAllTickets(token);
        }
        
        console.log(`📝 Creating ${count} tickets with realistic data...\n`);
        
        const now = new Date();
        const sixtyDaysAgo = new Date(now);
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const createdTickets = [];
        const statusCounts: Record<string, number> = {};
        const priorityCounts: Record<string, number> = {};
        
        for (let i = 0; i < count; i++) {
            const randomTime = new Date(
                sixtyDaysAgo.getTime() + 
                Math.random() * (now.getTime() - sixtyDaysAgo.getTime())
            );
            
            const template = TICKET_TEMPLATES[Math.floor(Math.random() * TICKET_TEMPLATES.length)];
            const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
            const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
            const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
            
            const statusWeights = [0.15, 0.25, 0.10, 0.30, 0.20];
            const randomValue = Math.random();
            let cumulativeWeight = 0;
            let status = 'Open';
            
            for (let j = 0; j < STATUSES.length; j++) {
                cumulativeWeight += statusWeights[j];
                if (randomValue <= cumulativeWeight) {
                    status = STATUSES[j];
                    break;
                }
            }
            
            let assigneeId: string | undefined;
            if (status !== 'Open' && itUsers.length > 0) {
                assigneeId = itUsers[Math.floor(Math.random() * itUsers.length)].id;
            }
            
            let numComments = 0;
            if (status === 'In Progress' || status === 'Pending') {
                numComments = Math.floor(Math.random() * 5) + 1;
            } else if (status === 'Resolved' || status === 'Closed') {
                numComments = Math.floor(Math.random() * 7) + 2;
            }
            
            const ticket: CreateTicketDto = {
                title: template.title,
                description: template.description,
                category,
                priority,
                location,
                createdAt: randomTime.toISOString(),
            };
            
            const created = await createTicketWithComments(token, ticket, status, assigneeId, numComments);
            
            if (created) {
                createdTickets.push(created);
                statusCounts[status] = (statusCounts[status] || 0) + 1;
                priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
                
                const statusEmoji: Record<string, string> = {
                    'Open': '🆕',
                    'In Progress': '🔄',
                    'Pending': '⏸️',
                    'Resolved': '✅',
                    'Closed': '🔒'
                };
                
                console.log(
                    `${statusEmoji[status] || '📋'} Created: ${created.ticketNo} - ${template.title.substring(0, 50)}... [${status}] (${randomTime.toLocaleDateString()})`
                );
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            if ((i + 1) % 10 === 0) {
                console.log(`\n💾 Progress: ${i + 1}/${count} tickets created\n`);
            }
        }
        
        console.log(`\n${'='.repeat(80)}`);
        console.log(`✅ Successfully created ${createdTickets.length} tickets!`);
        console.log(`${'='.repeat(80)}\n`);
        
        console.log('📊 Summary by Status:');
        Object.entries(statusCounts).sort().forEach(([status, count]) => {
            const percentage = (count / createdTickets.length) * 100;
            console.log(`   ${status.padEnd(15)} : ${count.toString().padStart(3)} (${percentage.toFixed(1).padStart(5)}%)`);
        });
        
        console.log('\n📊 Summary by Priority:');
        Object.entries(priorityCounts).sort().forEach(([priority, count]) => {
            const percentage = (count / createdTickets.length) * 100;
            console.log(`   ${priority.padEnd(15)} : ${count.toString().padStart(3)} (${percentage.toFixed(1).padStart(5)}%)`);
        });
        
        console.log('\n🎉 Simulation completed successfully!');
        
    } catch (error: any) {
        console.error('\n❌ Script failed:', error.message);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
const count = args[0] ? parseInt(args[0]) : 50;
const deleteExisting = !args.includes('--keep-existing');

simulateTickets(count, deleteExisting);
