import * as React from "react";

import { roundedButtonClassName, buttonClassName } from "../../styles/shared.css";
import { useClassNames } from "../../utils/classNames";
import { ConsoleIcon } from "../icons";

import {
  flexClassName,
  headerButtonClassName,
  headerTitleClassName,
  wrapperClassName,
} from "./Header.css";
import type { Status } from "./SandpackTests";

interface Props {
  setVerbose: () => void;
  setSuiteOnly: () => void;
  verbose: boolean;
  suiteOnly: boolean;
  status: Status;
  watchMode: boolean;
  setWatchMode: () => void;
  showSuitesOnly: boolean;
  showVerboseButton: boolean;
  showWatchButton: boolean;
  hideTestsAndSupressLogs: boolean;
}

export const Header: React.FC<Props> = ({
  status,
  suiteOnly,
  setSuiteOnly,
  setVerbose,
  verbose,
  watchMode,
  setWatchMode,
  showSuitesOnly,
  showWatchButton,
  showVerboseButton,
  hideTestsAndSupressLogs,
}) => {
  const classNames = useClassNames();

  const buttonsClassName = classNames("test-header-button", [
    buttonClassName,
    roundedButtonClassName,
    headerButtonClassName,
  ]);

  return (
    <div
      className={classNames("test-header", [wrapperClassName, flexClassName])}
    >
      <div className={classNames("test-header-wrapper", [flexClassName])}>
        <p
          className={classNames("test-header-title", [headerTitleClassName])}
        >
          <ConsoleIcon />
          Tests
        </p>
      </div>

      <div className={classNames("test-header-actions", [flexClassName])}>
        {showSuitesOnly && (
          <button
            className={buttonsClassName}
            data-active={suiteOnly}
            disabled={status === "initialising"}
            onClick={setSuiteOnly}
            type="button"
          >
            Suite only
          </button>
        )}
        {showVerboseButton && (
          <button
            className={buttonsClassName}
            data-active={verbose}
            disabled={status === "initialising" || hideTestsAndSupressLogs}
            onClick={setVerbose}
            type="button"
          >
            Verbose
          </button>
        )}
        {showWatchButton && (
          <button
            className={buttonsClassName}
            data-active={watchMode}
            disabled={status === "initialising"}
            onClick={setWatchMode}
            type="button"
          >
            Watch
          </button>
        )}
      </div>
    </div>
  );
};
