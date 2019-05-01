import Breadcrumbs from './breadcrumbs';
import launcher from './launcher';
import PageParser from './page_parser';
import downloader from 'downloadjs';


window.pageParser = new PageParser();

export default class PhotoDownload {
    constructor() {
        this.photo_id_selector = '.js-rum-hero.fotos td > a';
        this.wallpapers = [];
        this.loaded = 0;
        this.url_template = 'https://www.kinopoisk.ru/picture/{id}/';

        this.launcher = launcher.bind(this);
        this.pageParser = new PageParser();
        this.downloader = downloader;
        this.breadcrumbs = new Breadcrumbs({
            photoDownload: this,
            container: 'ul.breadcrumbs',
        });
    }

    async albumFindPhoto() {
        try {
            let photo_href = document.querySelector(this.photo_id_selector).href;

            if (photo_href) this.wallpapers = await this.pageParser.parse(photo_href);
            if (this.wallpapers.length) {
                this.breadcrumbs.setAmount(`(${this.wallpapers.length})`);
            } else {
                throw new Error('Не удалось получить url фотографий');
            }
        } catch (err) {
            this.breadcrumbs.clearBreadcrumbs();
        }
    }

    startLoader() {
        this.breadcrumbs.setState(true);
        this.breadcrumbs.setAmount('(0)');

        this.loaderLoop();
    }

    async loaderLoop() {
        if (this.loaded < this.wallpapers.length) {

            try {
                let url = this.wallpapers[this.loaded].image;
                let img = await fetch(url).then(res => res.blob());

                this.downloader(img, this.url2name(url), 'image/jpg');

                this.loaded++;
                this.breadcrumbs.setAmount(`(${this.loaded})`);
            } catch (error) {

            }
        } else {
            // Все скачены
        }

        requestAnimationFrame(async() => await this.loaderLoop());
    }

    url2name(url) {
        // https://regex101.com/r/JbJ6Y0/1
        const regex = /.*\/(.*\.\w{3,})/i;
        return url.match(regex)[1];
    }


    init() {
        console.log('%c%s', (window.log_color) ? window.log_color.blue : '', 'PhotoDownload init');

        this.launcher({
            condition: () => {
                return document.querySelector(this.photo_id_selector);
            },
            callback: this.albumFindPhoto,
            attempts: 100
        });
    }
}