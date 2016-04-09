var DataFieldComponent = React.createFactory(require('./dataFieldComponent'));

module.exports = React.createClass ({
    displayName : 'Client Data Widget Component',

    getInitialState : function () {
        var d = window.app.data;
        return {
            fields: [
                {name: 'dfFIRST_NAME', data: d.personAndContact, icon: 'icon-Person', value: 'Ivan Novak', editAllowed: true, editor: 'text'},
                {name: 'dfPERSON_TYPE', data: d.personAndContact, icon: 'icon-PersonCircle', value: 'Fizična', editAllowed: false, editor: 'text'}
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
            if (f.name != field.props.name) this.refs[f.name].stopEdit();
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
                        DataFieldComponent({key: field.name, ref: field.name, name: field.name, data: field.data, value: field.value, onStartEdit: this.onStartEdit})
                    )
                })}
            </div>
        );
    }
});
