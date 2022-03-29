const { initializeApp } = require("firebase-admin/app") //Node.jsの形式なので、import,exportの形を使えない
const { getFirestore } = require("firebase-admin/firestore") //exports.モジュール名 = データ
const nodemailer = require("nodemailer") //const 名前 = require(モジュールがあるファイル名)
const functions = require("firebase-functions")

//メアド、id,シークレットid,リフレッシュトークンをmy-dataファイル殻取ってきている
const {
  mymail,
  authclientid,
  authsecretid,
  authrefreshToken,
} = require("./my-data")

const gmailEmail = mymail

const today = new Date() //今日の日付をとってくる
const today_year = today.getFullYear()
const today_date = today.getDate()
let today_month = today.getMonth() + 1
if (today_month < 10) {
  today_month = "0" + String(today_month)
}
const today_string =
  String(today_year) + String(today_month) + String(today_date) //格納されている形式に合わせる

initializeApp() //firebase admin SDKを有効にする

const db = getFirestore() //firebase firestoreのデータベースを取得する

const auth = {
  //認証情報(個人情報なのでgitignoreで隠したファイルから持ってきている)
  type: "OAuth2",
  user: gmailEmail,
  clientId: authclientid,
  clientSecret: authsecretid,
  refreshToken: authrefreshToken,
}

const transport = {
  //送信形式の設定
  service: "gmail",
  auth,
}

const transporter = nodemailer.createTransport(transport) //nodemailerを設定を反映して使用する

const doPost = async function () {
  const booksCollection = await db.collection("userData").get()
  let sendOptionList = [] //送信対象となった人だけを格納するリストを作る
  booksCollection.forEach((doc) => {
    // console.log(doc.id, "=>", doc.data())
    // console.log(doc.data().newComerCircle[0])

    for (let j = 0; j < doc.data().newComerCircle.length; j++) {
      //.data()をつけないとデータの中身を読み取ってくれない(共通)
      for (let k = 0; k < doc.data().newComerCircle[j].schedule.length; k++) {
        let date = doc.data().newComerCircle[j].schedule[k].date
        let cal_date = date.split("-").join("")
        if (
          //3日以内の時だけ通知を送信する
          Number(cal_date) - Number(today_string) >= 0 &&
          Number(cal_date) - Number(today_string) < 4
        ) {
          sendOptionList.push(
            mailOptions(
              doc.data().userMail,
              doc.data().newComerCircle[j].circleName,
              date
            )
          )
        }
      }
    }
  })
  // console.log(sendOptionList)
  for (let i = 0; i < sendOptionList.length; i++) {
    //各データにおいてメールを送信する
    transporter.sendMail(sendOptionList[i], (err, response) => {
      console.log(err || response)
    })
  }
}

const mailOptions = (email, circleName, date) => {
  //送信情報を返す関数
  const sentence =
    date +
    "にある、" +
    circleName +
    "の活動日が迫ってきました！！\n日程、場所を確認しましょう！！"
  return {
    from: gmailEmail,
    to: email,
    subject: "サークルの活動日が近づいてきました",
    text: sentence,
  }
}

exports.sendMail = functions.https.onCall(async (data, context) => {
  //呼び出しで使える形式にしている
  doPost()
})

exports.sendMailAuto = functions
  .region("asia-northeast1")
  .pubsub.schedule("every 1 days")
  .onRun((context) => {
    doPost()
  })
