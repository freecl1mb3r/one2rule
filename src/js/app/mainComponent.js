var PageDashboard = React.createFactory(require('./pageDashboard'));
var PageAccounts = React.createFactory(require('./pageAccounts'));

var StatusComponent = React.createFactory(require('./statusComponent'));
var MenuComponent = React.createFactory(require('./menuComponent'));

window.app.enums.viewModes = {
   desktop : 'desktop',
   tablet : 'tablet',
   mobile : 'mobile'
},

module.exports = React.createClass ({
    displayName : 'Main Component',

    getInitialState : function () {
        return {
            viewMode: window.app.enums.viewModes.tablet,
            widgetsCreated: false
        };
    },

    componentDidUpdate : function () {
    },

    getEditor : function (props, editor) {
        switch (editor) {
            case 'dropdown':
                return null;
            default:
                return (
                    <input type="text" className="data-field-editor" value={props.value} onChange={props.onChange} onMouseDown={props.onEditMouseDown} onKeyUp={props.onKeyUp} />
                )
        }
    },

    addWidget : function (name, properties, gridData) {
        this.refs['grid'].addWidget(name, properties, gridData);
    },

    setViewMode : function (mode) {
        var e = window.app.enums.viewModes;
        if (mode == e.desktop || mode == e.tablet || mode == e.mobile)
            this.setState({viewMode: mode});
            this.refs['status'].applyViewMode(mode);
            this.refs['pageDashboard'].forceUpdate();
            this.refs['pageAccounts'].forceUpdate();
            /*this.refs['status'].forceUpdate();*/
    },

    selectPage : function (page) {
        if (window.app.selectedPage != page) {
            this.refs[window.app.selectedPage].setState({show: false});
            this.refs[page].setState({show: true});
            window.app.selectedPage = page;
            window.setTimeout(function () {
                $(window).resize();
            }, 1000);
        }
    },

    buildContent : function () {
        this.refs['pageDashboard'].buildContent();
        this.refs['pageAccounts'].buildContent();
        this.setViewMode(window.app.enums.viewModes.tablet);
    },

    onClick : function () {
        this.refs['menu'].hide();
    },

    render : function () {
        this.pageDashboard = this.pageDashboard || PageDashboard({key: 'pageDashboard', ref: 'pageDashboard', main: this});
        this.pageAccounts = this.pageAccounts || PageAccounts({key: 'pageAccounts', ref: 'pageAccounts', main: this});

        this.status = this.status || StatusComponent({key: 'status', ref: 'status', main: this});
        this.menu = this.menu || MenuComponent({key: 'menu', ref: 'menu', main: this});

        return (
            <div id="main" onClick={this.onClick}>
                <div id="pages-holder" className="pages">
                    {this.pageDashboard}
                    {this.pageAccounts}
                </div>
                {this.status}
                {this.menu}
            </div>
        );
    }
});