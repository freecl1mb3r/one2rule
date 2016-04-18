var test = require('../common/common');
//var test = require('../test/test');
//var reactGridLayout = require('../jsbower/react-grid-layout/dist/react-grid-layout.min');

var ClientDataWidgetComponent = React.createFactory(require('./widgetClientDataComponent'));
var ContactDataWidgetComponent = React.createFactory(require('./widgetContactDataComponent'));


//-----------------------------------------------------------#
// Data objects (person with contact and address data, phone book, history, call reasons etc...)
window.app.data = { // Here some classes will probably be prepared where appropriate
    personAndContact: {
        setFieldValue: function (fieldName, fieldValue) {
            var d = window.app.data.personAndContact;
            d.fields[fieldName] = fieldValue;
        },
        fields: {},
        contacts: [],
        addresses: [],
    },
    phonebook: {
        list: []
    },
    history: {
        list: []
    },
    callreasons: {
        list: []
    }
};
window.app.selectedPage = 'pageDashboard';
//-----------------------------------------------------------#

//-----------------------------------------------------------#
// Main component
var mainComponent = React.createFactory(require('./mainComponent'));
//-----------------------------------------------------------#

//-----------------------#
// DOM Ready
//-----------------------#
$( () => {
    window.app.main = ReactDOM.render(mainComponent(), document.getElementById('main-holder'));
    window.app.main.buildContent();

    /*
    // Add Widgets
    var content = null;

    content = ContactDataWidgetComponent({main: window.app.main});
    window.app.main.addWidget('contact-data', {content: content}, { tablet: { column: 1, height: 7 }, desktop: { column: 1, width: 1, height: 7 }});
    content = ContactDataWidgetComponent({main: window.app.main});
    window.app.main.addWidget('contact-data-2', {content: content}, { tablet: { column: 1, height: 7 }, desktop: { column: 1, width: 1, height: 7 }});
    content = ClientDataWidgetComponent({main: window.app.main});
    window.app.main.addWidget('client-data', {content: content}, { tablet: { column: 2, height: 4 }, desktop: { column: 2, width: 2, height: 4 }});
    */
});

