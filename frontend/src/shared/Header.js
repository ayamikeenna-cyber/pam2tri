// UTIL
import { logout } from './util.js';

const createAndInjectionMenu = () => {
    if (document.querySelector('ion-menu'))
        return

    const mainContent = document.querySelector('ion-nav');
    const contentId = 'main-content';

    mainContent.id = contentId;

    const menu = document.createElement('ion-menu');
    menu.contentId = contentId;

    menu.innerHTML = `
        <ion-header>
            <ion-toolbar color='secondary'>
                <ion-title>Menu</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-item button class="menu-item" data-url="/home">
                    <ion-label>Home</ion-label>
                </ion-item>
                <ion-item button class="menu-item" data-url="/produto/list">
                    <ion-label>Produtos</ion-label>
                </ion-item>
                <ion-item button class="menu-item" data-url="/usuario/list">
                    <ion-label>Usuários</ion-label>
                </ion-item>
                 <ion-item button class="menu-item" data-url="/mesa">
                    <ion-label>Mesa</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    `;

    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', async () => {
            const url = item.dataset.url;
            const nav = document.querySelector('ion-nav');

            const routeMap = {
                '/home': 'home-page',
                '/produto/list': 'list-produto-page',
                '/usuario/list': 'list-usuario-page',
                '/mesa': 'list-mesa-page'
            };

            const component = routeMap[url];
            if (nav && component)
                nav.push(component, {}, 'root');

            await menu.close();
        })
    });

    document.body.prepend(menu);

}

export function createHeader(pageName) {
    // Validar se não é página de login
    if (pageName !== 'Login')
        createAndInjectionMenu();

    const logoutButtonHtml = pageName !== 'Login' ?
    `<ion-buttons slot="end">
        <ion-button id="logout-btn">
            <ion-icon name="log-out-outline" slot="icon-only">
            </ion-icon>
        </ion-button>
    </ion-buttons>` :  ""

    const start = pageName !== 'Login' ? 
    `<ion-buttons slot='start'>
        <ion-menu-button></ion-menu-button>
    </ion-buttons>` :
    `<ion-icon name="cafe" style="margin-left: 15px; font-size: 24px;"
    slot="start"></ion-icon>`
    
    return `
        <ion-header>
            <ion-toolbar color="secondary">
                ${start}
                <ion-title>Quero Café Bar - ${pageName}</ion-title>
                ${logoutButtonHtml}
            </ion-toolbar>
        </ion-header>
    `;
}