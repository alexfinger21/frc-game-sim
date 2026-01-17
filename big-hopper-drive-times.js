// @ts-check
// CONSTS
const positions = ["OUR ALLIANCE AREA", "THE NEUTRAL ZONE", "THEIR ALLIANCE AREA"]
const moveTimes = {
    0: {
        1: 2.2,
        2: 3.4,
    },
    1: {
        0: 2.2,
        2: 2.2,
    },
    2: {
        0: 3.4,
        1: 2.2,
    }
}

const hopperSize = 80

// SECONDS
const TIMES = {
    auton: 20,
    transition: 30,
    shift1: 55,
    shift2: 80,
    shift3: 105,
    shift4: 130,
    endgame: 160
}

const moveField = 8.8
const shootTime = 1/8
const intakeTime = 1/5
const aimTime = 0.4

// GLOBALS
let t = 0
let pts = 12
let pos = 0
let hopper = 8


function game() {
    auton()
    console.log("TRANSITION")
    transition()
    console.log("SHIFT 1")
    oppShift(TIMES.shift1)
    console.log("SHIFT 1")
    ourShift(TIMES.shift2)
    console.log("SHIFT 3")
    oppShift(TIMES.shift3)
    console.log("SHIFT 4")
    ourShift(TIMES.shift4)
    console.log("ENDGAME")
    endgame(TIMES.endgame)
}

function auton() {
    console.log("HUMAN PLAYER SCORE:", pts)
    const t_limit = TIMES.auton
    move(1)
    collect(40, t_limit)
    printT()
    shoot(1000, t_limit)

    console.log("AUTON POINTS:", pts)
    printT()
    printHopper()
    printSpace()
    t = 20
}

function transition() {
    const t_limit = TIMES.transition
    move(1)
    collect(19, t_limit)
    shoot(1000, t_limit)

    console.log("TRANSITION POINTS:", pts)
    printT()
    printHopper()
    printSpace()
}

function ourShift(t_limit) {
    while (t_limit - t > 1) {
        move(1)
        collect(1000, t_limit)
        if (t_limit - t > 1) {
            shoot(1000, t_limit)
        }
    }

    console.log("OUR SHIFT POINTS:", pts)
    printT()
    printHopper()
    printSpace()
}

function oppShift(t_limit) {
    move(0)
    while (t_limit - t > 1) {
        collect(1000, t_limit)
        stockpile(1000, t_limit)
    }

    console.log("OPPONENT SHIFT POINTS:", pts)
    printT()
    printHopper()
    printSpace()
}

function endgame(t_limit) {
    while (t_limit - t > 1) {
        move(1)
        collect(1000, t_limit)
        shoot(1000, t_limit)
    }

    console.log("ENDGAME (TOTAL) POINTS:", pts)
    printT()
    printHopper()
    printSpace()
}

function move(goal) {
    if(goal == pos) {
        console.log(`Starting at ${positions[pos]}`)
        return
    }
    const delta = moveTimes[pos][goal]
    t += delta
    pos = goal

    console.log(`Spent ${delta.toFixed(2)} moving to ${positions[pos]}`)
}

function shoot(n, t_limit) {
    if (pos != 1) {
        move(0)
    }

    t += aimTime

    const t_diff = t_limit - t

    const shots = Math.max(0, Math.min(n, Math.min(hopper, Math.floor(t_diff/shootTime))))

    t = Number(t.toFixed(2))

    if (n * shootTime > t_diff) {
        console.log(`Shooting ${n} fuel at t = ${t} is over the time period! Only shooting ${shots} fuel`)
    } else if (shots < n) {
        console.log(`Shooting ${n} fuel at t = ${t} is more than what the hopper contains! Only shooting ${shots} fuel`)
    } else {
        console.log(`Shooting ${shots} fuel at t = ${t}`)
    }
    hopper -= shots
    pts += shots
    t += shootTime * shots
}

function stockpile(n, t_limit) {
    t += aimTime

    const t_diff = t_limit - t

    const stockpiles = Math.max(0, Math.min(n, Math.min(hopper, Math.floor(t_diff/shootTime))))

    t = Number(t.toFixed(2))

    if (n * shootTime > t_diff) {
        console.log(`Stockpiling ${n} fuel at t = ${t} is over the time period! Only stockpiling ${stockpiles} fuel`)
    } else if (stockpiles < n) {
        console.log(`Stockpiling ${n} fuel at t = ${t} is more than what the hopper contains! Only stockpiling ${stockpiles} fuel`)
    } else {
        console.log(`Stockpiling ${stockpiles} fuel at t = ${t}`)
    }
    hopper -= stockpiles
    t += shootTime * stockpiles
}

function collect(n, t_limit) {
    // FINISH HOPPER SIZE CHECK
    const t_diff = t_limit - t

    const collect = Math.max(0, Math.min(n, Math.min(hopperSize-hopper, Math.floor(t_diff/intakeTime))))

    t = Number(t.toFixed(2))

    if (n * intakeTime > t_diff) {
        console.log(`Collecting ${n} fuel at t = ${t} is over the time period! Only collecting ${collect} fuel`)
    } else if (collect < n) {
        console.log(`Collecting ${n} fuel at t = ${t} is over the hopper space! Only collecting ${collect} fuel`)
    } else {
        console.log(`Collecting ${collect} fuel at t = ${t}`)
    }

    t += intakeTime * collect
    hopper += collect
}

function printT() {
    t = Number(t.toFixed(2))
    console.log("TIME:", t)
}


function printHopper() {
    console.log("Hopper fuel:", hopper)
}

function printSpace() {
    console.log("------------\n------------")
}

function printStats() {
    console.log("HOPPER SIZE", hopperSize)
    console.log("INTAKE TIME", intakeTime)
    console.log("SHOOT TIME", shootTime)
    console.log("MOVE FIELD TIME", moveField)
    console.log("INTAKE TIME", intakeTime)
    console.log("AIM TIME", aimTime)
}

game()
