// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDzLtF0ZNFaQaT9FODpIWv9YtrTQFV3AXA",
  authDomain: "misnotas-b6c56.firebaseapp.com",
  databaseURL: "https://misnotas-b6c56.firebaseio.com",
  projectId: "misnotas-b6c56",
  storageBucket: "misnotas-b6c56.appspot.com",
  messagingSenderId: "853691070722",
  appId: "1:853691070722:web:78e6cee92f36b2e906ea1b",
  measurementId: "G-EB1G9RDN44",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
// Get a reference to the database service
var db = firebase.database();
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: "https://misnotas-cloud.web.app",
  android: {
    packageName: "utilidades.misnotas",
    installApp: true,
    minimumVersion: "null",
  },
  // This must be true.
  handleCodeInApp: true,
};

function nueva_nota_firebase(t, c) {
  var key = firebase.database().ref().child("notas").push().key;
  firebase
    .database()
    .ref("notas/" + key + "/")
    .set({
      id: key,
      titulo: encrypt(t),
      contenido: encrypt(c),
      user_id: email,
    });
}
var id

function update_nota_firebase(t, c) {
  var key = id;
  firebase
    .database()
    .ref("notas/" + key + "/")
    .set({
      id: key,
      titulo: encrypt(t),
      contenido: encrypt(c),
      user_id: email,
    });
}

function borrar_nota() {
    var key = id;
    firebase
      .database()
      .ref("notas/" + key + "/")
      .remove();
}



// Cambiar idioma

$("#nav-language").click((e) => {
  if ($("#nav-language").val() === "English") {
    $("#nav-nueva-nota").val("New Note");
    $("#nav-language").val("Español");
    $("#nav-salir").val("Logout");
    $("#input-email").attr("placeholder", "Enter your email");
    $("#email-help").text("We will never share your email with anyone");
    $("#login-submit").val("Send");
    $("#h5-nueva-nota").html("New Note");
    $("#h5-editar-nota").html("Edit Note");
    $("#label-modal-titulo").text("Title");
    $("#label-modal-contenido").text("Content");
    $("#btn-eliminar-nota").text("Delete");
    $("#btn-guardar-nota").text("Save");
    $("#h5-confirmar-salir").html("Please confirm");
    $("#p-seguro-salir").text("Are you sure you want to leave the session?");
    $("#p-seguro-borrar").text("Are you sure you want to delete the note?");
    $("#btn-salir").text("Logout");
    $("#btn-borrar").text("Delete");
  } else {
    $("#nav-language").val("English");
    $("#nav-nueva-nota").val("Nueva Nota");
    $("#nav-salir").val("Salir");
    $("#input-email").attr("placeholder", "Introduce tu Email");
    $("#email-help").text("Nunca compartiremos tu email con nadie");
    $("#login-submit").val("Enviar");
    $("#h5-nueva-nota").html("Nueva Nota");
    $("#h5-editar-nota").html("Editar Nota");
    $("#label-modal-titulo").text("Titulo");
    $("#label-modal-contenido").text("Contenido");
    $("#btn-eliminar-nota").text("Eliminar");
    $("#btn-guardar-nota").text("Guardar");
    $("#h5-confirmar-salir").html("Por favor, confirme");
    $("#p-seguro-salir").text("¿Seguro que deseas abandonar la sesion?");
    $("#p-seguro-borrar").text("¿Seguro que deseas borrar la nota?");
    $("#btn-salir").text("Abandonar");
    $("#btn-borrar").text("Borrar");
  }
});

/// Login

// Enter automatizamos Enviar
$("#input-email").keyup(e => {
  if ( e.which === 13 ) 
    envia_email()
});


var email = "";
var confEmail = "";

function confirmEmail() {
  confEmail = $("#input-email").val();
  if (email === confEmail) {
    listar();
  } else {
    $("#alert").attr("class", "alert alert-danger visible");
    $("#alert").text("El email no es correcto");
  }
}

function envia_email() {
  email = $("#input-email").val();
  if (email !== "") {
    $("#alert").attr("class", "alert alert-warning visible");
    $("#alert").text("Enviando email...");
    firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then((e) => {
        // The link was successfully sent. Inform the user.
        $("#alert").attr("class", "alert alert-success visible");
        $("#alert").text("Compruebe su email!");
        // Save the email locally so you don't need to ask the user for it again, if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        return null;
      })
      .catch((e) => {
        $("#alert").attr("class", "alert alert-danger visible");
        $("#alert").text(e);
      });
  }
}

// Confirm the link is a sign-in with email link.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  email = window.localStorage.getItem("emailForSignIn");
  if (!email) {
    $("#label-login").text(textString);
    labelLogin.textContent = "Por favor, confirme su cuenta de email";
    loginSubmit.setAttribute("onclick", "confirmEmail()");
  } else {
    listar();
  }
}

/// Lista

//Encriptacion , Desencriptacion  AES  JAVASCRIPT

var salt = "577bd45a17977269694908d80905c32a"; //passed from client-side
var four = "9a2b73d130c8796309b776eeb09834b0";
var passphrase = "Esto es una clave dicharachera";
var keySize = 128 / 32;
var iterationCount = 1000;
var key = CryptoJS.PBKDF2(passphrase, CryptoJS.enc.Hex.parse(salt), {
  keySize,
  iterations: iterationCount,
});


encrypt = function (plainText) {
  var encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: CryptoJS.enc.Hex.parse(four),
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

decrypt = function (cipherText) {
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText),
  });
  var decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: CryptoJS.enc.Hex.parse(four),
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

var notas;




function pinta() {
  $("#lista").attr("class", "d-block ");
  $("#nav-nueva-nota").attr("class", "btn btn-warning text-white d-block");
  $("#nav-salir").attr("class", "btn btn-warning text-white d-block");
  $("#list-group").empty();
  
  notas.forEach((d) => {

    $("#list-group").append(
      "<a onclick='titulo_contenido(\"" +
        d.id +
        "\",\"" +
        d.titulo +
        "\",\"" +
        d.contenido.replaceAll('\n','<br>') +
        "\");' class='list-group-item list-group-item-warning list-group-item-lg-12' data-toggle='modal' data-target='#modal-edita-nota'><div id='list-titulo' class='font-weight-bold'>" +
        d.titulo +
        "</div><div id='list-contenido' class='font-weight'>" +
        d.contenido.substring(0,55) +
        "</div></a>"
    );
   
  });
}

function ordena() {
  notas.sort((a, b) => {
    if (a.titulo > b.titulo) {
      return 1;
    }
    if (a.titulo < b.titulo) {
      return -1;
    }
    return 0;
  });
}

function listar() {
  $("#login").attr("class", "d-none ");
  notas = [];
  db.ref("notas")
    .orderByChild("user_id")
    .equalTo(email)
    .on("child_added", (snapshot) => {
      if (snapshot.val() !== null) {
        d = snapshot.val();
        try {
          if (d.titulo !== "") d.titulo = decrypt(d.titulo);
          if (d.contenido !== "") d.contenido =  decrypt(d.contenido);
          if (!notas.includes(d)) {
            notas.push(d);
            ordena();
            pinta();
          }
        } catch (error) {
          console.log(error);
        }
      }
    });

  db.ref("notas")
    .orderByChild("user_id")
    .equalTo(email)
    .on("child_changed", (snapshot) => {
      if (snapshot.val() !== null) {
        d = snapshot.val();
        try {
          if (d.titulo !== "") d.titulo = decrypt(d.titulo);
          if (d.contenido !== "") d.contenido = decrypt(d.contenido);
          let notass = [];
          notass.push(d);
          notas.forEach((e) => {
            if (e.id !== d.id) notass.push(e);
          });
          if (notas.length === notass.length) {
            notas = notass;
            ordena();
            pinta();
          }
          ordena();
          pinta();
        } catch (error) {
          console.log(error);
        }
      }
    });

  db.ref("notas")
    .orderByChild("user_id")
    .equalTo(email)
    .on("child_removed", (snapshot) => {
      if (snapshot.val() !== null) {
        d = snapshot.val();
        try {
          if (d.titulo !== "") d.titulo = decrypt(d.titulo);
          if (d.contenido !== "") d.contenido = decrypt(d.contenido);
          let notass = [];
          notas.forEach((e) => {
            if (e.id !== d.id) notass.push(e);
          });
          if (notas.length - 1 === notass.length) {
            notas = notass;
            ordena();
            pinta();
          }
          ordena();
          pinta();
        } catch (error) {
          console.log(error);
        }
      }
    });
}

// Modal Editar Nota
function titulo_contenido(i,t, c) {
  id = i
  $("#modal-edita-titulo").val(t);
  $("#modal-edita-contenido").val(c.replaceAll('<br>','\n')) 

}

function guardar_edicion() {
  update_nota_firebase(
    $("#modal-edita-titulo").val(),
    $("#modal-edita-contenido").val()
  );
}


function nueva_nota() {
  $("#h5-nueva-nota").attr("class", "modal-title text-white d-block");
  $("#modal-titulo").val("");
  $("#modal-contenido").val("");
}

function guardar() {
    nueva_nota_firebase($("#modal-titulo").val(), $("#modal-contenido").val());
}

function salir() {
  $("#lista").attr("class", "d-none");
  $("#login").attr("class", "d-block");
  // Clear email from storage.
  window.localStorage.removeItem("emailForSignIn");
  email = "";
}

console.log("me cago");
