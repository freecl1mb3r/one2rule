var GridComponent = React.createFactory(require('./gridComponent'));

var ContactDataWidgetComponent = React.createFactory(require('./widgetContactDataComponent'));

module.exports = React.createClass ({
    displayName : 'Page Dashboard',

    getInitialState : function () {
        return {
            show: true
        }
    },

    buildContent : function () {
        this.w1 = this.w1 || ContactDataWidgetComponent({main: this.props.main});
        this.addWidget('contact-data', {content: this.w1}, { tablet: { column: 1, height: 7 }, desktop: { column: 1, width: 1, height: 7 }});
        this.w2 = this.w2 || ContactDataWidgetComponent({main: this.props.main});
        this.addWidget('contact-data-2', {content: this.w2}, { tablet: { column: 1, height: 7 }, desktop: { column: 1, width: 1, height: 7 }});
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
            <div id="page-dashboard" className={cssPage}>
                {this.grid}
            </div>
        )
    }
});