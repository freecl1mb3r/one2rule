window.app = window.app || {};
window.app.locales = window.app.locales || {};
window.app.language = 'en';
window.app.enums = window.app.enums || {};

var app = window.app

window._ = function (str) {
    if (app.locales[app.language][str]) {
        return app.locales[app.language][str];
    } else {
        if (app.language == 'en' || !(app.locales[app.language][str])) {
            return str;
        } else {
            return '';
        }
    }
}
