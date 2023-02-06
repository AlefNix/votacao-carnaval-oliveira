import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

let mensagemRainha = "Você ja votou em uma candidata!"

document.getElementById('login').addEventListener('click', function (e) {
    login();
});


document.getElementById('botao-login').addEventListener('click', function (e) {
    login();
})


function login() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;


            (async function () {
                const docRef = doc(db, "users", user.displayName);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    usuario.votouBloco = docSnap.data().votouBloco;
                    usuario.votouRainha = docSnap.data().votouRainha;
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
                location.reload()
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
        document.querySelector('.popup').remove();
        document.getElementById('imagem-perfil').src = user.providerData[0].photoURL;
        document.getElementById('login').style.display = "none";
        document.getElementById('imagem-perfil').style.display = "inline-block";
        (async function () {
            const docRef = doc(db, "users", user.displayName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                usuario.votouBloco = docSnap.data().votouBloco;
                usuario.votouRainha = docSnap.data().votouRainha;
            }
            if (usuario.votouRainha === true) {
                exibirVoto();
            }
        })()
    } else {
        document.querySelector('.popup').style.display = 'flex';
        document.getElementById('imagem-perfil').style.display = "none";
        document.getElementById('login').style.display = "inline-block";
        document.querySelectorAll('.botao-votar').forEach((botao) => {
            botao.style.display = "none";
        })
    }
});


function exibirVoto() {
    (async function () {
        const querySnapshot = await getDocs(collection(db, "votacao-rainha"));
        querySnapshot.forEach((doc) => {
            document.getElementById(doc.id).innerText = doc.data().votos + ' votos';
        });
    })()
    document.querySelectorAll('.botao-votar').forEach((botao) => {
        botao.disabled = true;
        botao.style.display = "block"
    })
}

function votouRainha() {
    onAuthStateChanged(auth, async (user) => {
        await updateDoc(doc(db, "users", user.displayName), {
            votouRainha: true
        });
    });
    usuario.votouRainha = true;
    exibirVoto();
}


function thauane() {
    (async function () {
        const docRef = doc(db, "votacao-rainha", "thauane-mendes");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao-rainha", "thauane-mendes"), {
                votos: media
            });
            votouRainha();
            alert("Obrigado por votar no bloco candidata Thauane!")
        }
    })()
}


document.getElementById('votar-thauane').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {
        const response = confirm("Confirmar voto para Thauane Mendes?");

        if (response) {
            if (user) {
                if (usuario.votouRainha == false) {
                    thauane();
                } else {
                    alert(mensagemRainha)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})

function kelly() {
    (async function () {
        const docRef = doc(db, "votacao-rainha", "kelly-santos");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao-rainha", "kelly-santos"), {
                votos: media
            });
            votouRainha();
            alert("Obrigado por votar na candidata Kelly!")
        }
    })()
}


document.getElementById('votar-kelly').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {
        const response = confirm("Confirmar voto para a Kelly Santos?");

        if (response) {
            if (user) {
                if (usuario.votouRainha == false) {
                    kelly();
                } else {
                    alert(mensagemRainha)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})

function viviane() {
    (async function () {
        const docRef = doc(db, "votacao-rainha", "viviane");
        const docSnap = await getDoc(docRef);
        let media = docSnap.data().votos * 1 + 1;

        if (docSnap.exists()) {
            updateDoc(doc(db, "votacao-rainha", "viviane"), {
                votos: media
            });
            votouRainha();
            alert("Obrigado por votar na candidata Viviane!")
        }
    })()
}


document.getElementById('votar-viviane').addEventListener('click', function (e) {
    onAuthStateChanged(auth, (user) => {
        const response = confirm("Confirmar voto para a Viviane?");

        if (response) {
            if (user) {
                if (usuario.votouRainha == false) {
                    viviane();
                } else {
                    alert(mensagemRainha)
                }
            } else {
                alert('Você precisa fazer login primeiro!')
            }
        }
    });
})
