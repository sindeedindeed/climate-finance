const bcrypt = require("bcryptjs");
const { pool } = require("./src/config/db");

const fixDemoUserPassword = async () => {
  try {
    // Hash the demo password
    const hashedPassword = await bcrypt.hash("Demo123!", 10);
    
    // Update the demo user's password in the database
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, 'demo@climatedb.com']
    );
    
    console.log('Demo user password updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating demo user password:', error);
    process.exit(1);
  }
};

// Run the fix
fixDemoUserPassword();