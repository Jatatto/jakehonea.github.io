class WebEffect {

    constructor(canvas){

        this.loadOptions();

        this.webPoints = [];
        this.mouse = new Point(0,0);

        for(var i = 0; i < canvas.width/8; i++){

            var webPoint = new WebPoint(this, canvas);

            this.webPoints.push(webPoint);

        }

    }

    loadOptions(){

        this.offset = 0;
        this.rotation = 0;
        this.options = new Map();

        this.options.set("lineColor", "rgb(245,245,245)");    
        this.options.set("backgroundColor", "rgb(53,53,53)" );
        this.options.set("circleColor", "rgb(245, 245, 245)");
        this.options.set("dotSpeedIncrease", 1.75);
        this.options.set("lineConnectDistance", 150);
        this.options.set("randomSpeed", 3);
        this.options.set("baseSpeed", 5);
        this.options.set("mouseHitbox", 75);

    }

    getOption(option){

        return this.options.get(option);
    }

    render(canvas, ctx){

        ctx.globalAlpha = 1;
        ctx.fillStyle = this.getOption("backgroundColor");
        ctx.fillRect(0,0, canvas.width, canvas.height);

        for(var i = 0; i < this.webPoints.length; i++)
            this.webPoints[i].move();

        ctx.globalAlpha = .2;
        ctx.strokeStyle = this.getOption("lineColor");

        for(var i = 0; i < this.webPoints.length; i++){    
            for(var j = 0; j < this.webPoints.length; j++)
                if(i != j && this.webPoints[i].getDistance(this.webPoints[j]) < this.getOption("lineConnectDistance")){

                    ctx.beginPath();
                    ctx.strokeStyle = this.getOption("lineColor");

                    this.webPoints[i].lineTo(ctx, this.webPoints[j]);

                    ctx.stroke();

                }

            var distance = this.webPoints[i].getDistance(this.mouse);

            if(!this.holding){

                if(distance < this.getOption("mouseHitbox")){

                    var velocityPoint = this.webPoints[i].clonePoint().subtract(this.mouse);

                    this.webPoints[i].vector = new Vector(velocityPoint.x, velocityPoint.y, distance).normalize().multiply(this.webPoints[i].speed);

                    this.webPoints[i].setSpeed(this.webPoints[i].speed * this.getOption("dotSpeedIncrease"));

                } else if(this.webPoints[i].pastMaxSpeed())
                    this.webPoints[i].setSpeed((Math.random() * this.getOption("randomSpeed")) + this.getOption("baseSpeed"));

            }else if(distance < this.getOption("mouseHitbox")){


                var velocityPoint = this.mouse.clonePoint().subtract(this.mouse);

                this.webPoints[i].vector = new Vector(velocityPoint.x, velocityPoint.y, distance).normalize().multiply(this.webPoints[i].speed);

                ctx.beginPath();
                ctx.globalAlpha = 0.8;
                ctx.strokeStyle = this.getFluidRGB(this.rotation ++ / Math.PI / 32);

                this.webPoints[i].lineTo(ctx, this.mouse);

                ctx.stroke();
                ctx.globalAlpha = 0.2;

            }

            if(!this.holding && this.webPoints[i].pastMaxSpeed())
                this.webPoints[i].setSpeed((Math.random() * this.getOption("randomSpeed")) + this.getOption("baseSpeed"));

        }

        if(!this.holding){

            ctx.globalAlpha = 1;

            var increment = Math.PI / 6;

            var previous = new Point(
                this.mouse.x + (this.getOption("mouseHitbox") * Math.cos(-increment + this.offset)),
                this.mouse.y + (this.getOption("mouseHitbox") * Math.sin(-increment + this.offset))
            );

            for(var angle = 0; angle < (Math.PI * 2) ; angle += increment){

                ctx.strokeStyle = this.getFluidRGB(angle);
                ctx.beginPath();

                ctx.moveTo(
                    previous.x,
                    previous.y
                );

                previous = new Point(
                    this.mouse.x + (this.getOption("mouseHitbox") * Math.cos(angle + this.offset)),
                    this.mouse.y + (this.getOption("mouseHitbox") * Math.sin(angle + this.offset))
                );

                ctx.lineTo(
                    previous.x,
                    previous.y
                );

                ctx.stroke();


            }

            this.offset += Math.PI / 64;

        }

    }


    getFluidRGB(offset){

        // 255 = 127 + 128
        return "rgb("+(Math.sin(offset + 0) * 127 + 128)+", "+( Math.sin(offset + 2) * 127 + 128)+", "+(Math.sin(offset + 4) * 127 + 128)+")";

    }

}