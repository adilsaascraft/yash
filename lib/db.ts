import mongoose from 'mongoose'

// =====================================
// MongoDB URI
// =====================================

const MONGO_URI = process.env.MONGO_URI as string

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI not defined')
}

// =====================================
// MongoDB connection cache
// =====================================

let cached = (global as any).mongoose || {
  conn: null,
  promise: null,
}

;(global as any).mongoose = cached

// =====================================
// Resolve DNS using Google DNS-over-HTTPS
// =====================================

async function resolveSRV(hostname: string) {
  console.log('🔍 Resolving SRV using DNS-over-HTTPS...')

  const url = `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=SRV`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`DNS-over-HTTPS request failed: ${response.status}`)
  }

  const data = await response.json()

  if (data.Status !== 0) {
    throw new Error(`DNS SRV lookup failed with status: ${data.Status}`)
  }

  if (!data.Answer || data.Answer.length === 0) {
    throw new Error('❌ No SRV records found')
  }

  return data.Answer
}

// =====================================
// Resolve TXT records
// =====================================

async function resolveTXT(hostname: string) {
  console.log('🔍 Resolving TXT records...')

  const url = `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=TXT`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`DNS TXT request failed: ${response.status}`)
  }

  const data = await response.json()

  if (!data.Answer) {
    return []
  }

  return data.Answer
}

// =====================================
// Build normal MongoDB URI
// =====================================

async function buildMongoURI() {
  const srvHostname = '_mongodb._tcp.cluster0.xgpirry.mongodb.net'

  const srvRecords = await resolveSRV(srvHostname)

  console.log('✅ SRV records received')

  const hosts = srvRecords
    .map((record: any) => {
      const target = record.data.split(' ')[3].replace(/\.$/, '')

      const port = record.data.split(' ')[2]

      return `${target}:${port}`
    })
    .join(',')

  if (!hosts) {
    throw new Error('❌ Could not build MongoDB hosts')
  }

  console.log('🔗 MongoDB hosts resolved')

  // -------------------------------------
  // Read username/password/database
  // -------------------------------------

  const originalURL = new URL(MONGO_URI)

  const username = encodeURIComponent(originalURL.username)

  const password = encodeURIComponent(originalURL.password)

  const database = originalURL.pathname

  // -------------------------------------
  // Resolve TXT records
  // -------------------------------------

  const txtRecords = await resolveTXT('cluster0.xgpirry.mongodb.net')

  let txtOptions = ''

  if (txtRecords.length > 0) {
    const txtData = txtRecords[0].data

    txtOptions = txtData.replace(/^"|"$/g, '').trim()

    if (txtOptions) {
      txtOptions = `&${txtOptions}`
    }
  }

  // -------------------------------------
  // Build normal mongodb:// URI
  // -------------------------------------

  const mongoURI =
    `mongodb://${username}:${password}@${hosts}${database}` +
    `?tls=true${txtOptions}`

  console.log('✅ Normal MongoDB connection string created')

  return mongoURI
}

// =====================================
// Connect MongoDB
// =====================================

export async function connectDB() {
  console.log('➡️ connectDB() called')

  // Already connected
  if (cached.conn) {
    console.log('✅ Using existing MongoDB connection')

    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        console.log('🔄 Connecting to MongoDB...')
        console.log('MONGO_URI exists:', !!MONGO_URI)

        const mongoURI = await buildMongoURI()

        console.log('🔄 Connecting to MongoDB using resolved hosts...')

        const connection = await mongoose.connect(mongoURI, {
          serverSelectionTimeoutMS: 10000,
        })

        console.log('✅ MongoDB Connected')

        return connection
      } catch (error) {
        console.error('❌ MongoDB Connection Error:', error)

        cached.promise = null

        throw error
      }
    })()
  }

  cached.conn = await cached.promise

  console.log('✅ connectDB() finished')

  return cached.conn
}
