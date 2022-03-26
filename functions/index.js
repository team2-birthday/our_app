const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app")
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore")
const nodemailer = require("nodemailer")
const functions = require("firebase-functions")
const gmailEmail = "komiyo.univ334@gmail.com"

const docList = []

initializeApp()

const db = getFirestore()

const auth = {
  type: "OAuth2",
  user: gmailEmail,
  clientId:
    "160429130531-e074odivtou9aikigcdk38ud43l14g87.apps.googleusercontent.com",
  clientSecret: "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",
  refreshToken:
    "1//04red5sx8O5PwCgYIARAAGAQSNwF-L9IrfmFxeiwcz_5rzMBfmq5GR-X42yEMQGg7dSpHyWwKVntXnAEbAv-ydNSb-y-bft3nRLc",
}

const transport = {
  service: "gmail",
  auth,
}

const transporter = nodemailer.createTransport(transport)

const sendTo = async function () {
  const booksCollection = await db.collection("userData").get()
  booksCollection.forEach((doc) => {
    console.log(doc.id, "=>", doc.data())
    docList.push(doc)
  })
}

const mailOptions = (email, date, circleName) => {
  return {
    from: gmailEmail,
    to: email,
    subject: "サークルの活動日が近づいてきました",
    text: ,
  }
}

exports.sendMail = functions.https.onCall(async (data, context) => {
  const x = await sendTo()
  // transporter.sendMail(mailOptions, (err, response) => {
  //   console.log(err || response)
  // })
})
