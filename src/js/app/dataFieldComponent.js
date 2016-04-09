
module.exports = React.createClass ({
    displayName : 'Data Field Component',

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
        if (!this.state.inEditMode) return;
        this.setState({inEditMode: false});
        this.setData();
    },

    onChange : function (e) {
        this.setState({value: e.target.value});
    },

    setData : function () {
        if (typeof this.props.data != 'undefined' && typeof this.props.data.setFieldValue != 'undefined') {
            this.props.data.setFieldValue(this.state.name, this.state.value);
        }
    },

    onClick : function () {
        if (!this.state.inEditMode) {
            if (this.state.editAllowed && this.state.editor) this.startEdit();
        }
    },

    onKeyUp : function (e) {
        if (e.keyCode == 13) { // Enter - Confirm changes
            this.setState({value: e.target.value, inEditMode: false});
            this.setData();
        } else if (e.keyCode == 27) { // Esc - Discard changes
            this.setState({value: this.state.originalValue, inEditMode: false});
            this.setData();
        }
    },

    onEditMouseDown : function (e) {
    },

    render : function () {
        if (typeof this.state.inEditMode == 'undefined') this.state.inEditMode = false;
        if (typeof this.state.originalValue == 'undefined') this.state.originalValue = this.state.value;
        if (typeof this.previousShowEditor == 'undefined') this.previousShowEditor = null;
        if (this.state.name == null) this.state.name = this.props.name;
        var editor = window.app.main.getEditor({value: this.state.value, onChange: this.onChange, onEditMouseDown: this.onEditMouseDown, onKeyUp: this.onKeyUp}, this.state.editor);
        var canEdit = this.state.editAllowed;
        var inEditMode = this.state.inEditMode;
        var showEditor = (inEditMode && this.state.editor);
        var cssLabel = 'data-field-label' + (canEdit ? ' can-edit' : '') + (inEditMode ? ' hidden' : '');
        //var cssEditor = 'data-field-editor' + (inEditMode ? '' : ' hidden');
        if (showEditor && this.previousShowEditor !== showEditor) {
            this.state.originalValue = this.state.value;
            window.setTimeout(() => {
                $(ReactDOM.findDOMNode(this)).find('.data-field-editor').focus();
            }, 50);
        }
        this.previousShowEditor = showEditor;
        return (
            <div key={this.state.name} className="data-field">
                <div className="icon"><span className={'icon ' + this.state.icon}></span></div>
                <div className="data">
                    <span className={cssLabel} onClick={this.onClick}>{this.state.value}</span>
                    {(showEditor ? editor : null)}
                </div>
            </div>
        );
    }
});