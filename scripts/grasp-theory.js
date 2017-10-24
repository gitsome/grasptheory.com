var GraphBackground = GraphBackground || {};
var GraspTheory;

(function () {


    GraspTheory = function () {

        var that = this;

        that.start = function () {

            var graphBackground = new GraphBackground({
                canvas: $('canvas')
            });

            var updateGraphBackground = function () {
                var scroll = $(window).scrollTop();
                graphBackground.updateVerticalOffset(scroll);
            }

            $(window).scroll(updateGraphBackground);

            updateGraphBackground();

            var waypoint = new Waypoint({
                element: $('.header-waypoint'),
                handler: function (direction) {

                    if (direction === 'down') {
                        $('header').addClass('header-collapsed');
                    } else {
                        $('header').removeClass('header-collapsed')
                    }
                }
            })
        };
    };

})()