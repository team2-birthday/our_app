const { initializeApp } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")
const nodemailer = require("nodemailer")
const functions = require("firebase-functions")
// const { stringifyQuery } = require("vue-router")

const {
  mymail,
  authclientid,
  authsecretid,
  authrefreshToken,
} = require("./my-data")
const gmailEmail = mymail

const today = new Date()
const today_year = today.getFullYear()
const today_date = today.getDate()
let today_month = today.getMonth() + 1
if (today_month < 10) {
  today_month = "0" + String(today_month)
}
const today_string =
  String(today_year) + String(today_month) + String(today_date)

initializeApp()

const db = getFirestore()

const auth = {
  type: "OAuth2",
  user: gmailEmail,
  clientId: authclientid,
  clientSecret: authsecretid,
  refreshToken: authrefreshToken,
}

const transport = {
  service: "gmail",
  auth,
}
const transporter = nodemailer.createTransport(transport)
const getDocList = async function () {
  const booksCollection = await db.collection("userData").get()
  let sendOptionList = ["あたま"]
  booksCollection.forEach((doc) => {
    // console.log(doc.id, "=>", doc.data())
    for (let j = 0; j < doc.newComerCircle.length(); j++) {
      let date = doc.newComerCircle[j].schedule[0].date
      let cal_date = date.split("-").join("")
      if (
        Number(cal_date) - Number(today_string) > 0 &&
        Number(cal_date) - Number(today_string) < 4
      ) {
        sendOptionList.push(
          mailOptions(doc.userMail, doc.newComerCircle[j].circleName, date)
        )
      }
    }
  })
  console.log(sendOptionList)
}

// const get_activeCircle = async function () {
//   const booksCollection = await db.collection("")
// }

const mailOptions = (email, circleName, date) => {
  const sentence =
    date + "にある、" + circleName + "の活動日が迫ってきました！！\n"
  return {
    from: gmailEmail,
    to: email,
    subject: "サークルの活動日が近づいてきました",
    text: sentence,
  }
}

const doPost = () => {
  let docList = []
  let sendOptionList = []
  getDocList(docList)
  for (let i = 0; i < docList.length; i++) {
    for (let j = 0; j < docList[i].newComerCircle.length; j++) {
      let date = docList[i].newComerCircle[j].schedule[0].date
      let cal_date = date.split("-").join("")
      if (
        Number(cal_date) - Number(today_string) > 0 &&
        Number(cal_date) - Number(today_string) < 4
      ) {
        sendOptionList.push(
          mailOptions(
            docList[i].userMail,
            docList[i].newComerCircle[j].circleName,
            date
          )
        )
      }
    }
  }
  console.log(docList)
  // for (let i = 0; i < sendOptionList.length; i++) {
  //   transporter.sendMail(sendOptionList[i], (err, response) => {
  //     console.log(err || response)
  //   })
  // }
}

exports.sendMail = functions.https.onCall(async (data, context) => {
  getDocList()
})

exports.sendMail_auto = functions.pubsub
  .schedule("every 1 days")
  .onRun((context) => {
    const x = doPost()
  })
