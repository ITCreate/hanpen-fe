import words from "./word.json"
import _ from "lodash"

class Words {
    constructor() {
        this.words = _.take(_.shuffle(words), 40)
    }
    getWords() {
        console.log("max X", _.maxBy(this.words, "x"))
        console.log("max X", _.maxBy(this.words, "x").x)
        console.log("max Y", _.maxBy(this.words, "y").y)
        console.log("min X", _.minBy(this.words, "x").x)
        console.log("min Y", _.minBy(this.words, "y").y)
        return this.words
    }
    maxPoint() {
        return {
            x: _.maxBy(this.words, "x").x,
            y: _.maxBy(this.words, "y").y
        }
    }
    minPoint() {
        return {
            x:  _.minBy(this.words, "x").x,
            y: _.minBy(this.words, "y").y
        }
    }
}

export default new Words