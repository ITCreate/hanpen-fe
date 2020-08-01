import words from "./word.json"
import _ from "lodash"

class Words {
    constructor() {
        this.words = _.clone(words)
    }
    getWords() {
        return _.shuffle(this.words)
    }
}

export default new Words