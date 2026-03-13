const Category = require('../models/Category');

const categories = [
  {
    name: 'Food & Dining',
    slug: 'food-dining',
    description: 'Coupons for restaurants, cafes, and food delivery',
    icon: '🍔',
    color: '#EF4444',
    displayOrder: 1
  },
  {
    name: 'Shopping',
    slug: 'shopping',
    description: 'Discounts on fashion, electronics, and more',
    icon: '🛍️',
    color: '#8B5CF6',
    displayOrder: 2
  },
  {
    name: 'Travel',
    slug: 'travel',
    description: 'Flight, hotel, and vacation deals',
    icon: '✈️',
    color: '#3B82F6',
    displayOrder: 3
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Movies, events, and streaming services',
    icon: '🎬',
    color: '#EC4899',
    displayOrder: 4
  },
  {
    name: 'Health & Fitness',
    slug: 'health-fitness',
    description: 'Gym memberships, wellness, and healthcare',
    icon: '💪',
    color: '#10B981',
    displayOrder: 5
  },
  {
    name: 'Beauty & Spa',
    slug: 'beauty-spa',
    description: 'Salon, spa, and beauty products',
    icon: '💄',
    color: '#F59E0B',
    displayOrder: 6
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Online courses, books, and learning platforms',
    icon: '📚',
    color: '#6366F1',
    displayOrder: 7
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets, appliances, and tech products',
    icon: '📱',
    color: '#14B8A6',
    displayOrder: 8
  }
];

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert new categories
    await Category.insertMany(categories);
    
    console.log('✅ Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../config/db');
  connectDB().then(() => seedCategories());
}

module.exports = seedCategories;
