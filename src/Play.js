class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        wallA.body.setCollideWorldBounds(true)
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setCollideWorldBounds(true)
        wallB.body.setImmovable(true)

        //Set veloc and bounce for wall
        wallA.body.setVelocityX(-200)
        wallA.body.setBounceX(1)

        //Wall group
        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0+this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            // Determine the shot direction based on the pointer's relative y-position compared to the ball
            let shotDirection = pointer.y < this.ball.y ? 1 : -1;

            // Determine the shot direction based on the pointer's relative x-position compared to the ball
            let shotDirectionX = pointer.x < this.ball.x ? 1 : -1;

            // Check the y-direction of the shot
            if (shotDirection == -1) {
                // Check the x-direction of the shot when the y-direction is upward
                if (shotDirectionX == 1) {
                    // Set ball velocity in the x-direction to a random value between 50 and SHOT_VELOCITY_X
                    this.ball.body.setVelocityX(Phaser.Math.Between(50, this.SHOT_VELOCITY_X));
                } else {
                    // Set ball velocity in the x-direction to a random value between -SHOT_VELOCITY_X and -50
                    this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, -50));
                }
            } else {
                // Check the x-direction of the shot when the y-direction is downward
                if (shotDirectionX == -1) {
                    // Set ball velocity in the x-direction to a random value between -SHOT_VELOCITY_X and -50
                    this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, -50));
                } else {
                    // Set ball velocity in the x-direction to a random value between 50 and SHOT_VELOCITY_X
                    this.ball.body.setVelocityX(Phaser.Math.Between(50, this.SHOT_VELOCITY_X));
                }
            }

            // Set ball velocity in the y-direction to a random value between SHOT_VELOCITY_Y_MIN and SHOT_VELOCITY_Y_MAX
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection);
        });


        // cup/ball collision
        this.physics.add.collider(this.ball,this.cup, (ball, cup) => {
            //Reset ball, no more destroy  
            ball.setPosition(width / 2, height - height / 10)
            ball.setVelocityX(0)
            ball.setVelocityY(0)
            
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)


        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[x] Add ball reset logic on successful shot
[x] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[x] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/