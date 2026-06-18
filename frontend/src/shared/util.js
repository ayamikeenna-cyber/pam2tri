import { logout as authLogout } from './auth.js';

export function logout() {
    authLogout();
    const login_url = document.querySelector('ion-router')?.useHash ?? true;
    window.location.href = login_url == true ? '#/login' : '/login';
}

export async function toast(mensagem, color = 'danger') {
    const toast = document.createElement('ion-toast');
    toast.message = mensagem;
    toast.color = color;
    toast.duration = 2000;
    toast.position = 'bottom';

    document.body.appendChild(toast);
    return toast.present();
}
