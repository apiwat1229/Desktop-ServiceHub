# Ticket Simulation Guide - Desktop ServiceHub

This guide explains how to use the ticket simulation scripts to generate realistic test data for the IT Help Desk system from the frontend.

## Overview

Two simulation scripts are available:

1. **`manage-test-tickets.ts`** - Original simple simulation
2. **`simulate-tickets-enhanced.ts`** - Enhanced simulation with comments and realistic data

## Enhanced Simulation Script

The enhanced script (`simulate-tickets-enhanced.ts`) provides:
- **20+ realistic ticket templates** with detailed descriptions
- **27 categories** covering Hardware, Software, Network, and Access issues
- **15 locations** representing different office areas
- **Realistic status distribution** (Open, In Progress, Pending, Resolved, Closed)
- **Automatic comments** based on ticket status
- **Proper assignee relationships** with IT department users
- **60-day time range** for historical data

## Usage

### Prerequisites

1. **Backend API must be running** (default: http://localhost:2530)
2. **Authentication token required**
3. **Users must exist** in the database

### Getting Your Auth Token

1. Login to the application
2. Open browser DevTools (F12)
3. Go to **Application/Storage > Local Storage**
4. Copy the `accessToken` value

### Running the Scripts

#### Using npm scripts (Recommended)

```bash
# Enhanced simulation - 50 tickets (default)
AUTH_TOKEN=your_token_here npm run simulate:tickets

# Enhanced simulation - custom count
AUTH_TOKEN=your_token_here npm run simulate:tickets 100

# Enhanced simulation - keep existing tickets
AUTH_TOKEN=your_token_here npm run simulate:tickets 50 --keep-existing

# Original simple simulation
AUTH_TOKEN=your_token_here npm run manage:tickets
```

#### Direct execution

```bash
# Enhanced simulation
AUTH_TOKEN=your_token_here npx tsx scripts/simulate-tickets-enhanced.ts 50

# Original simulation
AUTH_TOKEN=your_token_here npx tsx scripts/manage-test-tickets.ts
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `count` | Number of tickets to create | 50 |
| `--keep-existing` | Don't delete existing tickets | False (will delete) |

### Examples

```bash
# Generate 30 tickets, delete existing ones
AUTH_TOKEN=abc123... npm run simulate:tickets 30

# Generate 100 tickets, keep existing ones
AUTH_TOKEN=abc123... npm run simulate:tickets 100 --keep-existing

# Generate default 50 tickets
AUTH_TOKEN=abc123... npm run simulate:tickets
```

## Features Comparison

### Original Script (manage-test-tickets.ts)
- ✅ Basic ticket creation
- ✅ Random status updates
- ✅ Simple data
- ❌ No comments
- ❌ No assignees
- ❌ Limited templates

### Enhanced Script (simulate-tickets-enhanced.ts)
- ✅ Realistic ticket templates
- ✅ Automatic comments (0-8 per ticket)
- ✅ Proper assignee relationships
- ✅ Status-based comment count
- ✅ 60-day time distribution
- ✅ Detailed progress output
- ✅ Summary statistics

## Output Example

```
🚀 Starting enhanced ticket simulation...

📊 Configuration:
   - Number of tickets: 50
   - Delete existing: true
   - Time range: Past 60 days

👥 Found 15 users

🗑️  Fetching all tickets...
Found 23 tickets to delete
✅ Deleted ticket: T-1000 - Computer running very slow
...
✅ Deleted 23 tickets successfully

📝 Creating 50 tickets with realistic data...

🆕 Created: T-1000 - Computer running very slow... [Open] (1/15/2026)
🔄 Created: T-1001 - Cannot access network printer... [In Progress] (1/18/2026)
⏸️ Created: T-1002 - Email not working properly... [Pending] (1/20/2026)
✅ Created: T-1003 - Internet connection keeps dropping... [Resolved] (1/22/2026)
🔒 Created: T-1004 - Need software installation... [Closed] (1/25/2026)
...

💾 Progress: 10/50 tickets created
...

================================================================================
✅ Successfully created 50 tickets!
================================================================================

📊 Summary by Status:
   Closed          :   9 ( 18.0%)
   In Progress     :  13 ( 26.0%)
   Open            :   8 ( 16.0%)
   Pending         :   5 ( 10.0%)
   Resolved        :  15 ( 30.0%)

📊 Summary by Priority:
   Critical        :  11 ( 22.0%)
   High            :  14 ( 28.0%)
   Low             :  12 ( 24.0%)
   Medium          :  13 ( 26.0%)

🎉 Simulation completed successfully!
```

## Data Generated

### Ticket Categories

**Hardware Issues**
- Computer: Slow Performance, Not Booting, Blue Screen
- Printer: Paper Jam, Not Printing, Toner Issue
- Peripherals: Monitor, Keyboard, Mouse issues

**Software Issues**
- Application: Installation, Errors, License
- Email: Send/Receive problems, Spam
- OS: Update failures, Crashes

**Network Issues**
- Internet: Connectivity, Speed
- WiFi: Connection, Signal strength
- VPN: Connection failures

**Access Issues**
- Account: Password reset, Locked accounts
- Permissions: File/Folder/Application access

### Ticket Templates

20 realistic scenarios including:
- "Computer running very slow" - Performance degradation
- "Cannot access network printer" - Printer connectivity
- "Email not working properly" - Email service issues
- "Internet connection keeps dropping" - Network instability
- "Need software installation" - Software requests
- "Password reset required" - Account access
- "File access permission needed" - Permission requests
- "Application showing error message" - Software errors
- "System crashes randomly" - System stability
- And more...

### Comment Examples

**IT Technician Comments:**
- "I've started looking into this issue. Will update soon."
- "This appears to be a network configuration issue. Working on it."
- "I've scheduled a visit to your desk tomorrow at 10 AM."
- "The issue has been identified. Preparing the fix now."

**User Responses:**
- "Thank you for the quick response!"
- "The issue is still occurring. Please help."
- "I tried your suggestion but it didn't work."
- "Confirmed! The issue is now resolved. Thank you!"

## Status Distribution

The enhanced script uses weighted random distribution:
- **Open**: 15% - New tickets awaiting assignment
- **In Progress**: 25% - Actively being worked on
- **Pending**: 10% - Waiting for user response or parts
- **Resolved**: 30% - Fixed and awaiting closure
- **Closed**: 20% - Completed tickets

## Comment Distribution

Comments are added based on ticket status:
- **Open**: 0 comments (just created)
- **In Progress**: 1-5 comments (active conversation)
- **Pending**: 1-5 comments (waiting for response)
- **Resolved**: 2-8 comments (full conversation history)
- **Closed**: 2-8 comments (complete resolution)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AUTH_TOKEN` | Authentication token from browser | Yes |
| `VITE_API_BASE_URL` | API base URL | No (default: http://localhost:2530/api) |

## Troubleshooting

### "AUTH_TOKEN environment variable is required"
**Solution**: Provide your authentication token:
```bash
AUTH_TOKEN=your_token npm run simulate:tickets
```

### "No users found. Cannot proceed."
**Solution**: Create users in the database first through the admin panel

### "Failed to fetch users"
**Solution**: 
- Check if backend API is running
- Verify API URL is correct
- Ensure token is valid

### Network errors
**Solution**:
- Verify backend is running on correct port
- Check CORS settings
- Ensure database is accessible

## Best Practices

1. **Use in development only** - Not for production data
2. **Backup before running** - Especially without `--keep-existing`
3. **Start small** - Test with 10-20 tickets first
4. **Monitor API** - Watch for rate limiting or errors
5. **Review data** - Check generated tickets in the UI

## Integration with Backend

The scripts use the following API endpoints:
- `GET /api/users` - Fetch users for assignments
- `GET /api/it-tickets` - Fetch existing tickets
- `POST /api/it-tickets` - Create new tickets
- `PATCH /api/it-tickets/:id` - Update ticket status
- `DELETE /api/it-tickets/:id` - Delete tickets
- `POST /api/it-tickets/:id/comments` - Add comments

## Performance

- **Rate limiting**: 100-200ms delay between requests
- **Batch progress**: Shows progress every 10 tickets
- **Error handling**: Continues on individual failures
- **Memory efficient**: Processes tickets sequentially

## Future Enhancements

Potential improvements:
- Asset request tickets
- File attachments
- Approval workflows
- Custom date ranges
- Specific user targeting
- Bulk operations
- Export/Import functionality

## Support

For issues:
1. Check backend API is running
2. Verify authentication token
3. Review console output for errors
4. Check network tab in DevTools
5. Verify user permissions
