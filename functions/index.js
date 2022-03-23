const functions = require("firebase-functions")
const nodemailer = require("nodemailer")
const gmailEmail = "phasi.ok.phasi@gmail.com"
const gmailPassword = "7aThUstOstE9o"
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
})
const admin = require("firebase-admin")
admin.initializeApp()

const getData = async () => {
  const data = await admin.firestore().collection("univ")
}
const f = (context) => {
  let email = {
    from: gmailEmail,
    to: "komiyo.univ334@gmail.com",
    subject: "活動のお知らせ",
    text: "活動日が近づいてきました。",
  }
  mailTransport.sendMail(email, (err, info) => {
    if (err) {
      return console.log(err)
    }
    return console.log("success")
  })
}
exports.sendMail = functions.https.onCall(f)

exports.scheduledFunction = functions.pubsub.schedule("every 1 minutes").onRun()
