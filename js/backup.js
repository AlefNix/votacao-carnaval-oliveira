import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAg0Vb7f0BsxsvzdsP7ujKDLGAzE50LOfk",
    authDomain: "testando-4d0a8.firebaseapp.com",
    projectId: "testando-4d0a8",
    storageBucket: "testando-4d0a8.appspot.com",
    messagingSenderId: "36775921409",
    appId: "1:36775921409:web:6846c847ab14e911fdbd00"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let provider = new GoogleAuthProvider(app);
const db = getFirestore(app);

document.getElementById('login').addEventListener('click', function (e) {
    login();
})

function login() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            

            (async function () {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                } else {
                    setDoc(doc(db, "users", user.uid), {
                        nome: user.displayName,
                        email: user.email,
                        votou: false
                    });
                }
            })()

        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);

            console.log(errorMessage)
        });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid)
        console.log(user.email);
        console.log(user)
        console.log(user.providerData[0].photoURL)
        document.getElementById('imagem-perfil').src = user.providerData[0].photoURL;
        document.getElementById('login').style.display = "none";
        document.getElementById('imagem-perfil').style.display = "inline-block";
    } else {
        document.getElementById('imagem-perfil').style.display = "none";
        document.getElementById('login').style.display = "inline-block";
    }
});

function userVote(user) {
    (async function () {

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data().votou)
        console.log("funciona")

        if (docSnap.data().votou == true) {
            alert("Você ja votou")
        } else {
            salvarVotoAutorizado();
        }

    })()
}


function salvarVotoAutorizado() {
    (async function () {
        const docRef = doc(db, "votacao", "votacaoTeste1");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().media * 1 + 1;

        if (docSnap.exists()) {
            setDoc(doc(db, "votacao", "votacaoTeste1"), {
                bloco: "exemplo-1",
                media: media
            });
            onAuthStateChanged(auth, async (user) => {
                await updateDoc(doc(db, "users", user.uid), {
                    votou: true
                });
            });
            console.log("Document data:", media);
        } else {
            setDoc(doc(db, "votacao", "votacaoTeste1"), {
                bloco: "exemplo-1",
                media: 0
            });
        }
    })()
}

document.getElementById('salvarVotoTeste').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log(uid)
            console.log(user.email);
            console.log(user);
            userVote(user);
        } else {
            login();
        }
    });

})

document.getElementById('logout').addEventListener('click', function (e) {
    signOut(auth).then(() => {
        console.log('saiu');

    }).catch((error) => {
        console.log(error)
    });
})



    