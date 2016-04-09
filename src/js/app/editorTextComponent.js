
module.exports = React.createClass ({
    displayName : 'Editor Text Component',

    getInitialState : function () {
        return {
            name: null,
            mode: 'normal', // values: normal, 
            icon: 'icon-Pen',
            value: null,
            editAllowed: false, 
            editor: null
        };
    },

    componentDidMount : function () {
    },

    componentDidUpdate : function () {
    },

    startEdit : function () {
        if (this.props.onStartEdit) this.props.onStartEdit(this);
        this.setState({inEditMode: true});
    },

    stopEdit : function () {
        this.setState({inEditMode: false});
    },

    onClick : function () {
        if (!this.state.inEditMode) {
            if (this.state.editAllowed && this.state.editor) this.startEdit();
        }
    },

    render : function () {
        if (this.state.name == null) this.state.name = this.props.name;
        if (typeof this.state.inEditMode == 'undefined') this.state.inEditMode = false;
        var canEdit = this.state.editAllowed;
        var inEditMode = this.state.inEditMode;
        var showEditor = (inEditMode && this.state.editor);
        var cssLabel = 'data-field-label' + (canEdit ? ' can-edit' : '') + (inEditMode ? ' hidden' : '');
        //var cssEditor = 'data-field-editor' + (inEditMode ? '' : ' hidden');
        return (
            <div key={this.state.name} className="data-field">
                <div className="icon"><span className={'icon ' + this.state.icon}></span></div>
                <div className="data">
                    <span className={cssLabel} onClick={this.onClick}>{this.state.value}</span>
                    {(showEditor ? this.state.editor : null)}
                </div>
            </div>
        );
    }
});