import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';

  const totalUsers : Object = [];
  const config = {
    apiKey: "AIzaSyAMcyr8aMSLVMKNDrx-7q0_Ls3a0NMHGvM",
    authDomain: "tienda-angular2-82354.firebaseapp.com",
    databaseURL: "https://tienda-angular2-82354.firebaseio.com",
    projectId: "tienda-angular2-82354",
    storageBucket: "tienda-angular2-82354.appspot.com",
    messagingSenderId: "118466506045"
  };
  firebase.initializeApp(config);



export const ref = firebase.database().ref()
export const refprod = firebase.database().ref('producto')
export const refcar = firebase.database().ref('producto')
export const firebaseAuth = firebase.auth



const productosDb = firebase.database().ref().child('producto')
const usuariosDb = firebase.database().ref().child('usuarios')

usuariosDb.orderByChild("id").on("child_added", function(snapshot) {
  totalUsers.push(snapshot.key)
});
