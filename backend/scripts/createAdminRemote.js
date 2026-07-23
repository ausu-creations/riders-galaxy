const axios = require('axios');

const API_URL = 'https://riders-galaxy-backend.onrender.com/api';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: 'Admin',
      email: 'admin@ridersgalaxy.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', response.data.user.email);
    console.log('Role:', response.data.user.role);
    console.log('You can now login with: admin@ridersgalaxy.com / admin123');
    
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error?.includes('already exists')) {
      console.log('✅ Admin user already exists!');
      console.log('You can login with: admin@ridersgalaxy.com / admin123');
    } else {
      console.error('❌ Error creating admin user:', error.response?.data || error.message);
    }
  }
}

createAdminUser();