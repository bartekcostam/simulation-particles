// Import the Matter.js library
const { Engine, Render, Runner, Composites, Mouse, MouseConstraint, World, Bodies, Vector } = Matter;

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

// Global array to store the bodies created in the createExplosion function
let bodies = [];

// Function to create an explosion
function createExplosion(e) {
    var explosion = Composites.stack(e.mouse.position.x, e.mouse.position.y, 5, 5, 0, 0, function(x, y) {
        let body = Bodies.circle(x, y, Math.random() * 10 + 5, {
            friction: 0.00001,
            restitution: 0.5,
            density: 0.1
        });
        bodies.push(body); // Add the body to the bodies array
        return body;
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

// Create a slider to control the force
let forceSlider = document.createElement('input');
forceSlider.type = 'range';
forceSlider.min = '0';
forceSlider.max = '0.1';
forceSlider.step = '0.01';
forceSlider.value = '0.05';
forceSlider.style.position = 'fixed';
forceSlider.style.top = '40px';
forceSlider.style.left = '10px';
document.body.appendChild(forceSlider);

// Display the current force
let forceDisplay = document.createElement('div');
forceDisplay.style.position = 'fixed';
forceDisplay.style.top = '70px';
forceDisplay.style.left = '10px';
forceDisplay.style.color = 'white';
forceDisplay.innerHTML = `Force: ${forceSlider.value}`;
document.body.appendChild(forceDisplay);

// Update the force display when the slider is moved
forceSlider.oninput = function() {
    forceDisplay.innerHTML = `Force: ${forceSlider.value}`;
}



function updateFPSCounter() {
    let delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    let fps = 1/delta;
    fpsCounter.innerHTML = `FPS: ${Math.round(fps)}`;
}

// Define the jump area
const jumpArea = {
    start: window.innerWidth / 2 - window.innerWidth * 0.1,
    end: window.innerWidth / 2 + window.innerWidth * 0.1
};

// Start the rendering loop
(function animate() {
    Engine.update(engine, 1000 / 60);
    Render.world(render);
    updateFPSCounter();

    // Apply an upward force to any particles in the jump area
    for (let body of bodies) {
        if (body.position.x > jumpArea.start && body.position.x < jumpArea.end) {
            let forceMagnitude = -forceSlider.value * body.mass; // Force proportional to the body's mass
            Matter.Body.applyForce(body, body.position, { x: 0, y: forceMagnitude });
        }
    }

    requestAnimationFrame(animate);
})();


 // Apply an upward force to any particles in the jump area
 
// Start the rendering loop
Render.run(render);
