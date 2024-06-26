const express = require('express')
const mongoose = require('mongoose')
const User = require('./user.model')
function encriptar(password){
    const abecedario = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let cifrado = [];

    function extendKey(key, length) {
        let extendedKey = key;
        while (extendedKey.length < length) {
            extendedKey += key;
        }
    return extendedKey.slice(0, length);
    }

    function vigenereCifrar(plainText, key) {
        key = key.split('');
        const cifrado = [];
        for (let i = 0; i < plainText.length; i++) {
            const letraPlainText = plainText[i];
            const letraKey = key[i % key.length];
            const indice = abecedario.indexOf(letraPlainText);
            const indiceKey = abecedario.indexOf(letraKey);
            const op = (indice + indiceKey) % 26;
            const letraCifrada = abecedario[op];
            cifrado.push(letraCifrada);
         }
    return cifrado;
    }

const claveExtendida = extendKey('ICO', password.length);
const fraseCifrada = vigenereCifrar(password, claveExtendida);
const fraseCifrada2 = String.prototype.concat.apply('', fraseCifrada);
return fraseCifrada2;
}
const Auth ={
    login:async(req, res) =>{
        const {body} =req
        var isMatch = 0
        try{
            const user = await User.findOne({email: body.email})
            if (!user){
                res.status(403).send('usuario y/o contraseña invalida')
            }else {
                const password_body_cif = encriptar(body.password);
                if(password_body_cif == user.password){
                    isMatch = 1
                }
                if(isMatch == 1){
                    res.status(200).send('aprobado')
                }else{
                    res.status(403).send('usuario y/o contraseña invalido')
                }
            }
        }catch(e){
            res.send(e.message)
        }
    },
    register : async(req, res)=>{
        const {body} = req
        try{
            const isUser = await User.findOne({email: body.email})
            if(isUser){
                res.status(403).send('El usuario ya existe')
            }else{
                const password_cif = encriptar(body.password)
                const user = await User.create({email:body.email, password: password_cif, tipo:body.tipo})
                res.status(200).send('Usuario creado')
            }
        }catch(err){
            res.status(500).send(err.message)
        }
    },
}

module.exports = Auth