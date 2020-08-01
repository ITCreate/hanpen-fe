<template>
  <div class="container border">
    <div class="has-text-centered is-size-1 mb-4">プレイヤー{{ currentPlayer }}の番です</div>
    <div class="columns">
      <div class="column card">
        <!-- プレイヤー1の情報 -->
        <div>プレイヤー1のスコア: {{playerScore(1)}}</div>
        <div>プレイヤー1のポスト数: {{postWords[1].length}}</div>
      </div>

      <svg
        class="card"
        width="700"
        height="700"
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
            font-size="70px"
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
            font-size="70px"
          >{{ postWord.word }}</text>
        </template>
        <template v-for="(triangle) in triangles">
          <polygon
            :fill="triangle.player === 1? 'red' : 'blue'"
            style="fill-opacity: .25;"
            :key="toPoints(triangle.points)"
            :points="toPoints(triangle.points)"
          />
          <text
            v-for="word in triangle.points"
            :key="word.word"
            :x="word.x * 100"
            :y="word.y * 100"
            font-size="70px"
          >{{ word.word }}</text>
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

      <div class="column card">
        <!-- プレイヤー1の情報 -->
        <div>プレイヤー2のスコア: {{playerScore(2)}}</div>
        <div>プレイヤー2のポスト数: {{postWords[2].length}}</div>
      </div>
    </div>
    <div class="columns is-multiline is-variable">
      <!-- 出す単語を選ぶ -->
      <div
        class="column card is-2 has-text-centered"
        v-for="word in hands"
        :key="word.word"
        @click="postWord(word)"
      >{{word.word}}</div>
    </div>
  </div>
</template>

<script>
import words from "../Words";
import _ from "lodash";
import { calcTriangleArea } from "../PolygonUtil";

const HANDS_NUM = 12;

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
            Math.floor(
              calcTriangleArea(
                triangle.points.map((point) => {
                  return [point.x, point.y];
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
      if (this.postWords[this.currentPlayer].length === 3) {
        this.addTriangle(
          this.currentPlayer,
          _.clone(this.postWords[this.currentPlayer])
        );
        this.postWords[this.currentPlayer] = [];
      }
      this.changePlayer();
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
    },
  },
};
</script>

<style>
.message {
  color: black;
}
</style>