const url = 'https://go-wash-api.onrender.com/api/user';
const frmCadastro = document.getElementById('frmCadastro');

let nome = document.getElementById('input-name');
let email = document.getElementById('input-email');
let senha = document.getElementById('input-senha');
let cnpj_cpf = document.getElementById('input-cpf');
let contrato = document.getElementById('input-contrato');
let nascimento = document.getElementById('input-dtNascimento');
let msgErro = document.getElementById('msgErro');
let loader = document.getElementById('loader');

carregarPagina(false, false);

function respostaAPIErros(valor)
{
    lsMsgs =   {
        "cpf_cnpj invalid": "CPF ou CNPJ inválido",
        "The email has already been taken.": "Email ja foi cadastrado por outro usuário. ",
        "The cpf cnpj has already been taken.": "CPF ou CNPJ ja foi cadastrado por outro usuário.",
        "The cpf cnpj field is required.": "CPF ou CNPJ são campos obrigatório"
    };

    if (lsMsgs.hasOwnProperty(valor))
        msgErro.innerHTML += "* " + lsMsgs[valor] + ' ';
    else msgErro.innerHTML += "* " + valor + ' ';
}

if (frmCadastro)
{
    frmCadastro.addEventListener('submit', function(e)
    {
        e.preventDefault();
        if (validarCampos())
            cadastroUsuario(); 
    });
}

async function cadastroUsuario(){   
    
    loader.style.display = 'block';

    let dados = {
        "name": nome.value,
        "email": email.value,
        "user_type_id": 1,
        "password": senha.value,
        "cpf_cnpj": cnpj_cpf.value.replace('.','').replace('-',''),
        "terms": contrato.value,
        "birthday": nascimento.value   
    };

        let resposta = await fetch(url,{
        method:"POST",
        body: JSON.stringify(dados),
        headers:{
        'Content-Type': 'application/json'
        }        
    });

    loader.style.display = 'none';

    if(resposta.status != 200){

        if (resposta.status == 500)
        {
            alert('Ocorreu um erro no servidor remoto, tente novamente mais tarde.');
            return;
        }

        data = await resposta.json();    

        if (typeof(data.data.errors) === 'string')
        {
            respostaAPIErros(data.data.errors);      
            return;      
        } 

        for (let campo in data.data.errors)
        {
            respostaAPIErros(data.data.errors[campo]);
        }
        return;
    }

    data = await resposta.json();

    alert(`Cadastro realizado com sucesso, ${data.data}`);
    window.location.href = "login.html";
}


function validarCampos() { 
    msgErro.innerHTML = '';
    obj = cnpj_cpf;

    if (nome.value.trim().length < 2)
        msgErro.innerHTML = "* Preencha o nome com no mínimo 2 caracteres. ";

    if (senha.value.trim().length < 6)
        msgErro.innerHTML += "* Preencha a senha com no mínimo 6 caracteres. ";

    //if (cnpj_cpf.value.trim().length < 11)
    //    msgErro.innerHTML += "* Preencha o CNJP/CPF com no mínimo 11 caracteres";

    if (nascimento.value.trim().length < 8)
        msgErro.innerHTML += "* Preencha a data de nascimento com no mínimo 8 caracteres. ";

    var s = (obj.value).replace(/\D/g, '');
    var tam = (s).length; // removendo os caracteres nãoo numéricos
    if (!(tam == 11 || tam == 14 || tam == 0)) { // validando o tamanho
        msgErro.innerHTML += '* Não é um CPF ou um CNPJ Válido. '
    }

    // se for CPF
    if (tam == 11) {
        if (!validaCPF(s)) { // chama a função que valida o CPF
            msgErro.innerHTML += '* Não é um CPF Válido. ';
        }
    }

    // se for CNPJ
    if (tam == 14) {
        if (!validaCNPJ(s)) { // chama a função que valida o CNPJ
            msgErro.innerHTML += '* Não é um CNPJ Válido. ';
        }
    }

    if (contrato.value != '1')
    {
        msgErro.innerHTML += '* É Necessário Aceitar o Contrato. ';
    }

    return (msgErro.innerHTML.length > 0? false: true);;
}

function validaCPF(s) {
    var c = s.substr(0, 9);
    var dv = s.substr(9, 2);
    var d1 = 0;
    for (var i = 0; i < 9; i++) {
        d1 += c.charAt(i) * (10 - i);
    }
    if (d1 == 0)
        return false;
    d1 = 11 - (d1 % 11);
    if (d1 > 9)
        d1 = 0;
    if (dv.charAt(0) != d1) {
        return false;
    }
    d1 *= 2;
    for (var i = 0; i < 9; i++) {
        d1 += c.charAt(i) * (11 - i);
    }
    d1 = 11 - (d1 % 11);
    if (d1 > 9)
        d1 = 0;
    if (dv.charAt(1) != d1) {
        return false;
    }
    return true;
}

function validaCNPJ(CNPJ) {
    var a = new Array();
    var b = new Number;
    var c = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (i = 0; i < 12; i++) {
        a[i] = CNPJ.charAt(i);
        b += a[i] * c[i + 1];
    }
    if ((x = b % 11) < 2) {
        a[12] = 0
    } else {
        a[12] = 11 - x
    }
    b = 0;
    for (y = 0; y < 13; y++) {
        b += (a[y] * c[y]);
    }
    if ((x = b % 11) < 2) {
        a[13] = 0;
    } else {
        a[13] = 11 - x;
    }
    if ((CNPJ.charAt(12) != a[12]) || (CNPJ.charAt(13) != a[13])) {
        return false;
    }
    return true;
}