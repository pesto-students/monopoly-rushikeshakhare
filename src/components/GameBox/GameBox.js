import React, { useEffect, useState } from "react";
import { BOX_TYPES } from "../../Constants";
import { showToast } from "../../utilities";
import { monopolyInstance } from "../../models/Monopoly";
import { ActionPopup } from "./ActionPopup";
import "./gameBox.scss";

export const GameBox = (props) => {
  const {
    type,
    name,
    id,
    players,
    currentPlayer,
    toggleCurrentTurn,
    baserent,
    boxType,
    diceValues,
  } = props;
  const [playerAction, setPlayerAction] = useState(null);

  const isGo = () => name === "GO";

  const getPropertyOwner = () => {
    return [...players].find((player) =>
      player.ownedProperties.find((property) => property.name === name)
    );
  };

  const getCurrentRentForProperty = () => {
    const currentOwner = getPropertyOwner();
    if (!currentOwner) return 0;
    const propertyDetails = currentOwner.ownedProperties.find(
      (property) => property.name === name
    );
    if (boxType.type === BOX_TYPES.AVENUE) {
      if (!propertyDetails.rentLevel) return baserent;
      else return props[`rent${propertyDetails.rentLevel}`];
    } else if (boxType.type === BOX_TYPES.RAILROADS) {
      const allRailRoads = currentOwner.ownedProperties.filter(
        (property) => property.type === BOX_TYPES.RAILROADS
      );
      if (allRailRoads.length === 1) return 25;
      if (allRailRoads.length === 2) return 50;
      if (allRailRoads.length === 3) return 100;
      if (allRailRoads.length === 4) return 200;
    } else if (boxType.type === BOX_TYPES.UTILITIES) {
      const allUtilities = currentOwner.ownedProperties.filter(
        (property) => property.type === BOX_TYPES.UTILITIES
      );
      if (allUtilities.length === 1) return 4 * diceValues.one * diceValues.two;
      if (allUtilities.length === 2)
        return 10 * diceValues.one * diceValues.two;
    }
  };

  const isGameYetToStart = () => {
    const colors = [...players]
      .filter((player) => !player.playerTurn)
      .map((player) => player.color);

    if (isGo() && colors.length)
      return colors.map((color) => (
        <div style={{ backgroundColor: color }} className="player-box" />
      ));
    else return null;
  };

  const rentProperty = () => {
    const currentOwner = getPropertyOwner();

    const currentRent = getCurrentRentForProperty();
    currentPlayer.balance -= currentRent;
    currentOwner.balance += currentRent;

    const newPropertyData = currentOwner.ownedProperties.map((property) => {
      if (property.name === name)
        return {
          ...property,
          rentLevel: property.rentLevel + 1 > 5 ? 5 : property.rentLevel + 1,
        };
      else return property;
    });

    currentOwner.ownedProperties = newPropertyData;
    const message = `${currentPlayer.name} rented ${name} at $${currentRent} from ${currentOwner.name}`;
    logAndShow(message);
    setPlayerAction(null);
    toggleCurrentTurn();
  };

  const buyProperty = () => {
    currentPlayer.ownedProperties.push({
      name,
      rentLevel: 0,
      timeStamp: Date.now(),
      type: boxType.type,
    });
    currentPlayer.balance -= boxType.price;
    currentPlayer.playerTurn += 1;
    const message = `${currentPlayer.name} bought ${name} at $ ${boxType.price}`;
    logAndShow(message);
    setPlayerAction(null);
    toggleCurrentTurn();
  };

  const logAndShow = (message) => {
    showToast(message);
    monopolyInstance.logs.push(message);
  };

  const handlePropertyTransaction = () => {
    if (playerAction === "Buy") {
      buyProperty();
    } else if (playerAction === "Rent") {
      rentProperty();
    }
  };

  const handlePropertyDealing = () => {
    const isPropertyOwnedByCurrentPlayer = currentPlayer.ownedProperties.find(
      (property) => property.name === name
    );
    if (isPropertyOwnedByCurrentPlayer) {
      toggleCurrentTurn();
      return;
    }
    if (!isPropertyOwnedByCurrentPlayer) {
      const currentOwner = getPropertyOwner();
      if (currentOwner) {
        setPlayerAction("Rent");
      } else {
        setPlayerAction("Buy");
      }
    }
  };

  const showPlayerCurrentPosition = () => {
    const colors = [...players]
      .filter((player) => player.currentIndex === id)
      .map((player) => player.color);

    return colors.map((color) => (
      <div style={{ backgroundColor: color }} className="player-box" />
    ));
  };

  const getPropertyBoughtColor = () => {
    const currentOwner = getPropertyOwner();
    if (currentOwner) {
      return (
        <div
          className="owner"
          style={{ backgroundColor: currentOwner.color }}
        ></div>
      );
    } else return null;
  };

  const getRandomElementFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const chanceAction = (action) => {
    if (
      action ===
      "GET OUT OF JAIL FREE. This card may be kept until needed or traded."
    ) {
      currentPlayer.getOutOfJailFree += 1;
      logAndShow("Collected Get out of Jail Free Card");
    }
    if (
      action ===
      "Make General Repairs on All Your Property. For each house pay $25. For each hotel $100."
    ) {
      //Action needed
      logAndShow(action);
    }
    if (action === "Speeding fine $15.") {
      currentPlayer.balance -= 15;
      logAndShow(action);
    }

    if (
      action ===
      "You have been elected chairman of the board. Pay each player $50."
    ) {
      [...players].forEach((player) => {
        player.balance += 50;
      });
      currentPlayer.balance -= [...players].length * 50;
      logAndShow(action);
    }

    if (action === "Go back three spaces.") {
      currentPlayer.currentIndex -= 3;
      logAndShow(action);
    }

    if (
      action ===
      "ADVANCE TO THE NEAREST UTILITY. IF UNOWNED, you may buy it from the Bank. IF OWNED, throw dice and pay owner a total ten times the amount thrown."
    ) {
      const distanceToEletric = 13 - currentPlayer.currentIndex;
      const distanceToWaterWorks = 29 - currentPlayer.currentIndex;
      if (distanceToEletric < distanceToWaterWorks) {
        currentPlayer.currentIndex = 13;
      } else currentPlayer.currentIndex = 29;

      //action needed
      logAndShow(action);
    }

    if (action === "Bank pays you dividend of $50.") {
      currentPlayer.balance += 50;
      logAndShow(action);
    }

    if (
      action ===
      "ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled."
    ) {
      const mins = [
        6 - currentPlayer.currentIndex,
        16 - currentPlayer.currentIndex,
        26 - currentPlayer.currentIndex,
      ];
      const minValue = Math.min(...mins);
      const index = mins.indexOf(minValue);
      if (index === 0) currentPlayer.currentIndex = 6;
      if (index === 1) currentPlayer.currentIndex = 16;
      if (index === 2) currentPlayer.currentIndex = 26;
      //action needed
      logAndShow(action);
    }

    if (action === "Pay poor tax of $15.") {
      currentPlayer.balance -= 15;
      logAndShow(action);
    }

    if (
      action ===
      "Take a trip to Reading Rail Road. If you pass 'GO' collect $200."
    ) {
      // logic needed
      currentPlayer.currentIndex = 6;
      logAndShow(action);
    }

    if (action === "ADVANCE to Boardwalk.") {
      currentPlayer.currentIndex = 40;
      logAndShow(action);
    }

    if (
      action === "ADVANCE to Illinois Avenue. If you pass 'GO' collect $200."
    ) {
      //logic needed
      currentPlayer.currentIndex = 40;
      logAndShow(action);
    }
  };

  const communityAction = (action) => {
    if (
      action ===
      "Get out of Jail, Free. This card may be kept until needed or sold."
    ) {
      currentPlayer.getOutOfJailFree += 1;
      logAndShow("Collected Get out of Jail Free Card");
    }

    if (
      action === "You have won second prize in a beauty contest. Collect $10."
    ) {
      currentPlayer.balance += 10;
      logAndShow("You have won second prize in a beauty contest. Collect $10.");
    }

    if (action === "From sale of stock, you get $50.") {
      currentPlayer.balance += 50;
      logAndShow(action);
    }

    if (action === "Life insurance matures. Collect $100.") {
      currentPlayer.balance += 100;
      logAndShow(action);
    }

    if (action === "Income tax refund. Collect $20.") {
      currentPlayer.balance += 20;
      logAndShow(action);
    }

    if (action === "Holiday fund matures. Receive $100.") {
      currentPlayer.balance += 100;
      logAndShow(action);
    }

    if (action === "You inherit $100.") {
      currentPlayer.balance += 100;
      logAndShow(action);
    }

    if (action === "Receive $25 consultancy fee.") {
      currentPlayer.balance += 25;
      logAndShow(action);
    }

    if (action === "Pay hospital fees of $100.") {
      currentPlayer.balance -= 100;
      logAndShow(action);
    }

    if (action === "Bank error in your favor. Collect $200.") {
      currentPlayer.balance += 200;
      logAndShow(action);
    }

    if (action === "Pay school fees of $50.") {
      currentPlayer.balance -= 50;
      logAndShow(action);
    }

    if (action === "Doctor's fee. Pay $50.") {
      currentPlayer.balance -= 50;
      logAndShow(action);
    }

    if (action === "It is your birthday. Collect $10 from every player.") {
      [...players].forEach((player) => {
        player.balance -= 10;
      });
      currentPlayer.balance += [...players].length * 10;
      logAndShow(action);
    }

    if (action === "Advance to 'GO' (Collect $200)") {
      currentPlayer.currentIndex = 1;
      currentPlayer.balance += 200;
      logAndShow(action);
    }

    if (
      action ===
      "Go to Jail. Go directly to Jail. Do not pass 'GO'. Do not collect $200."
    ) {
      currentPlayer.currentIndex = 11;
      currentPlayer.isInJail = 1;
      logAndShow(action);
    }

    //"You are assessed for street repairs. $40 per house. $115 per hotel.",
  };

  const getPopupContent = () => {
    return (
      <>
        <h5 className="popup-header">Please Choose Action</h5>
        <h6>
          Property
          {playerAction === "Buy"
            ? `Price : ${boxType.price}`
            : `Rent : $${getCurrentRentForProperty()}`}
        </h6>
        <h6>Property Name : {name}</h6>
        <h6>Player Name : {currentPlayer.name}</h6>
        <br />
        <button
          className="input"
          style={{ width: "100%" }}
          type="button"
          onClick={handlePropertyTransaction}
        >
          {playerAction}
        </button>
      </>
    );
  };

  useEffect(() => {
    if (
      currentPlayer.currentIndex === id &&
      currentPlayer.lastTurnBlockID !== id
    ) {
      if (
        boxType.type === BOX_TYPES.AVENUE ||
        boxType.type === BOX_TYPES.UTILITIES ||
        boxType.type === BOX_TYPES.RAILROADS
      ) {
        handlePropertyDealing();
      } else if (boxType.type === BOX_TYPES.JAIL) {
        toggleCurrentTurn();
      } else if (boxType.type === BOX_TYPES.COMMUNITY) {
        const communityCard = getRandomElementFromArray(
          monopolyInstance.communityCards
        );
        communityAction(communityCard);
        toggleCurrentTurn();
      } else if (boxType.type === BOX_TYPES.CHANCE) {
        toggleCurrentTurn();
      } else if (boxType.type === BOX_TYPES.TAX) {
        currentPlayer.balance -= boxType.price;
        const message = `${currentPlayer.name} Paid ${name} of $${boxType.price}`;
        logAndShow(message);
        toggleCurrentTurn();
      } else {
        toggleCurrentTurn();
      }
    }
    if (currentPlayer.currentIndex === id) {
      currentPlayer.lastTurnBlockID = id;
    }
  }, [JSON.stringify(currentPlayer)]);

  useEffect(() => {
    console.log(monopolyInstance);
  }, [JSON.stringify(monopolyInstance)]);

  return (
    <div className={type}>
      <div className="firstLine firstLine-bottom">
        {name} <br /> {id}
        {showPlayerCurrentPosition()}
      </div>
      {getPropertyBoughtColor()}
      {playerAction && <ActionPopup>{getPopupContent()}</ActionPopup>}
    </div>
  );
};
