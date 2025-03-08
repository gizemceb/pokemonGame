const canvas = document.querySelector('canvas')
const content = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576

const collisionsMap = []
 // map'imiz 70 pixel genişliginde olduğudan 70'lik subarrayler olusturuyoruz
for (let i = 0; i < collisions.length; i+=70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+=70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const offset = {
    x: -600,
    y : -100
} 

const boundaries = []
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(
                new Boundry({
                    position: {
                        x: j * Boundry.width + offset.x,
                        y: i * Boundry.height + offset.y
                    }
                })
            )
        }
    }) 
})

const battleZones = []
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            battleZones.push(
                new Boundry({
                    position: {
                        x: j * Boundry.width + offset.x,
                        y: i * Boundry.height + offset.y
                    }
                })
            )
        }
    }) 
})

const image = new Image()
image.src = './images/pixel game map.png'

const foregroundImage = new Image()
foregroundImage.src = './images/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './images/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './images/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './images/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './images/playerRight.png'

const player = new Sprite({
    position: {
        x: 530,
        y: 380,
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        right: playerRightImage,
        left: playerLeftImage
    }
})

const background = new Sprite({position: {
    x : offset.x,
    y : offset.y
    },
    image: image
})

const foreground = new Sprite({position: {
    x : offset.x,
    y : offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed : false
    },
    ArrowUp: {
        pressed :false
    },
    s: {
        pressed : false
    },
    ArrowDown: {
        pressed : false
    },
    d: {
        pressed : false
    },
    ArrowRight: {
        pressed : false
    },
    a: {
        pressed : false
    },
    ArrowLeft: {
        pressed : false
    }
}

const movables = [background, ...boundaries, foreground, ...battleZones]
function rectangularCollision({rectange1, rectange2}) {
    return (
        rectange1.position.x + rectange1.width >= rectange2.position.x && 
        rectange1.position.x <= rectange2.position.x + rectange2.width &&
        rectange1.position.y <= rectange2.position.y + rectange2.height && 
        rectange1.position.y + rectange1.height >= rectange2.position.y
    )
}

const battle = {
    initiated: false
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundry) => {
        boundry.draw()

    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()
    
    let moving = true
    player.moving = false
    if (battle.initiated) return

    // activate a battle
    if (keys.w.pressed || keys.ArrowUp.pressed 
        || keys.s.pressed || keys.ArrowDown.pressed 
        || keys.d.pressed || keys.ArrowRight.pressed 
        || keys.a.pressed || keys.ArrowLeft.pressed) {
            for (let i = 0; i < battleZones.length; i++) {
                const battleZone = battleZones[i]
                const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(player.position.y  + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))
                if (rectangularCollision({
                    rectange1: player,
                    rectange2: battleZone
                }) && overlappingArea > (player.width * player.height) / 2 && Math.random() < 0.1)  {
                    
                    console.log("battleZone")
                    battle.initiated = true
                    player.moving = false
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        repeat: 3,
                        yoyo: true,
                        duration: 0.4,
                        onComplete() {
                            gsap.to('#overlappingDiv', {
                                opacity: 1,
                                duration: 0.4
                            })
                            // activate new animation
                        }
                    })
                    break
                }
            }
        }

    if (keys.w.pressed || keys.ArrowUp.pressed) {
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundry = boundaries[i]
            if (rectangularCollision({
                rectange1: player,
                rectange2: {...boundry, position: {
                    x: boundry.position.x,
                    y: boundry.position.y + 3
                } }
            })) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {movable.position.y += 3})
        }
    }

    if (keys.s.pressed || keys.ArrowDown.pressed) {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundry = boundaries[i]
            if (rectangularCollision({
                rectange1: player,
                rectange2: {...boundry, position: {
                    x: boundry.position.x,
                    y: boundry.position.y - 3
                } }
            })) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {movable.position.y -= 3})
        }
    }

    if (keys.d.pressed || keys.ArrowRight.pressed) {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundry = boundaries[i]
            if (rectangularCollision({
                rectange1: player,
                rectange2: {...boundry, position: {
                    x: boundry.position.x - 3,
                    y: boundry.position.y
                } }
            })) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {movable.position.x -= 3})
        }
    }

    if (keys.a.pressed || keys.ArrowLeft.pressed) {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundry = boundaries[i]
            if (rectangularCollision({
                rectange1: player,
                rectange2: {...boundry, position: {
                    x: boundry.position.x + 3,
                    y: boundry.position.y
                } }
            })) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {movable.position.x += 3})
        }
    }
}

animate()

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 's':
        case 'ArrowDown':
            keys.s.pressed = true
            keys.ArrowDown.pressed = true
            break

        case 'w':
        case 'ArrowUp':
            keys.w.pressed = true
            keys.ArrowUp.pressed = true
            break
        
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = true
            keys.ArrowRight.pressed = true
            break
        
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = true
            keys.ArrowLeft.pressed = true
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 's':
        case 'ArrowDown':
            keys.s.pressed = false
            keys.ArrowDown.pressed = false
            break

        case 'w':
        case 'ArrowUp':
            keys.w.pressed = false
            keys.ArrowUp.pressed = false
            break
        
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = false
            keys.ArrowRight.pressed = false
            break
        
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = false
            keys.ArrowLeft.pressed = false
            break
    }
})