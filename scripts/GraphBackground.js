var GraphBackground;

(function () {

    var TOTAL_BALLS = 50;

    GraphBackground = function (options_in) {

        var defaults = {
            canvas: null
        };

        var that = this;
        $.extend(that, defaults, options_in)

        that.canvas.css({
            position: 'fixed',
            top: 0,
            left: 0,
            'z-index': -1,
        });

        var canvas = that.canvas[0];

        can_w = parseInt(canvas.getAttribute('width')),
        can_h = parseInt(canvas.getAttribute('height')),
        ctx = canvas.getContext('2d');

        var ball = {
              x: 0,
              y: 0,
              vx: 0,
              vy: 0,
              r: 0,
              alpha: 1,
              age: 0,
              phase: randomNumFrom(0, 2 * Math.PI)
        };
        var ball_color = {
               r: 190,
               g: 190,
               b: 190
        };
        var ball_color_orange = {
                r: 190,
                g: 190,
                b: 190
        };
        var R = 4;
        var balls = [];
        var alpha_f = 0.02;
        var alpha_phase = 0;

        var dis_limit;

        // Line
        var link_line_width = 0.8,
           mouse_in = false,
           mouse_ball = {
              x: 0,
              y: 0,
              vx: 0,
              vy: 0,
              r: 0,
              type: 'mouse'
           };

        var verticalOffset = 0;

        // Random speed
        var speedMin = -0.75;
        var speedMax = 0.75;
        function getRandomSpeed(){
            return randomNumFrom(speedMin, speedMax);
        }
        function randomArrayItem(arr){
            return arr[Math.floor(Math.random() * arr.length)];
        }
        function randomNumFrom(min, max){
            return Math.random()*(max - min) + min;
        }

        // Random Ball
        function getRandomBall(){
            var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
            return {
                x: randomSidePos(can_w),
                y: verticalOffset + Math.round(Math.random() * can_h),
                vx: getRandomSpeed(),
                vy: getRandomSpeed(),
                r: Math.round(Math.random() * R) + 2,
                alpha: 0,
                age: 0,
                color: Math.round(Math.random()) === 0 ? ball_color : ball_color_orange,
                phase: randomNumFrom(0, 2 * Math.PI)
            };
        }
        function randomSidePos (length) {
            return Math.ceil(Math.random() * length);
        }

        // Draw Ball
        function renderBalls () {
            Array.prototype.forEach.call(balls, function(b){

               if(!b.hasOwnProperty('type')){

                   ctx.fillStyle = 'rgba(' + Math.round(255 - b.alpha * 70) + ',' + Math.round(255 - b.alpha * 70) + ',' + Math.round(255 - b.alpha * 70) + ', 1.0)';
                   ctx.beginPath();
                   ctx.arc(b.x, b.y - verticalOffset, b.r, 0, Math.PI*2, true);
                   ctx.closePath();
                   ctx.fill();
               }
            });
        }

        // Update balls
        function updateBalls(){
            var new_balls = [];
            Array.prototype.forEach.call(balls, function(b){

                b.x += b.vx;
                b.y += b.vy;

                if(b.type === 'mouse' || (b.x > -(50) && b.x < (can_w+50) && b.y > (verticalOffset - 50) && b.y < (verticalOffset + can_h + 50))) {
                   new_balls.push(b);
                }

                b.age++;

                // alpha change
                b.phase += alpha_f;
                b.alpha = Math.min(((Math.cos(b.phase) / 2) + 0.5) * 0.7 + 0.3, Math.min(50, b.age) / 50);
            });

            balls = new_balls.slice(0);
        }

        // loop alpha
        function loopAlphaInf () {}

        // Draw lines
        var fraction, alpha, factor;
        function renderLines(){

            for (var i = 0; i < balls.length; i++) {

                for (var j = i + 1; j < balls.length; j++) {

                    factor =  Math.min((balls[i].type ==='mouse' ? 0.5 : balls[i].alpha), (balls[j].type ==='mouse' ? 0.5 : balls[j].alpha));

                    fraction = Math.min(getDisOf(balls[i], balls[j]) / dis_limit, 1);

                    if (fraction <= 1) {

                        alpha = (Math.min(1 - fraction, factor)).toString();

                        ctx.strokeStyle = 'rgba(150,150,150,' + alpha + ')';
                        ctx.lineWidth = link_line_width;

                        ctx.beginPath();
                        ctx.moveTo(balls[i].x, balls[i].y - verticalOffset);
                        ctx.lineTo(balls[j].x, balls[j].y - verticalOffset);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        // calculate distance between two points
        var delta_x;
        var delta_y;
        function getDisOf(b1, b2){
            delta_x = b1.x - b2.x;
            delta_y = b1.y - b2.y;
            return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
        }

        // add balls if there a little balls
        function addBallIfy(){
            if(balls.length < TOTAL_BALLS){
                balls.push(getRandomBall());
            }
        }

        // Render
        function render(){
            ctx.clearRect(0, 0, can_w, can_h);

            renderLines();

            renderBalls();

            updateBalls();

            addBallIfy();

            window.requestAnimationFrame(render);
        }

        // Init Balls
        function initBalls(num){
            for(var i = 1; i <= num; i++){
                balls.push({
                    x: randomSidePos(can_w),
                    y: randomSidePos(can_h) - verticalOffset,
                    vx: getRandomSpeed(),
                    vy: getRandomSpeed(),
                    r: Math.round(Math.random() * R) + 2,
                    alpha: 0,
                    age: 0,
                    color: Math.round(Math.random()) === 0 ? ball_color : ball_color_orange,
                    phase: randomNumFrom(0, 2 * Math.PI)
                });
            }
        }
        // Init Canvas
        function initCanvas(){
            canvas.setAttribute('width', window.innerWidth);
            canvas.setAttribute('height', window.innerHeight);

            can_w = parseInt(canvas.getAttribute('width'));
            can_h = parseInt(canvas.getAttribute('height'));

            dis_limit = can_w * 0.125;
        }
        window.addEventListener('resize', function(e){
            initCanvas();
        });

        function goMovie(){
            initCanvas();
            initBalls(TOTAL_BALLS);
            window.requestAnimationFrame(render);
        }
        goMovie();

        // Mouse effect
        $('body')[0].addEventListener('mouseenter', function(){
            mouse_in = true;
            balls.push(mouse_ball);
        });
        $('body')[0].addEventListener('mouseleave', function(){
            mouse_in = false;
            var new_balls = [];
            Array.prototype.forEach.call(balls, function(b){
                if(!b.hasOwnProperty('type')){
                    new_balls.push(b);
                }
            });
            balls = new_balls.slice(0);
        });
        window.addEventListener('mousemove', function(e) {
            var e = e || window.event;
            mouse_ball.x = e.clientX;
            mouse_ball.y = e.clientY + verticalOffset;
        });

        that.updateVerticalOffset = function (verticalOffset_in) {
            verticalOffset = verticalOffset_in * 0.25;
        };
    };

})();