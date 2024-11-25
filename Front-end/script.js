const apiUrl = 'http://localhost:8081/api/produtos'; // URL do backend

// Função para carregar todos os produtos
async function loadProducts() {
    try {
        const response = await fetch(apiUrl);
        const produtos = await response.json();
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Limpa a lista

        produtos.forEach(produto => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between');
            li.innerHTML = `
                <span>ID: ${produto.id} - Nome: ${produto.nome} - R$ ${produto.preco} - ${produto.quantidade} unidades - ${produto.categoria}</span>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${produto.id})">Excluir</button>
                <button class="btn btn-sm btn-warning" onclick="editProduct(${produto.id})">Editar</button>
            `;
            productList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
    }
}

// Função para adicionar ou atualizar um produto
document.getElementById('produtoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('produtoId').value;
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const quantidade = document.getElementById('quantidade').value;
    const categoria = document.getElementById('categoria').value; // Pega o valor do select

    const produto = { nome, preco, quantidade, categoria };

    try {
        if (id) {
            // Atualizar produto
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto),
            });
        } else {
            // Criar novo produto
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto),
            });
        }

        document.getElementById('produtoForm').reset();
        document.getElementById('produtoId').value = '';
        loadProducts(); // Recarrega a lista de produtos
    } catch (error) {
        console.error('Erro ao salvar o produto:', error);
    }
});

// Função para excluir produto
async function deleteProduct(id) {
    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        loadProducts();
    } catch (error) {
        console.error('Erro ao excluir o produto:', error);
    }
}

// Função para editar um produto
async function editProduct(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        const produto = await response.json();

        document.getElementById('produtoId').value = produto.id;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('preco').value = produto.preco;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('categoria').value = produto.categoria;

        // Redireciona para o formulário de edição
        document.getElementById('formPage').classList.remove('hidden');
        document.getElementById('productListPage').classList.add('hidden');
    } catch (error) {
        console.error('Erro ao carregar os detalhes do produto para edição:', error);
    }
}

// Função para consultar produto por ID
async function getProductDetailsById() {
    const productId = document.getElementById('productIdQuery').value.trim();
    if (!productId) {
        alert("Por favor, insira o ID do produto!");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${productId}`);
        
        if (response.ok) {
            const produto = await response.json();
            const detailsContainer = document.getElementById('productDetails');
            detailsContainer.innerHTML = `
                <h5>Detalhes do Produto:</h5>
                <p><strong>ID:</strong> ${produto.id}</p>
                <p><strong>Nome:</strong> ${produto.nome}</p>
                <p><strong>Preço:</strong> R$ ${produto.preco}</p>
                <p><strong>Quantidade:</strong> ${produto.quantidade} unidades</p>
                <p><strong>Categoria:</strong> ${produto.categoria}</p>
            `;
        } else {
            document.getElementById('productDetails').innerHTML = 'Produto não encontrado!';
        }
    } catch (error) {
        console.error('Erro ao consultar o produto por ID:', error);
    }
}

// Função para voltar à tela inicial
function goBack() {
    document.getElementById('productListPage').classList.add('hidden');
    document.getElementById('productByIdPage').classList.add('hidden');
    document.getElementById('formPage').classList.remove('hidden');
}

// Função para exibir a tela de listagem de produtos
function showProductList() {
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('productListPage').classList.remove('hidden');
    loadProducts();
}

// Função para exibir a tela de consulta por ID
function showProductByIdForm() {
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('productByIdPage').classList.remove('hidden');
}
