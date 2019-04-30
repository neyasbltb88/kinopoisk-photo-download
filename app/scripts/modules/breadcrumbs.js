import launcher from './launcher';

export default class Breadcrumbs {
    constructor(params) {
        this.launcher = launcher.bind(this);
        this.photoDownload = params.photoDownload;

        this.container_selector = params.container;
        this.container = null;

        this.wrap = null;

        this.selectors = {
            item_sep: 'photo_download_breadcrumbs__item_sep',
            item: 'photo_download_breadcrumbs__item',
            download_btn: 'photo_download_download_btn',
            amount_elem: 'photo_download_breadcrumbs__count',
            state_text: 'photo_download_state_text',
        }

        this.launcher({
            condition: () => {
                return document.querySelector(this.container_selector);
            },
            callback: this.init,
            attempts: 100
        });
    }

    clearBreadcrumbs() {
        if (!this.container || !this.wrap) return false;

        this.container.removeChild(this.wrap);
    }

    setAmount(number) {
        if (!this.wrap || number === undefined) return false;

        let amount_elem = this.wrap.querySelector('.' + this.selectors.amount_elem);
        amount_elem.textContent = number;
    }

    setState(state) {
        if (!this.wrap) return false;

        let text = (state === true) ? 'Скачено: ' : 'Скачать';
        let state_text_elem = this.wrap.querySelector('.' + this.selectors.state_text);
        state_text_elem.textContent = text;
    }

    downloadItemHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.photoDownload.startLoader();


        return false;
    }

    appendDownloadItem() {
        this.wrap = document.createElement('div');
        this.wrap.innerHTML = /* html */ `<li class="breadcrumbs__item breadcrumbs__item_sep ${this.selectors.item_sep}">/</li>
            <li class="breadcrumbs__item ${this.selectors.item}" style="vertical-align: bottom; cursor: pointer;">
                <h1 class="breadcrumbs__head"  style="font-size: 0.75em !important;">
                    <span class="breadcrumbs__link ${this.selectors.download_btn}">
                        <span class="${this.selectors.state_text}">Скачать</span>
                        <span class="breadcrumbs__count ${this.selectors.amount_elem}"></span>
                    </span>
                </h1>
            </li>`;

        let download_btn = this.wrap.querySelector('.' + this.selectors.download_btn);
        download_btn.addEventListener('click', this.downloadItemHandler.bind(this));

        this.container.appendChild(this.wrap);
    }

    init() {
        console.log('%c%s', (window.log_color) ? window.log_color.blue : '', 'Breadcrumbs init');

        this.container = document.querySelector(this.container_selector);
        this.appendDownloadItem();

        this.photoDownload.init();
    }
}