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
var user_id = window.localStorage.getItem('user_id');
if(user_id != null)
  listar();
var actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: "https://misnotas-cloud.web.app",
  // This must be true.
  handleCodeInApp: true,
  android: {
    packageName: "utilidades.misnotas",
    installApp: true,
    minimumVersion: "null",
  },
};

function nueva_nota_firebase(t, c) {
  var key = firebase.database().ref().child("notas").push().key;
  firebase
    .database()
    .ref("notas/" + user_id + "/" + key + "/")
    .set({
      id: key,
      titulo: encrypt(t),
      contenido: encrypt(c),
      user_id: user_id,
    });
}

var id;

function update_nota_firebase(t, c) {
  var key = id;
  firebase
    .database()
    .ref("notas/" + user_id + "/" + key + "/")
    .set({
      id: key,
      titulo: encrypt(t),
      contenido: encrypt(c),
      user_id: user_id,
    });
}

function borrar_nota() {
  var key = id;
  firebase
    .database()
    .ref("notas/" + user_id + "/" + key + "/")
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
$("#input-email").keyup((e) => {
  if (e.which === 13) envia_email();
});

var email = "";
var confEmail = "";

function envia_email() {
  email = $("#input-email").val();
  if (email !== "") {
    $("#alert").attr("class", "alert alert-warning visible");
    if ($("#nav-language").val() === "English") {
      $("#alert").text("Enviando email...");
    } else {
      $("#alert").text("Email sending...");
    }
    firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then((e) => {
        // The link was successfully sent. Inform the user.
        $("#alert").attr("class", "alert alert-success visible");
        if ($("#nav-language").val() === "English") {
          $("#alert").text("Compruebe su email!");
        } else {
          $("#alert").text("Check your email!");
        }
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
    if ($("#nav-language").val() === "English") {
      $("#label-login").text("Por favor, confirme su cuenta de email");
    } else {
      $("#label-login").text("Please confirm your email account");
    }
    $("#login-submit").attr("onclick", "confirm_email()");
  }
}
// The client SDK will parse the code from the link for you.
firebase
  .auth()
  .signInWithEmailLink(
    window.localStorage.getItem("emailForSignIn"),
    window.location.href
  )
  .then(function (result) {
    // Clear email from storage.
    // window.localStorage.removeItem('emailForSignIn');
    // You can access the new user via result.user
    user_id = result.user.uid;
    console.log(user_id+"**");
    if(user_id != null)
      window.localStorage.setItem('user_id',user_id)
    listar();
    // Additional user info profile not available via:
    // result.additionalUserInfo.profile == null
    // You can check if the user is new or existing:
    // result.additionalUserInfo.isNewUser
  })
  .catch(function (error) {
    // Some error occurred, you can inspect the code: error.code
    // Common errors could be invalid email and invalid or expired OTPs.
  });

function confirm_email() {
  confEmail = $("#input-email").val();
  if (email === confEmail) {
    listar();
  } else {
    $("#alert").attr("class", "alert alert-danger visible");
    if ($("#nav-language").val() === "English") {
      $("#alert").text("El email no es correcto");
    } else {
      $("#alert").text("Email is wrong");
    }
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

var notas = [];

function pinta() {
  $("#list-group").empty();

  notas.forEach((d) => {
    $("#list-group").append(
      "<a onclick='titulo_contenido(\"" +
        d.id +
        '","' +
        d.titulo +
        '","' +
        d.contenido.replace(/\n/gi, "<br>") +
        "\");' class='list-group-item list-group-item-warning list-group-item-lg-12' data-toggle='modal' data-target='#modal-edita-nota'><div id='list-titulo' class='font-weight-bold'>" +
        d.titulo +
        "</div><div id='list-contenido' class='font-weight'>" +
        d.contenido.substring(0, 236) +
        "</div></a>"
    );
  });
}

function listar() {
  notas = [];

  $("#login").attr("class", "d-none ");
  $("#lista").attr("class", "d-block ");
  $("#nav-nueva-nota").attr("class", "btn btn-warning text-white d-block");
  $("#nav-salir").attr("class", "btn btn-warning text-white d-block");

  db.ref("notas/" + user_id).on("child_added", (snapshot) => {
    if (snapshot.val() !== null) {
      let d = snapshot.val();
      try {
        if (d.titulo !== "") d.titulo = decrypt(d.titulo);
        if (d.contenido !== "") d.contenido = decrypt(d.contenido);
        console.log(d);
        notas.push(d);
        ordena();
        pinta();
      } catch (error) {
        $("#alert").val(error);
      }
    }
  });

  db.ref("notas/" + user_id).on("child_changed", (snapshot) => {
    if (snapshot.val() !== null) {
      let d = snapshot.val();
      console.log(d + "changed");
      try {
        if (d.titulo !== "") d.titulo = decrypt(d.titulo);
        if (d.contenido !== "") d.contenido = decrypt(d.contenido);
        let i = notas.indexOf(d)
        notas.forEach((e) => {
          if (e.id == d.id) {
            e.titulo = d.titulo
            e.contenido = d.contenido
          }
        });
        ordena();
        pinta();
      } catch (error) {
        $("#alert").val(error);
      }
    }
  });

  db.ref("notas/" + user_id).on("child_removed", (snapshot) => {
    if (snapshot.val() !== null) {
      let d = snapshot.val();
      try {
        notas.forEach((e) => {
          if (e.id == d.id) {
            notas.splice(notas.indexOf(e), 1);
          }
        });
        pinta();
      } catch (error) {
        $("#alert").val(error);
      }
    }
  });
}

function ordena() {
  notas.sort(function (a, b) {
    if (a.titulo > b.titulo) {
      return 1;
    }
    if (a.titulo < b.titulo) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
}

// Modal Editar Nota
function titulo_contenido(i, t, c) {
  id = i;
  $("#modal-edita-titulo").val(t);
  $("#modal-edita-contenido").val(c.replace(/<br>/gi, "\n"));
}

function guardar_edicion() {
  update_nota_firebase(
    primeraMayuscula($("#modal-edita-titulo").val()),
    primeraMayuscula($("#modal-edita-contenido").val())
  );
}

function nueva_nota() {
  $("#h5-nueva-nota").attr("class", "modal-title text-white d-block");
  $("#modal-titulo").val("");
  $("#modal-contenido").val("");
}

function guardar() {
  nueva_nota_firebase(
    primeraMayuscula($("#modal-titulo").val()),
    primeraMayuscula($("#modal-contenido").val())
  );
}

function salir() {
  $("#lista").attr("class", "d-none");
  $("#login").attr("class", "d-block");
  $("#nav-nueva-nota").attr("class", "d-none");
  // Clear email from storage.
  window.localStorage.removeItem("emailForSignIn");
  email = "";
  user_id = "";
}

function primeraMayuscula(titulo1) {
  let titulo2 = "";
  try {
    titulo2 = titulo1.charAt(0).toUpperCase() + titulo1.substring(1);
  } catch (e) {}
  return titulo2;
}
