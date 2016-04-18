var GridComponent = React.createFactory(require('./gridComponent'));

var ClientDataWidgetComponent = React.createFactory(require('./widgetClientDataComponent'));
var ContactDataWidgetComponent = React.createFactory(require('./widgetContactDataComponent'));

module.exports = React.createClass ({
    displayName : 'Page Accounts',

    getInitialState : function () {
        return {
            show: false
        }
    },

    buildContent : function () {
        this.w1 = this.w1 || ContactDataWidgetComponent({main: this.props.main});
        this.addWidget('contact-data', {content: this.w1}, { tablet: { column: 1, height: 7 }, desktop: { column: 1, width: 1, height: 7 }});
        this.w2 = this.w2 || ContactDataWidgetComponent({main: this.props.main});
        this.addWidget('contact-data-2', {content: this.w2}, { tablet: { column: 1, height: 7 }, desktop: { column: 1, width: 1, height: 7 }});
        this.w3 = this.w3 || ClientDataWidgetComponent({main: this.props.main});
        this.addWidget('client-data', {content: this.w3}, { tablet: { column: 2, height: 4 }, desktop: { column: 2, width: 2, height: 4 }});
        this.refs['grid'].forceUpdate();
    },

    addWidget : function (name, properties, defaults) {
        this.refs['grid'].addWidget(name, properties, defaults);
    },

    getLayouts: function () {
        return this.refs['grid'].getLayouts();
    },

    render : function () {
        this.grid = this.grid || GridComponent({key: 'grid', ref: 'grid', main: this.props.main});

        var cssPage = 'page';
        if (!this.state.show) cssPage += ' hidden';

        return (
            <div id="page-accounts" className={cssPage}>
                {this.grid}
            </div>
        )
    }
});