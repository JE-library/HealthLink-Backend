const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: "mt1",
  useTLS: true,
});

module.exports = pusher;
