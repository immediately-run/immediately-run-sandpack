import React from "react";

import {
  buttonClassName,
  roundedButtonClassName,
} from "../../styles/shared.css";
import { useClassNames } from "../../utils/classNames";
import { ConsoleIcon } from "../icons";

import {
  flexClassName,
  headerButtonClassName,
  headerTitleClassName,
  wrapperClassName,
} from "./Header.css";

export const Header: React.FC<{
  currentTab: "server" | "client";
  setCurrentTab: (value: "server" | "client") => void;
  node: boolean;
}> = ({ currentTab, setCurrentTab, node }) => {
  const classNames = useClassNames();

  const buttonsClassName = classNames("console-header-button", [
    buttonClassName,
    roundedButtonClassName,
    headerButtonClassName,
  ]);

  return (
    <div
      className={classNames("console-header", [
        wrapperClassName,
        flexClassName,
      ])}
    >
      <p className={classNames("console-header-title", [headerTitleClassName])}>
        <ConsoleIcon />
        <span>Terminal</span>
      </p>

      {node && (
        <div className={classNames("console-header-actions", [flexClassName])}>
          <button
            className={buttonsClassName}
            data-active={currentTab === "server"}
            onClick={(): void => setCurrentTab("server")}
            type="button"
          >
            Server
          </button>

          <button
            className={buttonsClassName}
            data-active={currentTab === "client"}
            onClick={(): void => setCurrentTab("client")}
            type="button"
          >
            Client
          </button>
        </div>
      )}
    </div>
  );
};
