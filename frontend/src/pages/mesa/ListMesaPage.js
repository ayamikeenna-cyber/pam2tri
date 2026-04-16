import './ListMesaPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout } from '../../shared/util.js';

const pageName = 'Mesa';

class ListMesaPage extends HTMLElement {
    connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content>
                <div class="list-mesa"></div>
            </ion-content>
        `;
        this.querySelector('#logout-btn')
        .addEventListener('click', logout);

        // buscando os mesas
    
        const mesa = this.fetchmesas() || [];
        
        // renderizando os mesas no HTML
        this.renderMesa(mesas);
    }

    fetchMesa() {
        return [
            {
                "id": 1,
                "qtd_cadeiras": 4,
            },
            {
                "id": 2,
                "qtd_cadeiras": 6,
            },
            {
                "id": 3,
                "qtd_cadeiras": 8,
            }
        ]
    }

    renderMesa(mesa) {
        const container = this.querySelector(".list-mesa");

        // SE Mesa VAZIO, MOSTRAR MENSAGEM AO USUÁRIO
        if (mesas.length === 0) {
            container.innerHTML = '<p> Nenhuma mesa encontrada </p>'
            return;
        }

        // FORMATANDO VALORES EM REAIS
        const formatMoeda = (value) => {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        
        
        const mesaItems = mesa.map(mesa => `
            <ion-item>
                <ion-label>
                    <h2 style="display: flex; align-items: center; gap: 8px;">
                        <ion-icon
                            name="${mesa.status ? 'checkmark-circle' : 'close-circle'}"
                            color="${mesa.status ? 'success' : 'danger'}"
                            style="flex-shrink: 0;"
                        ></ion-icon>
                        <span>${mesa.dsc_mesa}</span>
                    </h2>
                    <p>${formatMoeda(mesa.qtd_cadeiras)}</p>
                </ion-label>

                <ion-buttons slot="end">
                    <ion-button fill="clear" class="btn-edit" data-id="${mesa.id}">
                        <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" color="danger" class="btn-delete" data-id="${mesa.id}">
                        <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-item>`).join('');
    
        container.innerHTML = `<ion-list>${mesaItems}</ion-list>`;
    }

}

customElements.define('list-mesa-page', ListMesaPage);