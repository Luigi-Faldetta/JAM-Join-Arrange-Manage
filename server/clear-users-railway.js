const { Sequelize } = require('sequelize');

// Use the exact DATABASE_URL from your .env
const sequelize = new Sequelize('postgresql://postgres:TgCEfFdvSGnSgctUyNFdhMilnKUhuIUg@centerbeam.proxy.rlwy.net:45459/railway', {
  dialect: 'postgres',
  logging: console.log, // Show SQL queries
});

async function clearAllUsers() {
  try {
    console.log('Connecting to Railway database...');
    await sequelize.authenticate();
    console.log('✅ Connected successfully!');
    
    console.log('\n🗑️  Clearing user-related data...');
    
    // Clear in order to avoid foreign key constraints
    console.log('1. Deleting UserEvents...');
    await sequelize.query('DELETE FROM "UserEvents"', {
      type: Sequelize.QueryTypes.DELETE
    });
    
    console.log('2. Deleting EventChats...');
    await sequelize.query('DELETE FROM "EventChats"', {
      type: Sequelize.QueryTypes.DELETE
    });
    
    console.log('3. Deleting Users...');
    const result = await sequelize.query('DELETE FROM "Users"', {
      type: Sequelize.QueryTypes.DELETE
    });
    
    // Verify deletion
    const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM "Users"', {
      type: Sequelize.QueryTypes.SELECT
    });
    
    console.log(`\n✅ Success! ${userCount.count} users remaining in database.`);
    console.log('🔄 All users have been cleared. Users can now register fresh with JWT tokens.');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

clearAllUsers();