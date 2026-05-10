import pkg from 'pg';
const { Client } = pkg;

const url = 'postgresql://postgres:081006@localhost:5432/traveloop';

async function checkUsers() {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query('SELECT id, email, username, role FROM "User"');
    console.log('Users in DB:');
    console.table(res.rows);
    await client.end();
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
}

checkUsers();
