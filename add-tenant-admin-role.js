const { Client } = require('pg');

async function addTenantAdminRole() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || 'postgresql://postgres:S2024DiboMano@db.mgnukermjfidhmpyrxyl.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    console.log('✓ Connected to database');

    const query = "ALTER TYPE \"UserRole\" ADD VALUE 'tenant_admin' BEFORE 'admin'";
    await client.query(query);
    console.log('✓ ALTER TYPE executed successfully - tenant_admin added to UserRole enum');

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.message.includes('already exists')) {
      console.log('ℹ tenant_admin value already exists in UserRole enum');
      process.exit(0);
    }
    process.exit(1);
  }
}

addTenantAdminRole();
