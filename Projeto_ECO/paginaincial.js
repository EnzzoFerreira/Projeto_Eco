(function() {
        const canvas = document.getElementById('swarm');
        const ctx    = canvas.getContext('2d');
        function resize() {
          canvas.width  = window.innerWidth;
          canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();
        // Attractor position; initially centre
        const attractor = { x: canvas.width / 2, y: canvas.height / 2 };
        document.addEventListener('mousemove', (e) => {
          attractor.x = e.clientX;
          attractor.y = e.clientY;
        });
        // Particle definition
        class Particle {
          constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = 0;
            this.vy = 0;
            this.colour = `hsl(${Math.random() * 360}, 80%, 60%)`;
          }
          update() {
            // Swirl around the attractor: accelerate perpendicular to the vector
            const dx = this.x - attractor.x;
            const dy = this.y - attractor.y;
            // Invert dx, dy to revolve around centre in clockwise direction
            const distSq = dx * dx + dy * dy + 0.01;
            const invDist = 1 / Math.sqrt(distSq);
            // Perpendicular unit vector (rotate 90 degrees)
            const px = -dy * invDist;
            const py = dx * invDist;
            // Determine base speed inversely proportional to distance
            const base = 0.5;
            const speed = base * invDist;
            this.vx += px * speed + (Math.random() - 0.05) * 0.02;
            this.vy += py * speed + (Math.random() - 0.05) * 0.02;
            // Dampen velocities to prevent runaway acceleration
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.x += this.vx;
            this.y += this.vy;
            // Wrap around edges
            if (this.x < 0) this.x += canvas.width;
            if (this.x > canvas.width) this.x -= canvas.width;
            if (this.y < 0) this.y += canvas.height;
            if (this.y > canvas.height) this.y -= canvas.height;
          }
          draw(ctx) {
            ctx.fillStyle = this.colour;
            ctx.fillRect(this.x, this.y, 1, 1);
          }
        }
        const particleCount = 1200;
        const particles = [];
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        function animate() {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (const p of particles) {
            p.update();
            p.draw(ctx);
          }
          requestAnimationFrame(animate);
        }
        animate();
      })();