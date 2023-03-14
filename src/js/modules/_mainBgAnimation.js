export default function mainBgAnimation() {
    window.onload = function () {
        Particles.init({
            selector: ".background",
            color: ["#e998b4", "#c9fffb", "#e0c9ff"],
            connectParticles: true,
            speed: 0.5,
        });
    }
}