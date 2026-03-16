require('dotenv').config();
const mongoose = require('mongoose');

async function createIndex() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const collection = mongoose.connection.collection('claims');

  // Check if index already exists
  const existing = await collection.listSearchIndexes().toArray();
  const hasIndex = existing.some(idx => idx.name === 'claims_search');

  if (hasIndex) {
    console.log('Search index "claims_search" already exists. Dropping and recreating...');
    await collection.dropSearchIndex('claims_search');
    // Wait for drop to propagate
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  await collection.createSearchIndex({
    name: 'claims_search',
    definition: {
      mappings: {
        dynamic: false,
        fields: {
          claimantName: { type: 'string', analyzer: 'lucene.standard' },
          idNumber: { type: 'string', analyzer: 'lucene.keyword' },
          phone: { type: 'string', analyzer: 'lucene.keyword' },
          email: { type: 'string', analyzer: 'lucene.standard' },
          type: { type: 'string', analyzer: 'lucene.keyword' },
          status: { type: 'string', analyzer: 'lucene.keyword' },
          details: {
            type: 'document',
            fields: {
              city: { type: 'string', analyzer: 'lucene.standard' },
              street: { type: 'string', analyzer: 'lucene.standard' },
              damageDescription: { type: 'string', analyzer: 'lucene.standard' },
              injuryDescription: { type: 'string', analyzer: 'lucene.standard' },
              businessName: { type: 'string', analyzer: 'lucene.standard' },
              businessType: { type: 'string', analyzer: 'lucene.standard' },
              carMake: { type: 'string', analyzer: 'lucene.standard' },
              licensePlate: { type: 'string', analyzer: 'lucene.keyword' },
              insuranceCompany: { type: 'string', analyzer: 'lucene.standard' },
              medicalInstitution: { type: 'string', analyzer: 'lucene.standard' },
              injuryType: { type: 'string', analyzer: 'lucene.standard' },
            }
          }
        }
      }
    }
  });

  console.log('Atlas Search index "claims_search" created successfully!');
  console.log('Note: It may take 1-2 minutes for the index to become active.');
  await mongoose.disconnect();
}

createIndex().catch(err => { console.error(err); process.exit(1); });
