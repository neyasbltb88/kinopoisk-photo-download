import decrypter from './decrypter';
window.decrypter = decrypter;

export default class PageParser {
    constructor() {

    }

    async parse(url) {
        let doc = null;
        if (url && typeof url === 'string') {
            doc = await this.loadPage(url);
        } else {
            doc = document;
        }

        return this.findScripts(doc);
    }

    async loadPage(url) {
        let res = await fetch(url).then(res => res.text());
        let parser = new DOMParser();
        return parser.parseFromString(res, 'text/html');
    }

    async findScripts(doc) {
        let scripts = Array.from(doc.querySelectorAll('script:not([src])'));
        scripts = scripts.map(script => {
            return script.textContent;
        });
        scripts = scripts.filter(text => {
            let res = text.length ? true : false;
            return res;
        });

        return this.decryptScripts(scripts);
    }

    async decryptScripts(script_array) {
        // https://regex101.com/r/hhXJ3S/3
        const regex = /atob\('(.*)'\),[ ]{0,}'(.*)'\)\)\)\;/im;

        script_array = script_array.map((script, i) => {
            let encripted = script.match(regex);

            if (encripted !== null && (encripted[1] && encripted[2])) {
                return decodeURIComponent((decrypter(atob(encripted[1]), encripted[2])));
            } else {
                return;
            }
        });

        script_array = script_array.filter(text => {
            return text ? true : false;
        });

        return this.findWallpapers(script_array);
    }

    async findWallpapers(script_array) {
        // https://regex101.com/r/hhXJ3S/2
        const regex = /var wallpapers = (.*);/i;

        let res = false;

        script_array.forEach(script => {
            let match = script.match(regex);
            if (match instanceof Array && match[1]) {
                res = JSON.parse(match[1]);
            }
        });

        return this.obj2arr(res);
    }

    async obj2arr(wallpapers) {
        if (wallpapers === false) return false;

        let arr = [];

        for (let item in wallpapers) {
            arr.push(wallpapers[item]);
        }

        return arr;
    }


}