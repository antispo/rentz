class RentzGame {
    constructor(players) {
        this.players = players
        let s = 0
        for (let i=1; i<players.length; i++) {
            s += i * 100
        }
        let i = 0;
        this.gameState = (
            ["King", "queens", "rombs", "hands", "tplus", "tminus", "rents"].map( g => {
                return {
                    name: g,
                    players: [
                        players.map(p => {
                            i++
                            return { id: i, done: false, }
                        })                   
                    ]
                }
            })
        )

        this.scoreBar = {
            "select": "---",
            "King": -100, 
            "queens": -100,
            "rombs": -120,
            "hands": -80, 
            "tplus": 400,
            "tminus": -400,
            "rents": s
        }
    }
}

export { RentzGame }