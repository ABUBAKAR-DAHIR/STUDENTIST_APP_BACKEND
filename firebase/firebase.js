const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')  

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://studentistapp-99778.firebasestorage.app'
})

const bucket = admin.storage().bucket()

module.exports = bucket

// abu112abu112abu112_db_user
// 6wSU0vHm0ShllAgv
// gs://studentistapp-99778.firebasestorage.app