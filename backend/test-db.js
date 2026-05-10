import pkg from 'pg';
const { Client } = pkg;

const credentials = [
  'postgresql://postgres:password@localhost:5432/traveloop',
  'postgresql://postgres:postgres@localhost:5432/traveloop',
  'postgresql://postgres:admin@localhost:5432/traveloop',
  'postgresql://postgres:root@localhost:5432/traveloop',
  'postgresql://postgres:1234@localhost:5432/traveloop',
  'postgresql://postgres:@localhost:5432/traveloop'
];

async function test() {
  for (const url of credentials) {
    console.log(`Testing ${url}...`);
    const client = new Client({ connectionString: url });
    try {
      await client.connect();
      console.log(`✅ Success with ${url}`);
      await client.end();
      return url;
    } catch (e) {
      console.log(`❌ Failed: ${e.message}`);
    }
  }
  return null;
}

test().then(res => {
  if (res) console.log(`\nFinal result: ${res}`);
  else console.log(`\nNone of the common credentials worked.`);
});
