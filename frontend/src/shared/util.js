import { clearToken } from './api.js';

export async function toast(mensagem, color = 'danger') {
    const toast = document.createElement('ion-toast');
    toast.message = mensagem;
    toast.color = color;
    toast.duration = 2000;
    toast.position = 'bottom';

    document.body.appendChild(toast);
    await toast.present();
}

export async function showLoading(message = 'Carregando...') {
    const loading = document.createElement('ion-loading');
    loading.message = message;
    document.body.appendChild(loading);
    await loading.present();
    return loading;
}

export function logout() {
    clearToken();
    const login_url = document.querySelector('ion-router')?.useHash ?? true;
    window.location.href = login_url == true ? '#/login' : '/login';
}
