const url = 'https://go-wash-api.onrender.com/api/login';
const formLogin = document.getElementById('frmLogin');

let email = document.getElementById('input-email');
let senha = document.getElementById('input-senha');
let loader = document.getElementById('loader');
let msgErro = document.getElementById('msgErro');

localStorage.removeItem('sekouPedeAgua');

function Limpar()
{
    email.value = '';
    senha.value = '';
    email.focus();
    loader.style.display = 'none';
}

async function login(){

    loader.style.display = 'block';
    msgErro.innerHTML = '';

    if (login.value === '' || senha.value === '')
    {
        msgErro.innerHTML = 'Preencha o E-mail e Senha';
        return false;
    }

    let resposta = await fetch(url,{
        method:"POST",
        body: JSON.stringify ({
            "email": email.value,
            "password":senha.value,
            "user_type_id":1
            }),
            headers:{
                'Content-Type': 'application/json',
            }        
    });
   
    if (resposta.status == 200)
    {     
        data = await resposta.json();
  
        localStorage.setItem('sekouPedeAgua', JSON.stringify(data));

        window.location.href = "../view/home.html";
    } else 
    {
        data = await resposta.json();
        
        msgErro.innerHTML = data.data.errors;
        Limpar();
    }   
}

formLogin.addEventListener('submit', function(e){
    e.preventDefault();
    login();  
});