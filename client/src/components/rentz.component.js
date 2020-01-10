const createRentzGame = players => {
  let i = 0;
  return [
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
          return { id: i, done: 0, name: p.name };
        })
      ]
    };
  });
};

export { createRentzGame };
