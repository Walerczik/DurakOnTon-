import { Deck } from "./Deck.js";
import { Player } from "./Player.js";

export class Game {
  private io: any;
  private players: Player[] = [];
  private deck: Deck = new Deck();
  private table: { attack: any, defense?: any }[] = [];
  private trumpCard: any;
  private currentDefender: Player | null = null;
  private currentAttacker: Player | null = null;

  constructor(io: any) {
    this.io = io;
    this.deck.shuffle();
    this.trumpCard = this.deck.getTrump();
  }

  handleConnection(socket: any) {
    const newPlayer = new Player(socket.id);
    this.players.push(newPlayer);

    socket.emit("joined", { playerId: newPlayer.id, hand: newPlayer.hand, trumpCard: this.trumpCard });

    if (this.players.length > 1) {
      this.startGame();
    }

    socket.on("playCard", ({ card }) => this.playCard(socket.id, card));
    socket.on("endTurn", () => this.endTurn());
    socket.on("takeCards", () => this.takeCards(socket.id));
  }

  startGame() {
    this.players.forEach(player => player.drawCards(this.deck));
    this.currentAttacker = this.players[0];
    this.currentDefender = this.players[1];
    this.updateAll();
  }

  playCard(playerId: string, card: any) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return;

    if (this.currentAttacker?.id === playerId) {
      this.table.push({ attack: card });
      player.removeCard(card);
    } else if (this.currentDefender?.id === playerId) {
      const attackCard = this.table.find(c => !c.defense);
      if (attackCard) {
        attackCard.defense = card;
        player.removeCard(card);
      }
    }
    this.updateAll();
  }

  endTurn() {
    this.table = [];
    this.players.forEach(p => p.drawCards(this.deck));
    this.rotatePlayers();
    this.updateAll();
  }

  takeCards(playerId: string) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return;

    this.table.forEach(({ attack, defense }) => {
      player.addCard(attack);
      if (defense) player.addCard(defense);
    });
    this.table = [];
    this.updateAll();
  }

  rotatePlayers() {
    this.players.push(this.players.shift()!);
    this.currentAttacker = this.players[0];
    this.currentDefender = this.players[1];
  }

  updateAll() {
    this.players.forEach(p => {
      this.io.to(p.id).emit("updateTable", this.table);
      this.io.to(p.id).emit("updatePlayers", this.players.map(pl => ({
        id: pl.id,
        name: pl.name,
        cardsCount: pl.hand.length,
        isDefender: pl.id === this.currentDefender?.id,
        isAttacker: pl.id === this.currentAttacker?.id
      })));
    });
  }
}
