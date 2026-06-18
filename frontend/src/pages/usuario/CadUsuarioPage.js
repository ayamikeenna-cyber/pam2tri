import './CadUsuarioPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast } from '../../shared/util.js';
import { isAuthenticated } from '../../shared/auth.js';
import { api } from '../../shared/api.js';

const pageName = 'Cadastrar Usuario';

class CadUsuarioPage extends HTMLElement {
    connectedCallback() {
        if (!isAuthenticated()) {
            document.querySelector('ion-router').push('/login', 'root');
            return;
        }
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content class="ion-padding">
                <form id="form-usuario">
                <ion-list>
                    <ion-item>
                    <ion-input type="text" name="nome" label="Nome Completo" label-placement="floating" required></ion-input>
                    </ion-item>

                    <ion-item>
                    <ion-input type="text" name="usuario" label="Usuário" label-placement="floating" required></ion-input>
                    </ion-item>

                    <ion-item>
                    <ion-input type="password" name="senha" label="Senha" label-placement="floating" required></ion-input>
                    </ion-item>

                    <ion-item>
                    <ion-select name="perfil" label="Perfil" label-placement="floating" value="1">
                        <ion-select-option value="0">Administrador</ion-select-option>
                        <ion-select-option value="1">Atendente</ion-select-option>
                    </ion-select>
                    </ion-item>
                </ion-list>

                <div class="ion-padding">
                    <ion-button expand="block" type="submit" class="ion-margin-top">
                    <ion-icon name="checkmark-circle" slot="start" style="margin-right: 8px;"></ion-icon>
                    Salvar Usuário
                    </ion-button>
                    <ion-button expand="block" color="danger" id="btn-cancelar">
                    <ion-icon name="close-circle" slot="start" style="margin-right: 8px;"></ion-icon>
                    Cancelar
                    </ion-button>
                </div>
                </form>
            </ion-content>
        `;
        this.querySelector('#logout-btn')
        .addEventListener('click', logout);
        this.querySelector('#btn-cancelar').addEventListener('click',
            
            () =>  window.history.back());

        const formUsuario = this.querySelector('#form-usuario');
        formUsuario.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(formUsuario);
            const userData = {};
            for (let [key, value] of formData.entries()) {
                userData[key] = value;
            }

            if (userData.perfil) {
                userData.perfil = parseInt(userData.perfil, 10);
            }

            const loading = document.createElement('ion-loading');
            loading.message = 'Salvando usuário...';
            document.body.appendChild(loading);
            await loading.present();

            try {
                await api.post('/usuario', userData);
                toast('Usuário salvo com sucesso!', 'success');
                document.querySelector('ion-router').push('/home', 'forward'); // Adjust as needed
            } catch (error) {
                console.error('Erro ao salvar usuário:', error);
                toast('Erro ao salvar usuário.', 'danger');
            } finally {
                await loading.dismiss();
            }
        });
    }
}

customElements.define('cad-usuario-page', CadUsuarioPage);