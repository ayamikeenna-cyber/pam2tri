import './CadComandaPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout, toast, showLoading } from '../../shared/util.js';
import { createComanda } from '../../shared/api.js';

const pageName = 'Abrir Comanda';

class CadComandaPage extends HTMLElement {
    connectedCallback() {
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
                </ion-list>

                <div class="ion-padding">
                    <ion-button expand="block" type="submit" class="ion-margin-top">
                    <ion-icon name="checkmark-circle" slot="start" style="margin-right: 8px;"></ion-icon>
                    Abrir Comanda
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

        this.querySelector('#form-comanda').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id_mesa = this.querySelector('[name="id_mesa"]').value;
            const observacao = this.querySelector('[name="observacao"]').value;

            if (!id_mesa) {
                toast('Por favor, informe a mesa!');
                return;
            }

            const dados = {
                id_mesa: parseInt(id_mesa),
                observacao: observacao || ""
            };

            const loading = await showLoading('Abrindo comanda...');
            try {
                await createComanda(dados);
                toast('Comanda aberta com sucesso!', 'success');
                document.querySelector('ion-router').push('/comanda/list', 'back');
            } catch (err) {
                toast(err.message);
            } finally {
                await loading.dismiss();
            }
        });
    }
}

customElements.define('cad-comanda-page', CadComandaPage);
