import React, { Component } from "react";
import { GameBoardLayout } from "./GameBoardLayout";
import { monopolyInstance } from "../../models/Monopoly";
import "./gameBoard.css";

export class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: true,
      currentTurn:
        monopolyInstance.Players &&
        monopolyInstance.Players.current &&
        monopolyInstance.Players.current(),
      diceValues: {
        one: 0,
        two: 0,
      },
    };
  }

  componentDidMount() {
    if (!monopolyInstance.Players.current) this.props.history.push("/");
  }

  rollDice = () => {
    const one = Math.floor(Math.random() * 6) + 1;
    const two = Math.floor(Math.random() * 6) + 1;
    this.setState(
      () => ({ diceValues: { one, two } }),
      () => this.updatePlayerPositions()
    );
  };

  updateCurrentPlayerCurrentIndex = () => {
    const currentTurn = this.state.currentTurn;
    const diceValue =
      currentTurn.currentIndex +
      this.state.diceValues.one +
      this.state.diceValues.two;
    currentTurn.currentIndex = diceValue > 40 ? diceValue - 40 : diceValue;
    this.setState({
      ...this.state,
      refresh: !this.state.refresh,
    });
  };

  updatePlayerPositions = () => {
    const isFirstTurnOfEveryPlayer = [...monopolyInstance.Players].every(
      (player) => !player.playerTurn
    );
    const currentTurn = this.state.currentTurn;
    const { one, two } = this.state.diceValues;
    if (isFirstTurnOfEveryPlayer) {
      currentTurn.lastDiceValue = one + two;
      this.toggleCurrentTurn();
      const isFirstTurnPlayedByEveryOne = [...monopolyInstance.players].every(
        (player) => player.lastDiceValue
      );

      if (isFirstTurnPlayedByEveryOne) {
        const greatestFirstDiceValue = Math.max(
          ...[...monopolyInstance.Players].map((player) => player.lastDiceValue)
        );
        const playerIndexWithGreatestDiceValue = [
          ...monopolyInstance.Players,
        ].findIndex(
          (player) => player.lastDiceValue === greatestFirstDiceValue
        );
        monopolyInstance.Players.index = playerIndexWithGreatestDiceValue;

        this.setState(
          () => ({
            refresh: !this.state.refresh,
            currentTurn:
              monopolyInstance.Players &&
              monopolyInstance.Players.current &&
              monopolyInstance.Players.current(),
          }),
          () => this.updateCurrentPlayerCurrentIndex()
        );
      }
    } else this.updateCurrentPlayerCurrentIndex();
  };

  toggleCurrentTurn = () => {
    monopolyInstance.Players.next();
    this.setState(() => ({
      currentTurn:
        monopolyInstance.Players &&
        monopolyInstance.Players.current &&
        monopolyInstance.Players.current(),
    }));
  };

  render() {
    console.log(this.state);

    return (
      <>
        <div className="responsive">
          <GameBoardLayout
            players={monopolyInstance.Players}
            currentPlayer={this.state.currentTurn}
            diceValues={this.state.diceValues}
            onDiceRoll={this.rollDice}
            toggleCurrentTurn={this.toggleCurrentTurn}
          />
        </div>
      </>
    );
  }
}
