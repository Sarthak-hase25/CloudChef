require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');
  
  // 1. Clean up in correct FK dependency order (children first, parents last)
  //    This prevents the "Foreign key constraint violated" error
  await prisma.purchaseOrderItem.deleteMany({});
  await prisma.purchaseOrder.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.recommendation.deleteMany({});
  await prisma.pricingSuggestion.deleteMany({});
  await prisma.demandForecast.deleteMany({});
  await prisma.wasteLog.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.menuCategory.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.kitchen.deleteMany({});

  console.log('🗑️  Cleared existing data.');

  // 2. Create a Kitchen
  const kitchen = await prisma.kitchen.create({
    data: {
      name: 'CloudKitchen AI India',
      city: 'Pune',
      phone: '+91 98765 43210',
      isActive: true,
    }
  });
  console.log(`✅ Created Kitchen: ${kitchen.name}`);

  // 3. Create the Owner
  const passwordHash = await bcrypt.hash('password123', 10);
  const owner = await prisma.user.create({
    data: {
      kitchenId: kitchen.id,
      name: 'Darshana Chuadhari',
      email: 'owner@cloudkitchen.ai',
      passwordHash,
      role: 'OWNER',
    }
  });
  console.log(`✅ Created Demo Owner: ${owner.email} | Password: password123`);

  // 4. Create Menu Categories
  const categories = await Promise.all([
    prisma.menuCategory.create({ data: { kitchenId: kitchen.id, name: 'Starters',        sortOrder: 1 } }),
    prisma.menuCategory.create({ data: { kitchenId: kitchen.id, name: 'Main Course',      sortOrder: 2 } }),
    prisma.menuCategory.create({ data: { kitchenId: kitchen.id, name: 'Breads',           sortOrder: 3 } }),
    prisma.menuCategory.create({ data: { kitchenId: kitchen.id, name: 'Rice & Biryani',   sortOrder: 4 } }),
    prisma.menuCategory.create({ data: { kitchenId: kitchen.id, name: 'Desserts',         sortOrder: 5 } }),
    prisma.menuCategory.create({ data: { kitchenId: kitchen.id, name: 'Beverages',        sortOrder: 6 } }),
  ]);
  const [starters, mainCourse, breads, rice, desserts, beverages] = categories;
  console.log(`✅ Created ${categories.length} menu categories`);

  // 5. Create Menu Items
  const menuItems = await Promise.all([
    prisma.menuItem.create({ data: { kitchenId: kitchen.id, categoryId: mainCourse.id,  name: 'Butter Chicken',        price: 280, prepTimeMinutes: 20, isVeg: false } }),
    prisma.menuItem.create({ data: { kitchenId: kitchen.id, categoryId: starters.id,    name: 'Paneer Tikka',          price: 220, prepTimeMinutes: 15, isVeg: true  } }),
    prisma.menuItem.create({ data: { kitchenId: kitchen.id, categoryId: breads.id,      name: 'Garlic Naan',           price: 50,  prepTimeMinutes: 8,  isVeg: true  } }),
    prisma.menuItem.create({ data: { kitchenId: kitchen.id, categoryId: rice.id,        name: 'Chicken Biryani',       price: 320, prepTimeMinutes: 30, isVeg: false } }),
    prisma.menuItem.create({ data: { kitchenId: kitchen.id, categoryId: mainCourse.id,  name: 'Dal Makhani',           price: 200, prepTimeMinutes: 25, isVeg: true  } }),
    prisma.menuItem.create({ data: { kitchenId: kitchen.id, categoryId: starters.id,    name: 'Chicken Tikka',         price: 260, prepTimeMinutes: 18, isVeg: false } }),
    prisma.menuItem.create({ data: { kitchenId: kitchen.id, categoryId: desserts.id,    name: 'Gulab Jamun',           price: 80,  prepTimeMinutes: 5,  isVeg: true  } }),
    prisma.menuItem.create({ data: { kitchenId: kitchen.id, categoryId: beverages.id,   name: 'Mango Lassi',           price: 90,  prepTimeMinutes: 3,  isVeg: true  } }),
  ]);
  console.log(`✅ Created ${menuItems.length} menu items`);

  // 6. Create Ingredients
  const ingredients = await Promise.all([
    prisma.ingredient.create({ data: { kitchenId: kitchen.id, name: 'Chicken',          unit: 'kg',     currentStock: 15,  reorderLevel: 5,  costPerUnit: 220, category: 'Meat'       } }),
    prisma.ingredient.create({ data: { kitchenId: kitchen.id, name: 'Tomatoes',         unit: 'kg',     currentStock: 8,   reorderLevel: 3,  costPerUnit: 40,  category: 'Vegetables' } }),
    prisma.ingredient.create({ data: { kitchenId: kitchen.id, name: 'Paneer',           unit: 'kg',     currentStock: 3,   reorderLevel: 2,  costPerUnit: 320, category: 'Dairy'      } }),
    prisma.ingredient.create({ data: { kitchenId: kitchen.id, name: 'Basmati Rice',     unit: 'kg',     currentStock: 25,  reorderLevel: 10, costPerUnit: 80,  category: 'Grains'     } }),
    prisma.ingredient.create({ data: { kitchenId: kitchen.id, name: 'Butter',           unit: 'kg',     currentStock: 4,   reorderLevel: 2,  costPerUnit: 480, category: 'Dairy'      } }),
    prisma.ingredient.create({ data: { kitchenId: kitchen.id, name: 'Maida (Flour)',    unit: 'kg',     currentStock: 12,  reorderLevel: 5,  costPerUnit: 45,  category: 'Grains'     } }),
    prisma.ingredient.create({ data: { kitchenId: kitchen.id, name: 'Onions',           unit: 'kg',     currentStock: 2,   reorderLevel: 5,  costPerUnit: 30,  category: 'Vegetables' } }),
    prisma.ingredient.create({ data: { kitchenId: kitchen.id, name: 'Cooking Oil',      unit: 'litre',  currentStock: 10,  reorderLevel: 4,  costPerUnit: 130, category: 'Oils'       } }),
    prisma.ingredient.create({ data: { kitchenId: kitchen.id, name: 'Garam Masala',     unit: 'kg',     currentStock: 0.5, reorderLevel: 1,  costPerUnit: 600, category: 'Spices'     } }),
  ]);
  console.log(`✅ Created ${ingredients.length} ingredients`);

  // 7. Create Suppliers
  await Promise.all([
    prisma.supplier.create({ data: { kitchenId: kitchen.id, name: 'Fresh Farms Organics', contactPerson: 'John Doe', phone: '+91 98765-11111', rating: 4.8 } }),
    prisma.supplier.create({ data: { kitchenId: kitchen.id, name: 'Premium Meats Ltd.',   contactPerson: 'Meat Co', phone: '+91 98765-22222', rating: 4.5 } }),
    prisma.supplier.create({ data: { kitchenId: kitchen.id, name: 'Daily Dairy Co.',      contactPerson: 'Dairy Farm', phone: '+91 98765-33333', rating: 4.9 } }),
  ]);
  console.log(`✅ Created 3 suppliers`);

  // 8. Create sample Customers
  const customers = await Promise.all([
    prisma.customer.create({ data: { kitchenId: kitchen.id, name: 'Ankit Shah',   phone: '+91 98765-43210', email: 'ankit@demo.com',  totalOrders: 42, totalSpent: 11800 } }),
    prisma.customer.create({ data: { kitchenId: kitchen.id, name: 'Priya Nair',   phone: '+91 91234-56789', email: 'priya@demo.com',  totalOrders: 18, totalSpent: 4900  } }),
    prisma.customer.create({ data: { kitchenId: kitchen.id, name: 'Rahul Verma',  phone: '+91 87654-32109', email: 'rahul@demo.com',  totalOrders: 6,  totalSpent: 1640  } }),
  ]);
  console.log(`✅ Created ${customers.length} sample customers`);

  console.log('\n🎉 Seeding finished successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧  Login: owner@cloudkitchen.ai`);
  console.log(`🔑  Password: password123`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
