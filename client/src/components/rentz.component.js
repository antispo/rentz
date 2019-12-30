class RentzGame {
    constructor(players) {
        this.players = players
        let s = 0
        for (let i=1; i<players.length; i++) {
            s += i * 100
        }
        let i = 0;
        let rombs = -40 * players.length
        let totalsMinus = -100 -100 +rombs -80
        console.log(players.length)
        this.gameState = (
            ["King", "queens", "rombs", "hands", "tplus", "tminus", "rents"].map( g => {
                return {
                    name: g,
                    players: [
                        players.map(p => {
                            i++
                            return { id: i, done: 0, }
                        })                   
                    ]
                }
            })
        )

        this.scoreBar = {
            "select": "---",
            "King": -100, 
            "queens": -100,
            "rombs": rombs,
            "hands": -80, 
            "tplus": -totalsMinus,
            "tminus": totalsMinus,
            "rents": s
        }
    }
}

export { RentzGame }