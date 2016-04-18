var StatusComponent = React.createFactory(require('./statusComponent'));
var GridComponent = React.createFactory(require('./gridComponent'));
var MenuComponent = React.createFactory(require('./menuComponent'));

var ClientDataWidgetComponent = React.createFactory(require('./widgetClientDataComponent'));
var ContactDataWidgetComponent = React.createFactory(require('./widgetContactDataComponent'));

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
            this.refs['grid'].forceUpdate();
            /*this.refs['status'].forceUpdate();*/
    },

    componentDidMount : function () {
        this.setViewMode(window.app.enums.viewModes.tablet);
    },

    componentDidUpdate : function () {
    },

    onClick : function () {
        this.refs['menu'].hide();
    },

    render : function () {
        this.grid = this.grid || GridComponent({key: 'grid', ref: 'grid', main: this});
        this.status = this.status || StatusComponent({key: 'status', ref: 'status', main: this});
        this.menu = this.menu || MenuComponent({key: 'menu', ref: 'menu', main: this});

        return (
            <div id="main" onClick={this.onClick}>
                {this.grid}
                {this.status}
                {this.menu}
            </div>
        );
    }
});