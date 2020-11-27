export class Player {
    constructor(playerName, color) {
        this.name = playerName;
        this.color = color
        this.balance = 1500
        this.currentIndex = 1;
        this.ownedProperties = [];
        this.playerTurn = 0;
        this.lastTurnBlockID = null;
        this.lastDiceValue = 0;
        this.getOutOfJailFree = 0;
    }
}