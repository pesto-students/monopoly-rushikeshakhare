import React from "react";
import data from "../../data/gameBlocks.json";
import { SQUARE_TYPES } from "../../Constants";
import { GameBox } from "../../components";
import { BOX_TYPES } from "../../Constants";
export const GameBoardLayout = (props) => {
  const { onDiceRoll, diceValues } = props;
  const getGameBottomSide = () => data.slice(0, 11).reverse();

  const getGameLeftSide = () => [...data.slice(11, 20).reverse()];

  const getGameRightSide = () => data.slice(31, 40);

  const getGameTopSide = () => data.slice(20, 31);

  const getBoxType = (boxElement) => {
    const { name, pricetext, baserent, price } = boxElement;
    const nameInLowerCase = name.toLowerCase();
    if (nameInLowerCase === "go") {
      return { type: BOX_TYPES.GO, price: 200 };
    } else if (nameInLowerCase.includes("tax"))
      return {
        type: BOX_TYPES.TAX,
        price: parseInt(pricetext.replace(/^\D+/g, "")),
      };
    else if (nameInLowerCase === "just visiting")
      return { type: BOX_TYPES.JAIL, price: null };
    else if (nameInLowerCase === "free parking")
      return { type: BOX_TYPES.PARKING, price: null };
    else if (nameInLowerCase === "chance")
      return { type: BOX_TYPES.CHANCE, price: null };
    else if (nameInLowerCase === "community chest")
      return { type: BOX_TYPES.COMMUNITY, price: null };
    else if (nameInLowerCase === "go to jail")
      return { type: BOX_TYPES.GO_TO_JAIL, price: null };
    else if (
      nameInLowerCase.includes("railroad") ||
      nameInLowerCase.includes("short line")
    )
      return { type: BOX_TYPES.RAILROADS, price };
    else if (typeof baserent === "string" && typeof price === "number")
      return {
        type: BOX_TYPES.UTILITIES,
        price,
      };
    else if (typeof baserent === "number")
      return {
        type: BOX_TYPES.AVENUE,
        price,
      };
  };

  return (
    <div className="mainSquare">
      <div className="row top">
        {getGameTopSide().map((element, index) => {
          if (index === 0 || index === 10) {
            return (
              <GameBox
                type={SQUARE_TYPES.CORNER_SQUARE}
                id={20 + index + 1}
                key={index}
                boxType={getBoxType(element)}
                {...element}
                {...props}
              />
            );
          }
          return (
            <GameBox
              type={SQUARE_TYPES.VERTICAL_SQUARE}
              id={20 + index + 1}
              key={index}
              boxType={getBoxType(element)}
              {...element}
              {...props}
            />
          );
        })}
      </div>
      <div className="row center">
        <div className="corner-square">
          {getGameLeftSide().map((element, index) => {
            return (
              <GameBox
                type={SQUARE_TYPES.SIDE_SQUARE}
                id={11 + (9 - index)}
                key={index}
                boxType={getBoxType(element)}
                {...element}
                {...props}
              />
            );
          })}
        </div>
        <div className="center-square">
          <div
            style={{
              position: "absolute",
            }}
          >
            <div className="player-balance">
              <b> Balance</b>
            </div>
            {[...props.players].map(({ balance, color, name }, index) => (
              <div className="player-balance">
                <div
                  style={{ border: `2px solid ${color}` }}
                  className="player-balance-item"
                >
                  <span>
                    {name} ${balance}
                    {!index ? <span style={{ color: "red" }}>*</span> : ""}
                  </span>
                </div>
              </div>
            ))}
            <button type="button" onClick={onDiceRoll} className="roll-dice-1">
              Roll
              <br />
              {diceValues.one} {diceValues.two}
            </button>
          </div>
        </div>
        <div className="corner-square">
          {getGameRightSide().map((element, index) => {
            return (
              <GameBox
                type={SQUARE_TYPES.SIDE_SQUARE}
                id={31 + index + 1}
                key={index}
                boxType={getBoxType(element)}
                {...element}
                {...props}
              />
            );
          })}
        </div>
      </div>
      <div className="row top">
        {getGameBottomSide().map((element, index) => (
          <GameBox
            type={
              index === 0 || index === 10
                ? SQUARE_TYPES.CORNER_SQUARE
                : SQUARE_TYPES.VERTICAL_SQUARE
            }
            id={11 - index}
            key={index}
            boxType={getBoxType(element)}
            {...element}
            {...props}
          />
        ))}
      </div>
    </div>
  );
};
