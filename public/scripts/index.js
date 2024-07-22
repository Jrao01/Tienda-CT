let generatePass = '';


function generar() {

    const caracteres = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXÑñCVBNM[]¿?:+_)(!@#$%^&*;'
    const generatedPass = document.getElementById('generatedPassword');
    const utilizar = document.getElementById('utilizar');


let char;
generatePass = '';


for (let i = 1; i < 9; i++) {

        char = Math.floor(Math.random() * caracteres.length + 1 );

        generatePass += caracteres.charAt(char);

    }

    console.log(generatePass)
utilizar.style='display:flex'
generatedPass.innerHTML=generatePass



}

function utilizarP(){

password.value=generatePass;
Repassword.value=generatePass;
}

