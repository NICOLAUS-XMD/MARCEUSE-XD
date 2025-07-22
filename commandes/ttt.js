"use strict";
class TicTacToe {
  constructor(playerX = "X", playerO = "O") {
    this.playerX = playerX; // Mchezaji X (chaguo-msingi "X")
    this.playerO = playerO; // Mchezaji O (chaguo-msingi "O")
    this._currentTurn = false; // Zamu ya sasa (false = X, true = O)
    this._x = 0; // Bitmask kwa nafasi za X
    this._o = 0; // Bitmask kwa nafasi za O
    this.turns = 0; // Idadi ya zamu
  }

  // Inarudisha gridi ya mchezo (X na O zilizowekwa)
  get board() {
    return this._x | this._o;
  }

  // Inarudisha mchezaji wa sasa (X au O)
  get currentTurn() {
    return this._currentTurn ? this.playerO : this.playerX;
  }

  // Inarudisha mchezaji mwingine
  get enemyTurn() {
    return this._currentTurn ? this.playerX : this.playerO;
  }

  // Inakagua ikiwa kuna mshindi kwa kutumia mseto wa binary
  static check(state) {
    for (let combo of [7, 56, 73, 84, 146, 273, 292, 448])
      if ((state & combo) === combo) return true;
    return false;
  }

  // Inabadilisha kuratibu (x, y) kuwa nafasi ya binary
  static toBinary(x = 0, y = 0) {
    if (x < 0 || x > 2 || y < 0 || y > 2) throw new Error("invalid position");
    return 1 << (x + 3 * y);
  }

  // Inaruhusu mchezaji kuweka alama (X au O)
  turn(player = 0, x = 0, y) {
    if (this.board === 511) return -3; // Mchezo umeisha
    let pos = 0;
    if (y == null) {
      if (x < 0 || x > 8) return -1; // Nafasi isiyo sahihi
      pos = 1 << x;
    } else {
      if (x < 0 || x > 2 || y < 0 || y > 2) return -1; // Kuratibu zisizo sahihi
      pos = TicTacToe.toBinary(x, y);
    }
    if (this._currentTurn ^ player) return -2; // Zamu isiyo sahihi
    if (this.board & pos) return 0; // Nafasi imechukuliwa
    this[this._currentTurn ? "_o" : "_x"] |= pos; // Weka alama
    this._currentTurn = !this._currentTurn; // Badilisha zamu
    this.turns++; // Ongeza zamu
    return 1; // Mafanikio
  }

  // Inarudisha gridi kama safu ya X, O, au nambari (1-9)
  static render(boardX = 0, boardO = 0) {
    let x = parseInt(boardX.toString(2), 4);
    let y = parseInt(boardO.toString(2), 4) * 2;
    return [...(x + y).toString(4).padStart(9, "0")]
      .reverse()
      .map((value, index) => (value == 1 ? "X" : value == 2 ? "O" : ++index));
  }

  // Inarudisha gridi ya mchezo wa sasa
  render() {
    return TicTacToe.render(this._x, this._o);
  }

  // Inarudisha mshindi (X, O, au false)
  get winner() {
    let x = TicTacToe.check(this._x);
    let o = TicTacToe.check(this._o);
    return x ? this.playerX : o ? this.playerO : false;
  }
}

module.exports = TicTacToe; // Inasafirisha darasa