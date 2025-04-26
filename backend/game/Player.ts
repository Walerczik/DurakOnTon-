import { Deck } from "./Deck.js";

export class Player {
  id: string;
  name: string;
  hand: any[];

  constructor(id: string) {
    this.id = id;
    this.name = `Игрок ${id.substring(0, 5)}`;
    this.hand = [];
  }

  drawCards(deck: Deck) {
    while (this.hand.length < 6 && !deck.isEmpty()) {
      this.hand.push(deck.draw());
    }
  }

  addCard(card: any) {
    this.hand.push(card);
  }

  removeCard(card: any) {
    const index = this.hand.findIndex(c => c.rank === card.rank && c.suit === card.suit);
    if (index !== -1) {
      this.hand.splice(index, 1);
    }
  }
}
