const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { connectDB } = require('./config/db');

// Models
const User = require('./models/User');
const Profile = require('./models/Profile');
const Service = require('./models/Service');
const Achievement = require('./models/Achievement');

// Default Services
const defaultServices = [
  {
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies like React, Node.js, and MongoDB. Fast, responsive, and SEO-optimized websites tailored to your business needs.',
    shortDescription: 'Modern web applications with React, Node.js, and more',
    icon: 'code',
    category: 'development',
    price: 'Starting from $500',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'CMS Integration', 'API Development'],
    isActive: true,
    order: 1
  },
  {
    title: 'Mobile App Development',
    description: 'Cross-platform mobile applications for iOS and Android using React Native. Native performance with a single codebase.',
    shortDescription: 'Cross-platform mobile apps for iOS and Android',
    icon: 'mobile',
    category: 'development',
    price: 'Starting from $1000',
    features: ['iOS & Android', 'Push Notifications', 'Offline Support', 'API Integration', 'App Store Submission'],
    isActive: true,
    order: 2
  },
  {
    title: 'Cloud Solutions',
    description: 'Cloud architecture design and implementation using AWS, Google Cloud, or Azure. Scalable and cost-effective solutions.',
    shortDescription: 'Scalable cloud infrastructure on AWS, GCP, Azure',
    icon: 'cloud',
    category: 'cloud',
    price: 'Custom Quote',
    features: ['AWS/GCP/Azure', 'Serverless Architecture', 'CI/CD Pipelines', 'Containerization', 'Cost Optimization'],
    isActive: true,
    order: 3
  },
  {
    title: 'API Development',
    description: 'RESTful and GraphQL API design and implementation. Secure, scalable, and well-documented APIs for your applications.',
    shortDescription: 'Secure and scalable RESTful and GraphQL APIs',
    icon: 'api',
    category: 'development',
    price: 'Starting from $300',
    features: ['REST & GraphQL', 'Authentication', 'Rate Limiting', 'Documentation', 'Third-party Integrations'],
    isActive: true,
    order: 4
  },
  {
    title: 'Database Design',
    description: 'Efficient database schema design and optimization for MongoDB, PostgreSQL, and other databases.',
    shortDescription: 'Optimized database design and management',
    icon: 'database',
    category: 'data',
    price: 'Starting from $200',
    features: ['Schema Design', 'Query Optimization', 'Data Migration', 'Backup Solutions', 'Performance Tuning'],
    isActive: true,
    order: 5
  },
  {
    title: 'Technical Consulting',
    description: 'Expert technical advice for your projects. Architecture review, technology selection, and development strategy.',
    shortDescription: 'Expert advice on technology and architecture',
    icon: 'consulting',
    category: 'consulting',
    price: '$100/hour',
    features: ['Architecture Review', 'Tech Stack Selection', 'Code Review', 'Best Practices', 'Team Training'],
    isActive: true,
    order: 6
  }
];

// Default Achievements
const defaultAchievements = [
  {
    title: 'AWS Solutions Architect Professional',
    description: 'Certified AWS Solutions Architect with expertise in designing distributed systems and cloud infrastructure on AWS.',
    category: 'certification',
    issuer: 'Amazon Web Services',
    issueDate: new Date('2024-01-15'),
    link: 'https://aws.amazon.com',
    isFeatured: true,
    order: 1
  },
  {
    title: 'MongoDB Developer Certification',
    description: 'Proven expertise in building applications with MongoDB, including aggregation, indexing, and data modeling.',
    category: 'certification',
    issuer: 'MongoDB Inc.',
    issueDate: new Date('2023-11-20'),
    link: 'https://mongodb.com',
    isFeatured: true,
    order: 2
  },
  {
    title: 'React Developer Professional',
    description: 'Advanced React development certification covering hooks, context, performance optimization, and testing.',
    category: 'certification',
    issuer: 'Meta',
    issueDate: new Date('2023-09-10'),
    link: 'https://react.dev',
    isFeatured: true,
    order: 3
  },
  {
    title: 'E-Commerce Platform Project',
    description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Features include payment integration, inventory management, and admin dashboard.',
    category: 'project',
    issuer: 'Personal Project',
    issueDate: new Date('2024-02-01'),
    link: 'https://github.com',
    isFeatured: true,
    order: 4
  },
  {
    title: 'Best Developer Award 2023',
    description: 'Recognized as Best Developer at TechConf 2023 for outstanding contributions to open source projects.',
    category: 'award',
    issuer: 'TechConf',
    issueDate: new Date('2023-12-05'),
    isFeatured: false,
    order: 5
  },
  {
    title: 'Bachelor of Science in Computer Science',
    description: 'Graduated with honors. Focus on software engineering, algorithms, and database systems.',
    category: 'education',
    issuer: 'University of Technology',
    issueDate: new Date('2022-06-15'),
    isFeatured: false,
    order: 6
  }
];

// Default Profile
const defaultProfile = {
  name: 'John Doe',
  title: 'Senior Sofexampletware Engineer',
  bio: 'Passionate software engineer with 7+ years of experience building scalable web and mobile applications. Specialized in MERN stack, cloud architecture, and enterprise solutions. Committed to delivering high-quality code and innovative solutions.',
  email: 'john.doe@exaSofexampletwaremple.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  website: 'https://joexaSofexampletwaremplehndoe.dev',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  twitter: 'https://twitter.com/johndoe',
  skills: [
    'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express',
    'TypeScript', 'AWS', 'Docker', 'Git', 'REST APIs',
    'GraphQL', 'PostgreSQL', 'Redis', 'CI/CD', 'Agile'
  ]
};

// Default Admin User
const defaultAdmin = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123'
};

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Service.deleteMany({});
    await Achievement.deleteMany({});

    console.log('Cleared existing data...');

    // Create admin user (pass plain password - pre-save hook will hash it)
    const admin = await User.create({
      username: defaultAdmin.username,
      email: defaultAdmin.email,
      password: defaultAdmin.password
    });
    console.log('Created admin user:', admin.email);

    // Create profile
    const profile = await Profile.create(defaultProfile);
    console.log('Created profile:', profile.name);

    // Create services
    const services = await Service.insertMany(defaultServices);
    console.log(`Created ${services.length} services`);

    // Create achievements
    const achievements = await Achievement.insertMany(defaultAchievements);
    console.log(`Created ${achievements.length} achievements`);

    console.log('\n✓ Database seeded successfully!');
    console.log('\nAdmin Credentials:');
    console.log('  Email:', defaultAdmin.email);
    console.log('  Password:', defaultAdmin.password);
    console.log('\nPlease change the admin password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
