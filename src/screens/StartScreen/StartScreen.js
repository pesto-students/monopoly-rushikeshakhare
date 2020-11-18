import React, { Component } from "react";
import logo from "../../assets/logo.png";
import { COLORS } from "../../Constants";
import { monopolyInstance } from "../../models/Monopoly";
import { showToast } from "../../utilities";
import "./startScreen.css";

export class StartScreen extends Component {
  state = {
    countValidated: false,
    playerCount: 2,
    playerDetails: [],
  };

  onPlayerDataChange = (property, value, playerIndex) => {
    const playerDetails = this.state.playerDetails.map((player, index) => {
      if (index === playerIndex) return { ...player, [property]: value };
      else return player;
    });

    this.setState(() => ({ playerDetails }));
  };

  onPlayerCountInputChange = (event) => {
    this.setState(() => ({ playerCount: event.target.value }));
  };

  onContinueButtonClick = () => {
    if (this.state.playerCount >= 2)
      this.setState(() => ({
        countValidated: true,
        playerDetails: this.getInitialPlayersData(),
      }));
    else showToast("Enter Player Count Greater Than 2");
  };

  getInitialPlayersData = () => {
    const data = [];
    for (let i = 0; i < this.state.playerCount; i += 1) {
      data.push({ name: "", color: COLORS[i] });
    }
    return data;
  };

  getPlayerFormFields = () => {
    const fields = [];
    for (let i = 0; i < this.state.playerCount; i += 1) {
      fields.push(
        <div className="field-group" key={i}>
          <input
            className="input"
            placeholder="Enter Player Name"
            onChange={(event) =>
              this.onPlayerDataChange("name", event.target.value, i)
            }
            value={this.state.playerDetails[i]?.name}
          />
          <select
            className="input mar-2"
            onChange={(event) =>
              this.onPlayerDataChange("color", event.target.value, i)
            }
            value={
              this.state.playerDetails[i]
                ? this.state.playerDetails[i].color
                : COLORS[i]
            }
          >
            {COLORS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return fields;
  };

  validateGameSettings = () => {
    if (this.state.playerDetails) {
      if (
        this.state.playerDetails.every((player) => player.name && player.color)
      ) {
        monopolyInstance.Players = this.state.playerDetails;
        this.props.history.push("/game");
      } else {
        showToast("Please Enter All Player Details");
      }
    } else showToast("Please Enter Player Details");
  };

  render() {
    return (
      <div className="start-screen">
        <div className="game-logo">
          <img src={logo} alt="Game Logo" />
        </div>
        <div className="game-form">
          {this.state.countValidated ? (
            <>
              {this.getPlayerFormFields()}
              <button
                type="button"
                className="input mar-1"
                onClick={this.validateGameSettings}
              >
                Start Game
              </button>
            </>
          ) : (
            <>
              <input
                type="number"
                className="input"
                onChange={this.onPlayerCountInputChange}
                value={this.state.playerCount}
              />
              <br />
              <button
                type="button"
                className="input mar-1"
                onClick={this.onContinueButtonClick}
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}
