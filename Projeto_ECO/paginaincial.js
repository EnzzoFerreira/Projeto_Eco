(function() {

    const canvas = document.getElementById("swarm");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    const attractor = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    document.addEventListener("mousemove", (e) => {
        attractor.x = e.clientX;
        attractor.y = e.clientY;
    });

    function drawLeaf(x, y, size, rotation, color) {

        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(rotation);

        ctx.scale(size, size);

        // folha
        ctx.beginPath();

        ctx.moveTo(0, -1);

        ctx.bezierCurveTo(
            0.8, -0.5,
            0.8, 0.5,
            0, 1
        );

        ctx.bezierCurveTo(
            -0.8, 0.5,
            -0.8, -0.5,
            0, -1
        );

        ctx.fillStyle = color;
        ctx.fill();

        // nervura central
        ctx.beginPath();

        ctx.moveTo(0, -0.8);
        ctx.lineTo(0, 0.8);

        ctx.strokeStyle = "#1E5631";
        ctx.lineWidth = 0.08;

        ctx.stroke();

        ctx.restore();
    }

    const colors = [
        "#4B8F29",
        "#5DA130",
        "#73B33D",
        "#3F7F25",
        "#2E6B1E"
    ];

    class Particle {

        constructor() {

            this.reset(true);
        }

        reset(firstSpawn = false) {

            this.x =
                Math.random() * canvas.width;

            this.y =
                firstSpawn
                    ? Math.random() * canvas.height
                    : -50;

            this.vx = 0;
            this.vy = 0;

            this.size =
                Math.random() * 8 + 8;

            this.rotation =
                Math.random() * Math.PI * 2;

            this.rotationSpeed =
                (Math.random() - 0.5) * 0.06;

            this.swing =
                Math.random() * Math.PI * 2;

            this.windOffset =
                Math.random() * Math.PI * 2;

            this.windStrength =
                Math.random() * 2 + 0.5;

            this.fallSpeed =
                Math.random() * 2 + 1;

            this.color =
                colors[
                    Math.floor(
                        Math.random() * colors.length
                    )
                ];
        }

        update() {

            const dx =
                this.x - attractor.x;

            const dy =
                this.y - attractor.y;

            const distSq =
                dx * dx + dy * dy + 5000;

            const force =
                3000 / distSq;

            this.vx +=
                (-dy * force) * 0.002;

            this.vy +=
                (dx * force) * 0.002;

            const wind =
                Math.sin(
                    performance.now() * 0.001 +
                    this.windOffset
                ) * this.windStrength;

            this.vx += wind * 0.01;

            this.vx *= 0.99;
            this.vy *= 0.99;

            this.x +=
                this.vx +
                Math.sin(
                    performance.now() * 0.002 +
                    this.swing
                ) * 0.8;

            this.y +=
                this.fallSpeed +
                this.vy;

            this.rotation +=
                this.rotationSpeed;

            if (this.y > canvas.height + 50) {
                this.reset();
            }

            if (this.x < -50) {
                this.x = canvas.width + 50;
            }

            if (this.x > canvas.width + 50) {
                this.x = -50;
            }
        }

        draw() {

            drawLeaf(
                this.x,
                this.y,
                this.size,
                this.rotation,
                this.color
            );
        }
    }

    const particles = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
        particles.push(
            new Particle()
        );
    }

    function animate() {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );

        gradient.addColorStop(
            0,
            "#F4EEDC"
        );

        gradient.addColorStop(
            1,
            "#E5E7D3"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(
            animate
        );
    }

    animate();

})();