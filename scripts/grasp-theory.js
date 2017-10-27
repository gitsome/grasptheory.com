var GraphBackground = GraphBackground || {};
var GraspTheory;

(function () {


    GraspTheory = function () {

        var that = this;

        that.start = function () {

            var graphBackground = new GraphBackground({
                canvas: $('canvas')
            });

            var scrollPosition;
            var updateGraphBackground = function () {
                scrollPosition = $(window).scrollTop();
                graphBackground.updateVerticalOffset(scrollPosition);
            };

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
            });
        };
    };

})()