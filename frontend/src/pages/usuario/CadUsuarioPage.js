import './CadUsuarioPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { createUsuario } from '../../shared/api.js';

const pageName = 'Cadastrar Usuario';

class CadUsuarioPage extends HTMLElement {
    connectedCallback() {
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
        this.querySelector('#btn-cancelar').addEventListener('click', () => window.history.back());

        this.querySelector('#form-usuario').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = this.querySelector('[name="nome"]').value;
            const usuario = this.querySelector('[name="usuario"]').value;
            const senha = this.querySelector('[name="senha"]').value;
            const perfil = this.querySelector('[name="perfil"]').value;

            if (!nome || !usuario || !senha) {
                toast('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            const dados = {
                nome,
                usuario,
                senha,
                perfil: parseInt(perfil)
            };

            const loading = await showLoading('Salvando usuário...');
            try {
                await createUsuario(dados);
                toast('Usuário cadastrado com sucesso!', 'success');
                document.querySelector('ion-router').push('/usuario/list', 'back');
            } catch (err) {
                toast(err.message);
            } finally {
                await loading.dismiss();
            }
        });
    }
}

customElements.define('cad-usuario-page', CadUsuarioPage);
