const BASE_URL = 'http://localhost:3000';

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Erro na requisição');
    }

    return res.json();
}

export async function login(usuario, senha) {
    return request('/usuario/login', {
        method: 'POST',
        body: JSON.stringify({ usuario, senha }),
    });
}

export async function getUsuarios() {
    return request('/usuario');
}

export async function getUsuarioById(id) {
    return request(`/usuario/${id}`);
}

export async function createUsuario(usuario) {
    return request('/usuario', {
        method: 'POST',
        body: JSON.stringify(usuario),
    });
}

export async function updateUsuario(id, usuario) {
    return request(`/usuario/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(usuario),
    });
}

export async function deleteUsuario(id) {
    return request(`/usuario/${id}`, {
        method: 'DELETE',
    });
}

export async function getMesas() {
    return request('/mesa');
}

export async function getMesaById(id) {
    return request(`/mesa/${id}`);
}

export async function createMesa(mesa) {
    return request('/mesa', {
        method: 'POST',
        body: JSON.stringify(mesa),
    });
}

export async function updateMesa(id, mesa) {
    return request(`/mesa/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(mesa),
    });
}

export async function deleteMesa(id) {
    return request(`/mesa/${id}`, {
        method: 'DELETE',
    });
}

export async function getComandas() {
    return request('/comanda');
}

export async function getComandaById(id) {
    return request(`/comanda/${id}`);
}

export async function getComandaByMesa(idMesa) {
    return request(`/comanda/mesa/${idMesa}`);
}

export async function createComanda(comanda) {
    return request('/comanda', {
        method: 'POST',
        body: JSON.stringify(comanda),
    });
}

export async function updateComanda(id, comanda) {
    return request(`/comanda/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(comanda),
    });
}

export async function deleteComanda(id) {
    return request(`/comanda/${id}`, {
        method: 'DELETE',
    });
}

export async function getProdutos() {
    return request('/produto');
}

export async function getProdutoById(id) {
    return request(`/produto/${id}`);
}

export async function createProduto(produto) {
    return request('/produto', {
        method: 'POST',
        body: JSON.stringify(produto),
    });
}

export async function updateProduto(id, produto) {
    return request(`/produto/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(produto),
    });
}

export async function deleteProduto(id) {
    return request(`/produto/${id}`, {
        method: 'DELETE',
    });
}

export function getToken() {
    return localStorage.getItem('access_token');
}

export function setToken(token) {
    localStorage.setItem('access_token', token);
}

export function clearToken() {
    localStorage.removeItem('access_token');
}
