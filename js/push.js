var webPush = require('web-push');
     
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
   "endpoint": "https://fcm.googleapis.com/fcm/send/cvqGjNrU8Uw:APA91bHxC_9MDzb2Kfy0kypVo5ZYREpFq9nb3-CoOoUUsdKAs7wsFDIxYPBrZwghsrMm-mkOra_npaY3LaN-beQGbhUBHhdW-OSeY4KEoCiwvzGrw_-eIdBoR5bmYFBVEFxcexzkR8mD",
   "keys": {
       "p256dh": "BHpKYxI8IXNeGt6Qx1RqnDjhk8llN6nzW9SKoHXErENzWIhhwQl1Lc7LKvL3d9RwiGZMh3KQkbsoyG+/aSZview=",
       "auth": "2XRCOnb3XaIriq0ZnPrJUg=="
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