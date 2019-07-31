const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore()
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)

exports.on_create_user = functions.auth.user().onCreate((user) => {
  const { uid, email, displayName } = user
  const balance = 0.0

  return firestore.doc(`users/${uid}`).set({ uid, email, displayName, balance })
});