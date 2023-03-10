const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // C = Canvas Context

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite({
    position: {
        x:0,
        y:0
    }, 
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 630,
        y: 128
    }, 
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x:50,
        y:0
    },
    velocity: {
        x: 0,
        y: 0
    }, 
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        },
    },
    attackBox: {
        offset: {
            x: 70,
            y: 50
        },
        width: 180,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x:900,
        y:100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'yellow',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        },
    }, 
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
}



decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.20)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    
    // Player 1 Movement
    player.velocity.x = 0
    
    if (keys.a.pressed && player.lastKey === 'a') {
       player.velocity.x = -5 
       player.switchSprites('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprites('run')
    } else{
        player.switchSprites('idle')
    }

    // Player 1 Jumping
    if (player.velocity.y < 0) {
        player.switchSprites('jump')
    }else if (player.velocity.y > 0) {
        player.switchSprites('fall')
    }

    // Player 2 Movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5 
        enemy.switchSprites('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprites('run')
    } else {
        enemy.switchSprites('idle')
    }

        // Player 2 Jumping
        if (enemy.velocity.y < 0) {
            enemy.switchSprites('jump')
        }else if (enemy.velocity.y > 0) {
            enemy.switchSprites('fall')
        }

    // Detect for Collision Player 1
    if (rectangularCollision( { rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking && 
        player.framesCurrent === 4
        ) {
        enemy.takeHit()            
        player.isAttacking = false
        gsap.to('#enemyHealth',{
            width: enemy.health + '%'
        })

    }

    // If player misses
    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    if (rectangularCollision( { rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
        ) {
        enemy.isAttacking = false
        player.takeHit() 

        gsap.to('#playerHealth',{
            width: player.health + '%'
        })
    }
    // If enemy misses
    if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }


    // End Game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }


}

animate()


window.addEventListener('keydown', (event) =>{
    // Player 1 Keys Down
    if(!player.dead){
        switch (event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }

    
    if(!enemy.dead){
        switch(event.key){
            // Player 2 Keys Down
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
            enemy.attack()
            break
        }
    }

})

window.addEventListener('keyup', (event) =>{
    // Player 1 Keys Up
    switch (event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = true
            break
    }

    // Player 2 Keys Up
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            break
    }
})