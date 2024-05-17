function carregarPagina(redirecionar, raiz)
{
    if (localStorage.getItem('sekouPedeAgua') != null)
    {
        let sekouPedeAgua = JSON.parse(localStorage.getItem('sekouPedeAgua'));

        let acessoRestrito = document.querySelectorAll('.acessoRestrito');
        for (let i=0; i< acessoRestrito.length; i++)
        {
            acessoRestrito[i].style.display = 'inline';
            acessoRestrito[i].style.cursor = 'pointer';
        }

        document.getElementById('loginLogof').innerHTML = `Sair (${sekouPedeAgua.user.name })`;

    } else {
        if (redirecionar)
            window.location.href = `${(raiz? '':'.')}./view/login.html`; 
    }
}

function LimparCampos()
{
    let lsCampos = document.querySelectorAll('.input-validate');

    for (let i=0; i< lsCampos.length; i++)
    {
        let id = lsCampos[i].classList[0];
        document.getElementById(id).value = '';
    }
    document.getElementById('loader').style.display = 'none';
}