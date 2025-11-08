"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    await prisma.watchModel.deleteMany();
    const models = [
        {
            model_name: 'Apple Watch',
            watch_model_name: '4-6 серия, SE',
            watch_model_manufacturer: 'Apple Watch',
            main_image: 'https://api.slavalarionov.store/uploads/4_6_series_ab7100cb46.png',
            watch_sizes: {
                create: [
                    { watch_size: '40' },
                    { watch_size: '44' }
                ]
            },
            frame_colors: {
                create: [
                    { color_name: 'Silver', color_code: '#C0C0C0' },
                    { color_name: 'Black', color_code: '#000000' }
                ]
            }
        },
        {
            model_name: 'Apple Watch',
            watch_model_name: '7-9 серия',
            watch_model_manufacturer: 'Apple Watch',
            main_image: 'https://api.slavalarionov.store/uploads/7_8_series_0de058bb24.png',
            watch_sizes: {
                create: [
                    { watch_size: '41' },
                    { watch_size: '45' }
                ]
            },
            frame_colors: {
                create: [
                    { color_name: 'Silver', color_code: '#C0C0C0' },
                    { color_name: 'Black', color_code: '#000000' }
                ]
            }
        },
        {
            model_name: 'Apple Watch',
            watch_model_name: '10 серия',
            watch_model_manufacturer: 'Apple Watch',
            main_image: 'https://api.slavalarionov.store/uploads/10_series_7ad739c554.png',
            watch_sizes: {
                create: [
                    { watch_size: '42' },
                    { watch_size: '46' }
                ]
            },
            frame_colors: {
                create: [
                    { color_name: 'Silver', color_code: '#C0C0C0' },
                    { color_name: 'Black', color_code: '#000000' }
                ]
            }
        },
        {
            model_name: 'Apple Watch',
            watch_model_name: 'Ultra 1-2',
            watch_model_manufacturer: 'Apple Watch',
            main_image: 'https://api.slavalarionov.store/uploads/ultra_06287a958b.png',
            watch_sizes: {
                create: [
                    { watch_size: '49' }
                ]
            },
            frame_colors: {
                create: [
                    { color_name: 'Titanium', color_code: '#8A8D8F' },
                    { color_name: 'Black', color_code: '#000000' }
                ]
            }
        }
    ];
    for (const modelData of models) {
        await prisma.watchModel.create({
            data: modelData
        });
    }
    console.log('✓ Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map