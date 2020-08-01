import words from "./word.json"
import _ from "lodash"

class Words {
    constructor() {
        this.words = _.clone(words)
    }
    getWords() {
        console.log("max X", _.maxBy(this.words, "x").x)
        console.log("max Y", _.maxBy(this.words, "y").y)
        console.log("min X", _.minBy(this.words, "x").x)
        console.log("min Y", _.minBy(this.words, "y").y)
        return _.shuffle(this.words)
    }
}

export default new Words