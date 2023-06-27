// Import the Matter.js library
const { Engine, Render, Runner, Composites, Mouse, MouseConstraint, World, Bodies } = Matter;

// Create an engine
const engine = Engine.create();

// Create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// Create a runner to run the engine
const runner = Runner.create();
Runner.run(runner, engine);

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
World.add(engine.world, mouseConstraint);
render.mouse = mouse;

// Create a ground
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 60, { isStatic: true });
World.add(engine.world, ground);

// Create walls
const wallOptions = { isStatic: true, render: { visible: false } };
const wallThickness = 50;
const leftWall = Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight, wallOptions);
const rightWall = Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight, wallOptions);
World.add(engine.world, [leftWall, rightWall]);

// Function to create an explosion
function createExplosion(e) {
    var explosion = Composites.stack(e.mouse.position.x, e.mouse.position.y, 5, 5, 0, 0, function(x, y) {
        return Bodies.circle(x, y, Math.random() * 10 + 5, {
            friction: 0.00001,
            restitution: 0.5,
            density: 0.001
        });
    });
    World.add(engine.world, explosion);
}

// Add an event listener for mousedown
Matter.Events.on(mouseConstraint, 'mousedown', createExplosion);

// FPS counter
let lastCalledTime = Date.now();
let fpsCounter = document.createElement('div');
fpsCounter.style.position = 'fixed';
fpsCounter.style.top = '10px';
fpsCounter.style.left = '10px';
fpsCounter.style.color = 'white';
document.body.appendChild(fpsCounter);

function updateFPSCounter() {
    let delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    let fps = 1/delta;
    fpsCounter.innerHTML = `FPS: ${Math.round(fps)}`;
}

// Start the rendering loop
(function animate() {
    Engine.update(engine, 1000 / 60);
    Render.world(render);
    updateFPSCounter();
    requestAnimationFrame(animate);
})();


// Start the rendering loop
Render.run(render);
