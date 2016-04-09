var DataFieldComponent = React.createFactory(require('./dataFieldComponent'));

module.exports = React.createClass ({
    displayName : 'Contact Data Widget Component',

    getInitialState : function () {
        return {
            fields: [
                {name: 'dfCALLEDTELNUM', icon: 'icon-interface-loginentercopy2', value: '030600609', editAllowed: false, editor: 'text'},
                {name: 'dfCAMPAIGN', icon: 'icon-CallCircle', value: 'Info', editAllowed: false, editor: 'text'},
                {name: 'dfCALLTYPE', icon: 'icon-Communication', value: 'Call', editAllowed: false, editor: 'text'},
                {name: 'dfDATE_CONTACT', icon: 'icon-Watch', value: '11.03.2016 12:35:17', editAllowed: false, editor: 'text'}
            ]
        };
    },

    componentDidMount : function () {
        for (var key in this.state.fields) {
            var f = this.state.fields[key];
            this.refs[f.name].setState({editAllowed: f.editAllowed, value: f.value, icon: f.icon, editor: f.editor});
        }
    },

    onStartEdit : function (field) {
        for (var key in this.state.fields) {
            var f = this.state.fields[key];
            if (f.name != field) this.refs[f.name].stopEdit();
        }
    },

    onClick : function (e) {
        if ($(e.target).hasClass('data-field-label') || $(e.target).hasClass('data-field-editor')) return;
        this.stopEdit();
    },

    stopEdit : function () {
        for (var key in this.state.fields) {
            var f = this.state.fields[key];
            this.refs[f.name].stopEdit();
        }
    },

    render : function () {
        return (
            <div className="height-100-percent" onClick={this.onClick}>
                {this.state.fields.map((field) => {
                    return (
                        DataFieldComponent({key: field.name, ref: field.name, name: field.name, value: field.value, onStartEdit: this.onStartEdit})
                    )
                })}
            </div>
        );
    }
});
