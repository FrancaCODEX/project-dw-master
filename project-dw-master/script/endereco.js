const url = 'https://go-wash-api.onrender.com/api/auth/address/';
const urlCEP = 'https://viacep.com.br/ws/';
const frmEndereco = document.getElementById('frmEndereco');

let id = document.getElementById('id');
let titulo = document.getElementById('titulo');
let cep = document.getElementById('cep');
let endereco = document.getElementById('endereco');
let numero = document.getElementById('numero');
let complemento = document.getElementById('complemento');
let msgErro = document.getElementById('msgErro');
let loader = document.getElementById('loader');

carregarPagina(true, false);

const params = new URLSearchParams(window.location.search); 
const id_ = params.get('id');
abrirEndereco(id_);

async function abrirEndereco(id_){  
    debugger
    let sekouPedeAgua = JSON.parse(localStorage.getItem('sekouPedeAgua'));

    if (id_ != null)
    {
        loader.style.display = 'block';
        id.value = id_;

        let resposta = await fetch(url + id_ ,{
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ sekouPedeAgua.access_token,
            }        
        });

        let data = await resposta.json();

        if (data.data.id != undefined)
        {
            titulo.value = data.data.title;
            cep.value = data.data.cep;
            endereco.value = data.data.address;
            numero.value = data.data.number;
            complemento.value = data.data.complement;
            loader.style.display = 'none';

        } else {
            alert('Não foi possível buscar dados requerido.');
            window.location.href = "./home.html";
        }
    }
}

function validarCampos()
{
    msgErro.innerHTML = "";
    if (titulo.value.trim().length < 2)
        msgErro.innerHTML = "* Preencha o título com no mínimo 2 caracteres. ";

    if (cep.value.trim().length < 8)
        msgErro.innerHTML += "* Preencha o cep com no mínimo 8 caracteres. ";

    if (endereco.value.trim().length < 3)
        msgErro.innerHTML += "* Preencha o Endereço com no mínimo 3 caracteres. ";

    if (numero.value.trim().length == 0 )
        msgErro.innerHTML += "* Preencha o número com no mínimo 1 caracter. ";

    return (msgErro.innerHTML.length > 0? false: true);
}

frmEndereco.addEventListener('submit', function(e)
{
    e.preventDefault();
    if (validarCampos())
        salvarEndereco();
});

//let cep = document.getElementById('cep');
cep.addEventListener('change', function()
{
    buscarCep();
});

async function salvarEndereco(){       

    let sekouPedeAgua = JSON.parse(localStorage.getItem('sekouPedeAgua'));

    loader.style.display = 'block';

    let resposta = await fetch(url + id.value, {
        method:"POST",
        body: JSON.stringify ({
            "title": titulo.value,
            "cep": cep.value,
            "address": endereco.value,
            "number": numero.value,
            "complement": complemento.value
        }),
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ sekouPedeAgua.access_token,
        }        
    });

    if (resposta.status == 200)
    {
        window.location.href = "../view/home.html";
    } else 
    {
        if (resposta.status >= 500)        
            alert('Ocorreu um erro no servidor remoto, tente novamente mais tarde.');   
        else 
        {
            data = await resposta.json();

            alert(data.data.errors);

            titulo.value = '';
            cep.value = '';
            endereco.value = '';
            numero.value = '';
            complemento.value = '';

            titulo.focus();
            loader.style.display = 'none';
        }        
    }  
    loader.style.display = 'none'; 
}

const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
function validarCEP(cep) {
    return cepRegex.test(cep);
}

async function buscarCep()
{
    msgErro.innerHTML = '';
    
    if (!validarCEP(cep.value))
    {
        msgErro.innerHTML = `CEP inválido, verifique o número digitado e tente novamente`;
        cep.focus();
        return;
    }        
    loader.style.display = 'block';

    let resposta = await fetch(urlCEP + cep.value + '/json/',{
        method:"GET",
        headers:{
        'Content-Type': 'application/json'
        }
    });  

    if (resposta.status == 200)
    {
        data = await resposta.json();
        if (data.cep != undefined)
        {
            cep.value = data.cep;
            endereco.value = data.logradouro;
            numero.focus();
        } else 
        {
            cep.value = '';
            endereco.value = '';        
        }
    } else 
    {
        if (resposta.status >= 500)
        {
            alert('Ocorreu um erro no servidor remoto, tente novamente mais tarde.');
            return;
        } else 
        
        //if (resposta.status >= 400)
        {
            alert('Ocorreu um erro no processamento do computador local, contate o administrador do sistema.');
            //return;
        }
    }
    loader.style.display = 'none';
}
