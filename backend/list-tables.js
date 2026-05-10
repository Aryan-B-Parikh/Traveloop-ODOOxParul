import pkg from 'pg';
const { Client } = pkg;

const url = 'postgresql://postgres:081006@localhost:5432/traveloop';

async function listTables() {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log('Connected. Fetching tables...');
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in public schema:');
    res.rows.forEach(row => console.log(`- ${row.table_name}`));
    await client.end();
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
}

listTables();
