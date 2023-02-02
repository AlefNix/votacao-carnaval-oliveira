import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

let usuario = {
    votouBloco: Boolean,
    votouRainha: Boolean
}

let mensagemBloco = "Você ja votou em um bloco!";

let mensagemRainha = "Você ja votou em uma candidata!"

document.getElementById('login').addEventListener('click', function (e) {
    login();
})

function login() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user);

            setDoc(doc(db, "users", user.displayName), {
                nome: user.displayName,
                email: user.email,
                votouBloco: false,
                votouRainha: false
            })
            (async function () {
                const docRef = doc(db, "users", user.displayName);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    usuario.votouBloco = docSnap.data().votouBloco;
                    usuario.votouRainha = docSnap.data().votouRainha;
                    console.log("Document data:", docSnap.data());
                } else {
                    setDoc(doc(db, "users", user.displayName), {
                        nome: user.displayName,
                        email: user.email,
                        votouBloco: false,
                        votouRainha: false
                    });
                    usuario.votouBloco = false;
                    usuario.votouRainha = false;
                }
            })()
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorMessage);
            console.log(credential);
            console.log(errorCode)
        });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('imagem-perfil').src = user.providerData[0].photoURL;
        document.getElementById('login').style.display = "none";
        document.getElementById('imagem-perfil').style.display = "inline-block";
        (async function () {
            const docRef = doc(db, "users", user.displayName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                usuario.votouBloco = docSnap.data().votouBloco;
                usuario.votouRainha = docSnap.data().votouRainha;
                console.log("Document data:", docSnap.data());
            }
        })()
    } else {
        document.getElementById('imagem-perfil').style.display = "none";
        document.getElementById('login').style.display = "inline-block";
    }
});


function votouRainha() {
    onAuthStateChanged(auth, async (user) => {
        await updateDoc(doc(db, "users", user.displayName), {
            votouRainha: true
        });
    });
    usuario.votouRainha = true;
}

document.getElementById('logout').addEventListener('click', function (e) {
    signOut(auth).then(() => {
        console.log('saiu');
        location.reload();
    }).catch((error) => {
        console.log(error)
    });
})


/* document.getElementById('confirm').addEventListener('click', (e) => {
    const response = confirm("Are you sure you want to do that?");

    if (response) {
        alert("Ok was pressed");
    } else {
        alert("Cancel was pressed");
    }
}
) */
    