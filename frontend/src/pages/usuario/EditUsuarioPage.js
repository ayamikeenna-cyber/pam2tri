import './EditUsuarioPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { getUsuarioById, updateUsuario } from '../../shared/api.js';

const pageName = 'Editar Usuario';

class EditUsuarioPage extends HTMLElement {
    async connectedCallback() {
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
                    <ion-select name="perfil" label="Perfil" label-placement="floating">
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

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            await this.loadUsuario(id);
        } else {
            toast('ID do usuário não encontrado!');
            document.querySelector('ion-router').push('/usuario/list', 'back');
        }

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
                id: parseInt(id),
                nome,
                usuario,
                senha,
                perfil: parseInt(perfil)
            };

            const loading = await showLoading('Atualizando usuário...');
            try {
                await updateUsuario(id, dados);
                toast('Usuário atualizado com sucesso!', 'success');
                document.querySelector('ion-router').push('/usuario/list', 'back');
            } catch (err) {
                toast(err.message);
            } finally {
                await loading.dismiss();
            }
        });
    }

    async loadUsuario(id) {
        const loading = await showLoading('Carregando dados...');
        try {
            const usuario = await getUsuarioById(id);
            const form = this.querySelector('#form-usuario');
            
            form.querySelector('[name="nome"]').value = usuario.nome;
            form.querySelector('[name="usuario"]').value = usuario.usuario;
            form.querySelector('[name="senha"]').value = usuario.senha;
            form.querySelector('[name="perfil"]').value = usuario.perfil.toString();
        } catch (err) {
            toast(err.message);
        } finally {
            await loading.dismiss();
        }
    }
}

customElements.define('edit-usuario-page', EditUsuarioPage);
