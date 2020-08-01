<template>
  <div class="container border mt-2">
    <div class="is-size-1 has-text-centered">残り{{ 3 - Math.floor(turn/6) }}ターン</div>
    <div class="columns">
      <div
        id="player1"
        class="column card"
        :class="{ 'my-turn': currentPlayer === 1 }"
        style="background-image: url('./study_gogaku_woman6_japanese.png'); background-repeat: no-repeat;
    background-position: 50% 90%;"
      >
        <!-- プレイヤー1の情報 -->
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

      <svg
        class="card"
        width="600"
        height="600"
        viewBox="-1248.2345089531165 -1547.8524966162418 2727.0341099966664 2259.416395800985"
      >
        <template v-for="postWord in postWords[1]">
          <circle
            fill="red"
            :key="postWord.word"
            :cx="postWord.x * 100"
            :cy="postWord.y * 100"
            r="10"
          />
          <text
            :key="postWord.word"
            :x="postWord.x * 100"
            :y="postWord.y * 100"
            font-size="80px"
          >{{ postWord.word }}</text>
        </template>
        <template v-for="postWord in postWords[2]">
          <circle
            fill="blue"
            :key="postWord.word"
            :cx="postWord.x * 100"
            :cy="postWord.y * 100"
            r="10"
          />
          <text
            :key="postWord.word"
            :x="postWord.x * 100"
            :y="postWord.y * 100"
            font-size="80px"
          >{{ postWord.word }}</text>
        </template>
        <template v-for="(triangle) in triangles">
          <polygon
            :fill="triangle.player === 1? 'red' : 'blue'"
            style="fill-opacity: .1;"
            :key="toPoints(triangle.points)"
            :points="toPoints(triangle.points)"
          />
          <!-- <text
            v-for="word in triangle.points"
            :key="word.word"
            :x="word.x * 100"
            :y="word.y * 100"
            font-size="70px"
          >{{ word.word }}</text>-->
          <circle
            v-for="word in triangle.points"
            :fill="triangle.player === 1? 'red' : 'blue'"
            :key="word.word"
            :cx="word.x * 100"
            :cy="word.y * 100"
            r="10"
          />
        </template>
      </svg>

      <div
        id="player2"
        class="column card"
        :class="{ 'my-turn': currentPlayer === 2 }"
        style="background-image: url('./study_gogaku_man6_japanese.png'); background-repeat: no-repeat;
    background-position: 50% 90%;"
      >
        <!-- プレイヤー1の情報 -->
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
    <div>
      <!-- 出す単語を選ぶ -->
      <p class="is-size-2 mb-4">プレイヤー{{ currentPlayer }}の番です 出す単語を選んでください</p>
      <div class="columns is-multiline">
        <div
          class="column is-2 has-text-centered"
          v-for="word in hands"
          :key="word.word"
          @click="postWord(word)"
        >
          <div class="card is-size-5">{{word.word}}</div>
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
  },
  mounted() {},
  methods: {
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
        .map((word) => `${word.x * 100},${word.y * 100}`)
        .join(" ");
    },
    postWord(word) {
      this.postWords[this.currentPlayer].push(word);
      const currentPlayer = this.currentPlayer;
      this.showTooltip(currentPlayer, word.word, 500).then(() => {
        if (this.postWords[currentPlayer].length === 3) {
          this.showTooltip(
            currentPlayer,
            [this.postWords[currentPlayer][0].word].join("!!\n"),
            500
          )
            .then(() =>
              this.showTooltip(
                currentPlayer,
                [
                  this.postWords[currentPlayer][0].word,
                  this.postWords[currentPlayer][1].word,
                  "",
                ].join("!!\n"),
                500
              )
            )
            .then(() =>
              this.showTooltip(
                currentPlayer,
                [
                  this.postWords[currentPlayer][0].word,
                  this.postWords[currentPlayer][1].word,
                  this.postWords[currentPlayer][2].word,
                  "",
                ].join("!!\n"),
                500
              )
            )
            .then(() => {
              const score = Math.ceil(
                calcTriangleArea(
                  this.postWords[currentPlayer].map((point) => {
                    return [point.x * SCORE_BIAS, point.y * SCORE_BIAS];
                  })
                )
              );
              return this.showTooltip(currentPlayer, `${score}点だ！！！`, 500);
            })
            .then(() => {
              this.addTriangle(
                currentPlayer,
                _.clone(this.postWords[currentPlayer])
              );
              this.postWords[currentPlayer] = [];
            });
        }
      });
      this.changePlayer();
    },
    showTooltip(player, content, time) {
      return new Promise((resolve) => {
        if (player === 1) {
          this.tooltipContent1 = content;
          this.showTooltipPlayer1 = true;
        } else {
          this.tooltipContent2 = content;
          this.showTooltipPlayer2 = true;
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