class RentzGame {
  constructor(players) {
    this.players = players;
    let s = 0;
    for (let i = 1; i < players.length; i++) {
      s += i * 100;
    }
    let i = 0;
    let rombs = -40 * players.length;
    // king queens rombs hands & decar :D
    let totalsMinus = -100 - 100 - 100 + rombs - 80;
    console.log(players.length);
    this.gameState = [
      'Dame',
      'Romburi',
      'Popa',
      'Decar',
      'Levate',
      'Whist',
      'Totale+',
      'Totale-',
      'Rentz'
    ].map(g => {
      return {
        name: g,
        players: [
          players.map(p => {
            i++;
            return { id: i, done: 0 };
          })
        ]
      };
    });

    this.scoreBar = {
      select: '---',
      Dame: -100,
      Romburi: rombs,
      Popa: -100,
      Decar: 100,
      Levate: -80,
      Whist: 80,
      'Totale+': -totalsMinus,
      'Totale-': totalsMinus,
      Rentz: s
    };
  }
}

export { RentzGame };
