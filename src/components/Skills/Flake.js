import rand from './../../shared/rand'

export default class Flake {
  constructor (x, y) {
    const maxWeight = 5
    const maxSpeed = 1

    this.x = x
    this.y = y
    this.wind = rand(0, 0.1, 10)
    this.a = rand(0, Math.PI, 10)
    this.step = 0.01

    this.weight = rand(2, maxWeight, 10)
    this.alpha = (this.weight / maxWeight) - 1
    this.speed = (this.weight / maxWeight) * maxSpeed
  }

  update () {
    this.x += Math.cos(this.a) * this.wind
    this.a += this.step
    this.y += this.speed
  }
}
