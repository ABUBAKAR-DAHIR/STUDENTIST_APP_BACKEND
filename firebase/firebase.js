const admin = require('firebase-admin')
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG)  

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://studentistapp-99778.firebasestorage.app'
})

const bucket = admin.storage().bucket()

module.exports = bucket
