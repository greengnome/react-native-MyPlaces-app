const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const fs = require('fs')
const UUID = require('uuid-v4')

const gcconfig = {
  projectId: 'rnapp-1517166956688',
  keyFilename: 'rnapp-key-storage.json'
}

const gcs = require('@google-cloud/storage')(gcconfig)

admin.initializeApp({
  credential: admin.credential.cert(require('./rnapp-key-storage.json'))
})

exports.storeImage = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
      console.log('No token present')
      response.status(403).json({ error: 'Unathorized' })
      return
    }

    let idToken
    idToken = request.headers.authorization.split('Bearer ')[1]

    admin.auth().verifyIdToken(idToken).then(decodedtoken => {
      const body = JSON.parse(request.body)

      fs.writeFileSync('/tmp/uploaded-image.jpg', body.image, 'base64', err => {
        console.log(err)
        return response.status(500).json({ error: err })
      })

      const bucket = gcs.bucket('rnapp-1517166956688.appspot.com')
      const uuid = UUID()

      bucket.upload(
        '/tmp/uploaded-image.jpg',
        {
          uploadType: 'media',
          destination: '/places/' + uuid + '.jpg',
          metadata: {
            metadata: {
              contentType: 'image/jpeg',
              firebaseStorageDownloadTokens: uuid
            }
          }
        },
        (err, file) => {
          if (!err) {
            response.status(201).json({
              imageUrl:
                'https://firebasestorage.googleapis.com/v0/b/' +
                bucket.name +
                '/o/' +
                encodeURIComponent(file.name) +
                '?alt=media&token=' +
                uuid,
              imagePath: '/places/' + uuid + '.jpg'
            })
          } else {
            console.log(err)
            response.status(500).json({ error: err })
          }
        })
      return decodedtoken
    }, err => { console.log(err) })
      .catch(err => {
        console.log(err, 'Token is invalid')
        response.status(403).json({ error: 'Unathorized' })
      })
  }, err => { console.log(err) })
})

exports.deleteImage = functions.database.ref('/places/{placeId}').onDelete(event => {
  const placeData = event.data.previous.val()
  const imagePath = placeData.imagePath

  const bucket = gcs.bucket('rnapp-1517166956688.appspot.com')
  return bucket.file(imagePath).delete()
})
