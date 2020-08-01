<template>
  <div class="container border mt-2">
    <div class="is-size-1 has-text-centered">残り{{ leftTurn }}ターン</div>
    <div class="columns">
      <!-- プレイヤー1の情報 -->
      <div
        id="player1"
        class="column card"
        :class="{ 'my-turn': currentPlayer === 1 }"
        style="background-image: url('./study_gogaku_woman6_japanese.png'); background-repeat: no-repeat;
    background-position: 50% 90%;"
      >
        <div class="is-size-1">プレイヤー1</div>
        <div class="columns gages mx-2 my-1">
          <div
            class="column gage"
            :class="{ 'is-charge': n <= postWords[1].length }"
            v-for="n in 3"
            :key="n"
          ></div>
        </div>
        <div class="is-size-3">スコア:{{playerScore(1)}}</div>
        <div class="tooltip" v-show="showTooltipPlayer1">{{ tooltipContent1 }}</div>
      </div>

      <svg class="card px-6" width="600" height="600" viewBox="0 0 601 601">
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5" />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <!-- <template v-for="pw in words">
          <text
            :key="pw.word"
            style="fill-opacity: .4;"
            :x="calcPointX(pw) - 10"
            :y="calcPointY(pw) - 10"
            font-size="24px"
          >{{ pw.word }}</text>
          <circle fill="red" :key="pw.key" :cx="calcPointX(pw)" :cy="calcPointY(pw)" r="5px" />
        </template>-->
        <template v-for="pw in postWords[1]">
          <circle fill="red" :key="pw.key" :cx="calcPointX(pw)" :cy="calcPointY(pw)" r="3px" />
          <text
            :key="pw.key"
            :x="calcPointX(pw) - 10"
            :y="calcPointY(pw) - 10"
            font-size="24px"
            fill="red"
          >{{ pw.word }}</text>
        </template>
        <template v-for="pw in postWords[2]">
          <circle fill="blue" :key="pw.key" :cx="calcPointX(pw)" :cy="calcPointY(pw)" r="3px" />
          <text
            :key="pw.key"
            :x="calcPointX(pw) - 10"
            :y="calcPointY(pw) - 10"
            font-size="24px"
            fill="blue"
          >{{ pw.word }}</text>
        </template>
        <template v-for="(triangle) in triangles">
          <polygon
            :fill="triangle.player === 1? 'red' : 'blue'"
            style="fill-opacity: .1;"
            :key="toPoints(triangle.points)"
            :points="toPoints(triangle.points)"
          />
          <text
            v-for="pw in triangle.points"
            :key="pw.word"
            style="fill-opacity: .4;"
            :x="calcPointX(pw) - 10"
            :y="calcPointY(pw) - 10"
            font-size="24px"
          >{{ pw.word }}</text>
          <!-- <circle
            v-for="pw in triangle.points"
            :fill="triangle.player === 1? 'red' : 'blue'"
            :key="pw.key"
            :cx="calcPointX(pw)"
            :cy="calcPointY(pw)"
            r="3px"
          />-->
        </template>
      </svg>

      <!-- プレイヤー2の情報 -->
      <div
        id="player2"
        class="column card"
        :class="{ 'my-turn': currentPlayer === 2 }"
        style="background-image: url('./study_gogaku_man6_japanese.png'); background-repeat: no-repeat;
    background-position: 50% 90%;"
      >
        <div class="is-size-1">プレイヤー2</div>
        <div class="columns gages mx-2 my-1">
          <div
            class="column gage"
            :class="{ 'is-charge': n <= postWords[2].length }"
            v-for="n in 3"
            :key="n"
          ></div>
        </div>
        <div class="is-size-3">スコア:{{playerScore(2)}}</div>
        <div class="tooltip" v-if="showTooltipPlayer2">{{ tooltipContent2 }}</div>
      </div>
    </div>

    <!-- 出す単語を選ぶ -->
    <div>
      <p class="is-size-2 mb-4">プレイヤー{{ currentPlayer }}の番です 出す単語を選んでください</p>
      <div class="columns is-multiline">
        <div
          class="column is-2 has-text-centered"
          v-for="word in hands"
          :key="word.key"
          @click="postWord(word)"
        >
          <div class="card is-size-5 has-background-primary has-text-white">{{word.word}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import words from "../Words";
import _ from "lodash";
import { calcTriangleArea } from "../PolygonUtil";

const HANDS_NUM = 12;
const SCORE_BIAS = 10;
const TURN_NUM = 3;

export default {
  data() {
    return {
      words: words.getWords(),
      postWords: {
        1: [],
        2: [],
      },
      triangles: [],
      currentPlayer: 1,
      tooltipContent1: null,
      tooltipContent2: null,
      showTooltipPlayer1: false,
      showTooltipPlayer2: false,
      turn: 0,
      isBisy: false,
    };
  },
  computed: {
    hands() {
      return _.take(
        _.filter(this.words, (w) => {
          return (
            !this.postWords[1]
              .map((postWord) => postWord.word)
              .includes(w.word) &&
            !this.postWords[2]
              .map((postWord) => postWord.word)
              .includes(w.word) &&
            !this.triangles.some((triangle) =>
              triangle.points.some((point) => point.word == w.word)
            )
          );
        }),
        HANDS_NUM
      );
    },
    maxPoint() {
      return {
        max: words.maxPoint(),
        min: words.minPoint(),
      };
    },
    leftTurn() {
      return TURN_NUM - Math.floor(this.turn / 6);
    },
  },
  mounted() {},
  methods: {
    calcPointX(point) {
      const length = this.maxPoint.max.x - this.maxPoint.min.x;
      const x = point.x - this.maxPoint.min.x;

      console.log(600 * (x / length), x / length, point.word);
      return 600 * (x / length);
    },
    calcPointY(point) {
      const length = this.maxPoint.max.y - this.maxPoint.min.y;
      const y = point.y - this.maxPoint.min.y;

      console.log(600 * (y / length), y / length, point.word);
      return 600 * (y / length);
    },
    playerScore(number) {
      return this.triangles
        .filter((triangle) => triangle.player === number)
        .reduce((p, triangle) => {
          return (
            p +
            Math.ceil(
              calcTriangleArea(
                triangle.points.map((point) => {
                  return [point.x * SCORE_BIAS, point.y * SCORE_BIAS];
                })
              )
            )
          );
        }, 0);
    },
    toPoints(triangle) {
      return triangle
        .map((word) => `${this.calcPointX(word)},${this.calcPointY(word)}`)
        .join(" ");
    },
    postWord(word) {
      if (this.isBisy) return;

      this.postWords[this.currentPlayer].push(word);
      const currentPlayer = this.currentPlayer;
      this.showTooltip(currentPlayer, word.word, 500, true).then(() => {
        if (this.postWords[currentPlayer].length === 3) {
          this.animationAddTriangle(
            currentPlayer,
            this.postWords[currentPlayer]
          )
            .then(() => {
              this.addTriangle(
                currentPlayer,
                _.clone(this.postWords[currentPlayer])
              );
              this.postWords[currentPlayer] = [];
            })
            .then(() => {
              if (this.leftTurn <= 0) {
                if (this.playerScore(1) === this.playerScore(2)) {
                  Promise.all(
                    this.showTooltip(1, "引き分け", 5000),
                    this.showTooltip(2, "引き分け", 5000)
                  ).then(() => {
                    this.gameReset();
                  });
                } else if (this.playerScore(1) >= this.playerScore(2)) {
                  this.showTooltip(1, "私の勝ちだ！！", 5000, true).then(() => {
                    this.gameReset();
                  });
                } else {
                  this.showTooltip(2, "俺の勝ちだ！！", 5000, true).then(() => {
                    this.gameReset();
                  });
                }
              }
            });
        }
      });
      this.isBisy = true;
      setTimeout(() => {
        this.isBisy = false;
        this.changePlayer();
      }, 1000);
    },
    gameReset() {
      console.log("gameReset");
      this.words = words.getWords();
      this.postWords[1] = [];
      this.postWords[2] = [];
      this.triangles = [];
      this.currentPlayer = 1;
      this.tooltipContent1 = null;
      this.tooltipContent2 = null;
      this.showTooltipPlayer1 = false;
      this.showTooltipPlayer2 = false;
      this.turn = 0;
    },
    // 三角形が完成した時の演出
    animationAddTriangle(currentPlayer, points) {
      return this.showTooltip(currentPlayer, [points[0].word].join("!!\n"), 500)
        .then(() =>
          this.showTooltip(
            currentPlayer,
            [points[0].word, points[1].word, ""].join("!!\n"),
            500
          )
        )
        .then(() =>
          this.showTooltip(
            currentPlayer,
            [points[0].word, points[1].word, points[2].word, ""].join("!!\n"),
            500
          )
        )
        .then(() => {
          const score = Math.ceil(
            calcTriangleArea(
              points.map((point) => {
                return [point.x * SCORE_BIAS, point.y * SCORE_BIAS];
              })
            )
          );

          let content = "";
          if (score >= 10000) {
            content = `夏の大三角！！！ ${score}点だ！！！`;
          } else if (score >= 5000) {
            content = `バミューダトライアングル！！！ ${score}点だ！！！`;
          } else if (score >= 2000) {
            content = `ピラミッド！！！ ${score}点だ！！！`;
          } else if (score >= 1000) {
            content = `おにぎり！！！ ${score}点だ！！！`;
          } else {
            content = `はんぺん！！！ ${score}点だ！！！`;
          }
          return this.showTooltip(currentPlayer, content, 1000, true);
        });
    },
    showTooltip(player, content, time, isSpeech) {
      return new Promise((resolve) => {
        if (player === 1) {
          this.tooltipContent1 = content;
          this.showTooltipPlayer1 = true;
        } else {
          this.tooltipContent2 = content;
          this.showTooltipPlayer2 = true;
        }

        if (isSpeech) {
          const uttr = new SpeechSynthesisUtterance(content);
          speechSynthesis.speak(uttr);
        }

        setTimeout(() => {
          if (player === 1) {
            this.tooltipContent1 = null;
            this.showTooltipPlayer1 = false;
          } else {
            this.tooltipContent2 = null;
            this.showTooltipPlayer2 = false;
          }
          resolve();
        }, time);
      });
    },
    addTriangle(player, points) {
      this.triangles.push({
        player,
        points,
      });
    },
    changePlayer() {
      if (this.currentPlayer === 1) {
        this.currentPlayer = 2;
      } else {
        this.currentPlayer = 1;
      }
      this.turn++;
    },
  },
};
</script>

<style>
.tooltip {
  position: absolute;
  bottom: 45%;
  font-size: 20px;
  padding: 24px;
  border: solid;
  border-radius: 100%;
  background-color: white;
}

#player1,
#player2 {
  box-sizing: border-box;
}

#player1 .tooltip {
  right: 8px;
}

#player2 .tooltip {
  left: 8px;
}

.message {
  color: black;
}

.gages {
  border: solid;
}

.gage {
  border: solid;
  padding: 10px;
}

#player1 .is-charge {
  background-color: red;
}

#player2 .is-charge {
  background-color: blue;
}

.my-turn {
  border-bottom: solid 16px rgb(21, 255, 0);
}
</style>