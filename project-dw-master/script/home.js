const url = 'https://go-wash-api.onrender.com/api/auth/address/';
const storage = JSON.parse(localStorage.getItem('sekouPedeAgua'));
let loader = document.getElementById('loader');

carregarPagina(true, false);

listarEnderecos();

async function listarEnderecos(){  
    
    loader.style.display = 'block';
 
    let resposta = await fetch(url,{
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ storage.access_token,
        }        
    });

    if (resposta.status == 200)
    {
        let data = await resposta.json();

        let itens = `<thead>
                        <tr style="background-color: #778899;color:white;">
                            <th>Título</th>
                            <th>CEP</th>
                            <th>Endereço</th>
                            <th>Número</th>
                            <th>Complemento</th>
                            <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>`;
            for (i=0; i< data.data.length; i++ )
            {
            itens +=   `<tr ${i % 2?'style="background-color: E6E6FA;"':''} >
                        <td>${data.data[i].title}</td>
                        <td>${data.data[i].cep}</td>
                        <td>${data.data[i].address}</td>
                        <td>${data.data[i].number}</td>
                        <td>${data.data[i].complement  == null? '':data.data[i].complement }</td>
                        <td> <input type='button' class='btnExcluir' value='Excluir' onclick=Excluir('${data.data[i].id}') >
                            <input type='button' class='btnEditar' value='Editar' onclick=Editar('${data.data[i].id}')> </td>
                    </tr>`;
            }
            document.getElementById('lsEnderecos').innerHTML = itens + '</tbody>';
    } 
    else 
    {
        if (resposta.status >= 500)        
            alert('Ocorreu um erro no servidor remoto, tente novamente mais tarde.');   
        else alert('Ocorreu um erro no processamento do computador local, contate o desenvolvedor.');
    }   
    loader.style.display = 'none'; 
}


async function Excluir(id)
{
    if (confirm('Tem certeza que deseja excluir esse endereço?'))
    {
        loader.style.display = 'block';
     
        let resposta = await fetch(url + id,{
            method:"DELETE",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ storage.access_token,
            }        
        });
    
        if (resposta.status == 200)
        {
            window.location.href = "../view/home.html";
        } else 
        {
            let data = await resposta.json();
            alert(data.data.errors);
        }
    }
}

async function Editar(id){
    window.location.href= "./endereco.html" + (id > 0? `?id=${id}`:'');
} 
