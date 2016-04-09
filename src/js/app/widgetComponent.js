
module.exports = React.createClass ({
    displayName : 'Widget Component',

    getInitialState : function () {
        return {
            title: '[' + _('Title') + ']',
            collapsed: false,
            defaults: {
                tablet: {
                  column: -1
                },
                desktop: {
                  column: -1,
                  width: 1,
                  height: 10
                }
            }
        };
    },

    componentDidMount : function () {
    },

    componentDidUpdate : function () {
    },

    render : function () {
        /*return (
            <div>
                <span className="content">{this.props.name}</span>
            </div>
        );*/
        var cssWidget = 'widget';
        var cssTitle = 'widget-title';
        var cssContent = 'widget-content';
        return (
            <div className={cssWidget}>
                <div className={cssTitle}>
                    <div className='button left'><span className={'icon icon-Move'}></span></div>
                    <div className='button right more'><span className={'icon icon-Sidebar'}></span></div>
                    <div className='text'>{this.state.title}</div>
                </div>
                <div className={cssContent}>{this.props.content}</div>
            </div>
        );
    }
});