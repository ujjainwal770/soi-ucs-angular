importScripts("https://www.gstatic.com/firebasejs/9.6.9/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.9/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyDDk7Xb8c0V1fKlBfHLQh_kSsglJXD7uIA",
    authDomain: "genuapp-devqc.firebaseapp.com",
    projectId: "genuapp-devqc",
    storageBucket: "genuapp-devqc.appspot.com",
    messagingSenderId: "979544400024",
    appId: "1:979544400024:web:7c46b29ea5053064f7b0ed",
    measurementId: "G-L0K62XXCSF"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();