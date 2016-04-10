module.exports = React.createClass ({
    displayName : 'Menu Component',

    getInitialState : function () {
        return {
            expanded: false,
            items: []
        };
    },

    toggle : function () {
        this.setState({ expanded: !this.state.expanded });
    },

    hide : function () {
        this.setState({ expanded: false });
    },

    render : function () {
        var items = this.state.items;
        var cssHidden = (this.state.expanded ? '' : 'hidden');
        return (
            <div id="menu-bar" className={cssHidden}>
            </div>
        );
    }
});