const fs = require('fs');
const path = require('path');

const files = [
    'c:\\Users\\apiwa\\Desktop\\Desktop-ServiceHub\\src\\views\\admin\\it-helpdesk\\Overview.vue',
    'c:\\Users\\apiwa\\Desktop\\Desktop-ServiceHub\\src\\components\\helpdesk\\TicketDetailModal.vue'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        // Replace all text-[0.somethingrem] or text-[somethingpx]
        // text-[0.55rem] to text-[0.85rem] -> text-xs
        // Also handle text-[10px] -> text-xs

        content = content.replace(/text-\[0\.[5-8]\d*rem\]/g, 'text-xs');
        content = content.replace(/text-\[1[0-2]px\]/g, 'text-xs');

        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
