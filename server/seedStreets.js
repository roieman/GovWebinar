require('dotenv').config();
const mongoose = require('mongoose');
const Street = require('./models/Street');

const API_URL = 'https://data.gov.il/api/3/action/datastore_search';
const RESOURCE_ID = '9ad3862c-8391-4b2f-84a4-2d4c68625f4b';
const PAGE_SIZE = 5000;

async function fetchPage(offset) {
  const url = `${API_URL}?resource_id=${RESOURCE_ID}&limit=${PAGE_SIZE}&offset=${offset}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await Street.deleteMany({});
  console.log('Cleared existing streets');

  let offset = 0;
  let total = null;
  let inserted = 0;

  while (true) {
    const result = await fetchPage(offset);
    if (total === null) {
      total = result.total;
      console.log(`Total streets to fetch: ${total}`);
    }

    const records = result.records;
    if (records.length === 0) break;

    const docs = records.map(r => ({
      cityCode: r['סמל_ישוב'],
      cityName: r['שם_ישוב'].trim(),
      streetCode: r['סמל_רחוב'],
      streetName: r['שם_רחוב'].trim(),
    }));

    await Street.insertMany(docs);
    inserted += docs.length;
    console.log(`Inserted ${inserted}/${total}`);

    offset += PAGE_SIZE;
    if (offset >= total) break;
  }

  // Log city count
  const cityCount = await Street.distinct('cityName');
  console.log(`Done! ${inserted} streets across ${cityCount.length} cities.`);

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
