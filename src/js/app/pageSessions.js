var WidgetComponent = React.createFactory(require('./widgetComponent'));
var WidthProvider = ReactGridLayout.WidthProvider;
ReactGridLayout = WidthProvider(ReactGridLayout);
//var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
//ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

module.exports = React.createClass ({
    displayName : 'Grid Component',

    getInitialState : function () {
        return {
            widthProviderToBeSet: true,
            widgets: {}
        }
    },

    addWidget : function (name, properties, defaults) {
        var widgets = this.state.widgets || {};
        properties = properties || {};
        properties.key = ( typeof name != 'undefined' || widgets[name] == 'undefined' ? name : 'widget_' + Object.keys(widgets).length );
        properties.name = properties.key;
        defaults = defaults || { tablet: { column: -1 }, desktop: { column: -1, width: 1 }};
        properties.defaults = defaults;
        widgets[name] = {
            widget: WidgetComponent(properties),
            props: properties,
            defaults: defaults
        };
        this.setState({widgets: widgets});
    },

    getLayouts: function () {
        var layouts = [];
        var lastX = -1;

        var widgets = this.state.widgets;
        var eViews = window.app.enums.viewModes;
        var view = (typeof this.props.main != 'undefined' ? this.props.main.state.viewMode : eViews.tablet);

        var cols = 3;
        if (view == eViews.tablet) cols = 2;
        else if (view == eViews.mobile) cols = 1;
        Object.keys(widgets).map((key) => {
            lastX = (lastX == 0 ? 1 : 0);
            var widget = widgets[key];
            var x = lastX;
            var w = 1;
            var h = 10;
            if (view != eViews.mobile) {
                var xDefault = widgets[key].defaults[view].column;
                x = (x != -1 && x <= cols ? xDefault - 1 : x);
                var hDefault = widgets[key].defaults[view].height;
                h = (h != -1 ? hDefault : h);
            }
            if (view == eViews.desktop) {
                var wDefault = widgets[key].defaults[view].width;
                w = (w != -1 && w <= 2 ? wDefault : w);
            }
            layouts.push({i: 'grid-' + key, x: x, y: 0, w: w, h: h});
        });
        return layouts;
    },

    render : function () {
        var eViews = window.app.enums.viewModes;
        var view = (typeof this.props.main != 'undefined' ? this.props.main.state.viewMode : eViews.tablet);
        var widgets = this.state.widgets;
        var lastX = -1;

        var cols = 3;
        if (view == eViews.tablet) cols = 2;
        else if (view == eViews.mobile) cols = 1;

        return (
            <div id="content-grid-holder">
                <ReactGridLayout className="content-grid layout" cols={cols} rowHeight={18} layout={this.getLayouts()}>
                    {Object.keys(widgets).map(function (key, index) {
                        return (
                            <div key={'grid-' + key}>
                                {widgets[key].widget}
                            </div>
                        );
                    })}
                </ReactGridLayout>
            </div>
        )
    }
});