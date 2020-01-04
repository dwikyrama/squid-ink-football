const webPush = require('web-push');
     
const vapidKeys = {
    "publicKey":"BEzKIBeH1qHf_IMk8J_5NSQfBd7EGsw_UbHBnlMTlIFZjTVJ1pbhZ3DFVbx9wgDWkHHT80L-GfSVUWCzcBZYQp8",
    "privateKey":"HctxMLKfBAYmZKbsqdvW2gLf0Zk51O91AYyGstcW5g8"
};
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/fJ-sr_tx564:APA91bFHJnik3XY3juJ1NfZwH-grsDZBCaSB1_ZAQXkKAUI1HsXNLUsiAz-BxsZFICTvq2QTRtzSUgo4wXcvyzp3Ii7h8X52tNvZb7IR7za47A27WZext5ezsUHrFcIIXPivPinZHdGJ",
   "keys": {
       "p256dh": "BL3i2T3w7i/7eYFQ4iVF1WQEMZjykRe6ZivyyylMLhkswQiWSlxCO7ari1Jjaw9hZcBC5HjDMtmxJc8j8e1rqWA==",
       "auth": "hRFnlHUzD4mtctzPdF0YOQ=="
   }
};

var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '713895810464',
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
).catch(function(err){
    console.log(err);
});