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

    homeOnClick : function (e) {
        window.app.main.selectPage('pageDashboard');
    },

    accountsOnClick : function (e) {
        window.app.main.selectPage('pageAccounts');
    },

    sessionsOnClick : function (e) {
    },

    ordersOnClick : function (e) {
    },

    ratesOnClick : function (e) {
    },

    render : function () {
        var items = this.state.items;
        var cssHidden = (this.state.expanded ? '' : 'hidden');
        return (
            <div id="menu-bar" className={cssHidden}>
                <div id="mbi-home" className="menu-item" onClick={this.homeOnClick}>
                    <span>{_('Home')}</span>
                </div>
                <div id="mbi-accounts" className="menu-item" onClick={this.accountsOnClick}>
                    <span>{_('Accounts')}</span>
                </div>
                <div id="mbi-sessions" className="menu-item" onClick={this.sessionsOnClick}>
                    <span>{_('Sessions')}</span>
                </div>
                <div id="mbi-orders" className="menu-item" onClick={this.ordersOnClick}>
                    <span>{_('Orders')}</span>
                </div>
                <div id="mbi-rates" className="menu-item" onClick={this.ratesOnClick}>
                    <span>{_('Rates')}</span>
                </div>
            </div>
        );
    }
});