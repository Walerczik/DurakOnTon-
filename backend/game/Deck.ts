const suits = ["♠️", "♥️", "♣️", "♦️"];
const ranks = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export class Deck {
  cards: any[];

  constructor() {
    this.cards = suits.flatMap(suit => ranks.map(rank => ({ suit, rank })));
    this.shuffle();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw() {
    return this.cards.pop();
  }

  isEmpty() {
    return this.cards.length === 0;
  }

  getTrump() {
    return this.cards[this.cards.length - 1];
  }
}
