var ViewModeIconComponent = React.createFactory(require('./viewModeIconComponent'));

module.exports = React.createClass ({
    displayName : 'Status Component',

    getInitialState : function () {
        return {
            viewModeIcons: null
        };
    },

    initViewModeIcons : function () {
        var icons = {};
        icons.mobile = ViewModeIconComponent({ key: 'mobile', ref: 'mobile', nodeId: 'mobile', status: this, icon: 'icon-Mobile', textTitle: _('Mobile View') }),
        icons.tablet = ViewModeIconComponent({ key: 'tablet', ref: 'tablet', nodeId: 'tablet', status: this, icon: 'icon-Tablet', textTitle: _('Tablet View') }),
        icons.desktop = ViewModeIconComponent({ key: 'desktop', ref: 'desktop', nodeId: 'desktop', status: this, icon: 'icon-Desktop', textTitle: _('Desktop View') })
        this.state.viewModeIcons =  icons;
    },

    setViewMode : function (mode) {
        this.props.main.setViewMode(mode);
    },

    applyViewMode : function (mode) {
        var icons = this.state.viewModeIcons;
        Object.keys(icons).map((key, index) => {
            if (key == mode) this.refs[key].setState({selected: true});
            else this.refs[key].setState({selected: false});
        });
    },

    toggleMenu : function (e) {
        e.stopPropagation()
        this.props.main.refs['menu'].toggle();
    },

    render : function () {
        if (this.state.viewModeIcons == null) this.initViewModeIcons();

        var e = window.app.enums.viewModes;
        var icons = this.state.viewModeIcons;
        return (
            <div id="status-bar">
                <div className="section">
                    <div onClick={this.toggleMenu} className={'menu-icon'}> 
                        <span className={'icon icon-menu'}></span>
                    </div>
                </div>
                <div className="section">
                    {Object.keys(icons).map(function (key, index) {
                        return icons[key];
                    })}
                </div>
                <div className="section text hidden">Status component (view mode: {this.props.main.state.viewMode})</div>
                <div id="status-section-debug" className="section text">
                </div>
            </div>
        );
    }
});