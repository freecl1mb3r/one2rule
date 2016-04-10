
module.exports = React.createClass ({
    displayName : 'View Mode Icon Component',

    getInitialState : function () {
        return {
            selected: false
        }
    },

    componentDidMount : function () {
    },

    setSelected : function (nodeId, e) {
        this.props.status.setViewMode(nodeId);
    },

    render : function () {
        var selectedCss = ''
        if (this.state.selected) selectedCss = ' selected';

        // Virtual DOM
        return (
            <div key={'view-mode-item-' + this.props.nodeId} className={'view-mode-icon-holder'}>
                <div key={this.props.nodeId} onClick={this.setSelected.bind(null, this.props.nodeId)} className={'view-mode-icon' + selectedCss} title={this.props.textTitle}> 
                    <span key={this.props.nodeId + '.1'} className={'icon ' + this.props.icon}></span>
                    <div key={this.props.nodeId + '.2'} className={'marker'}></div>
                </div>
            </div>
        );
    }
});