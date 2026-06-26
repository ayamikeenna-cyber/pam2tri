import './EditComandaPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { getComandaById, updateComanda } from '../../shared/api.js';

const pageName = 'Editar Comanda';

class EditComandaPage extends HTMLElement {
    async connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content class="ion-padding">
                <form id="form-comanda">
                <ion-list>
                    <ion-item>
                    <ion-input type="number" name="id_mesa" label="Mesa" label-placement="floating" required></ion-input>
                    </ion-item>
                    
                    <ion-item>
                    <ion-input type="text" name="observacao" label="Observação" label-placement="floating"></ion-input>
                    </ion-item>
                    
                    <ion-item>
                    <ion-select name="status" label="Status" label-placement="floating">
                        <ion-select-option value="1">Aberta</ion-select-option>
                        <ion-select-option value="0">Fechada</ion-select-option>
                    </ion-select>
                    </ion-item>
                </ion-list>

                <div class="ion-padding">
                    <ion-button expand="block" type="submit" class="ion-margin-top">
                    <ion-icon name="checkmark-circle" slot="start" style="margin-right: 8px;"></ion-icon>
                    Salvar Comanda
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
            await this.loadComanda(id);
        } else {
            toast('ID da comanda não encontrado!');
            document.querySelector('ion-router').push('/comanda/list', 'back');
        }

        this.querySelector('#form-comanda').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id_mesa = this.querySelector('[name="id_mesa"]').value;
            const observacao = this.querySelector('[name="observacao"]').value;
            const status = this.querySelector('[name="status"]').value;

            if (!id_mesa) {
                toast('Por favor, informe a mesa!');
                return;
            }

            const dados = {
                id_mesa: parseInt(id_mesa),
                observacao: observacao || "",
                status: parseInt(status) === 1
            };

            const loading = await showLoading('Atualizando comanda...');
            try {
                await updateComanda(id, dados);
                toast('Comanda atualizada com sucesso!', 'success');
                document.querySelector('ion-router').push('/comanda/list', 'back');
            } catch (err) {
                toast(err.message);
            } finally {
                await loading.dismiss();
            }
        });
    }

    async loadComanda(id) {
        const loading = await showLoading('Carregando dados...');
        try {
            const comanda = await getComandaById(id);
            const form = this.querySelector('#form-comanda');
            
            form.querySelector('[name="id_mesa"]').value = comanda.id_mesa;
            form.querySelector('[name="observacao"]').value = comanda.observacao || "";
            form.querySelector('[name="status"]').value = comanda.status ? '1' : '0';
        } catch (err) {
            toast(err.message);
        } finally {
            await loading.dismiss();
        }
    }
}

customElements.define('edit-comanda-page', EditComandaPage);
