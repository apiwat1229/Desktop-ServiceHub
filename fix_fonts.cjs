const fs = require('fs');
const path = require('path');

const files = [
    'c:\\Users\\apiwa\\Desktop\\Desktop-ServiceHub\\src\\views\\admin\\it-helpdesk\\Overview.vue',
    'c:\\Users\\apiwa\\Desktop\\Desktop-ServiceHub\\src\\components\\helpdesk\\TicketDetailModal.vue'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Convert 0.55rem - 0.75rem to text-xs
        content = content.replace(/text-\[0\.[5-7]\d*rem\]/g, 'text-xs');

        // Convert 0.8rem - 0.85rem to text-sm
        content = content.replace(/text-\[0\.8\d*rem\]/g, 'text-sm');

        // Convert px variants
        content = content.replace(/text-\[1[0-2]px\]/g, 'text-xs');
        content = content.replace(/text-\[1[3-4]px\]/g, 'text-sm');

        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
