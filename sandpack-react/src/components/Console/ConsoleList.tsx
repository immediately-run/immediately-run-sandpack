import * as React from "react";

import { useClassNames } from "../../utils/classNames";
import { CodeEditor } from "../CodeEditor";

import { consoleItemClassName } from "./ConsoleList.css";
import { fromConsoleToString } from "./utils/fromConsoleToString";
import type { SandpackConsoleData } from "./utils/getType";
import { getType } from "./utils/getType";

export const ConsoleList: React.FC<{ data: SandpackConsoleData }> = ({
  data,
}) => {
  const classNames = useClassNames();
  return (
    <>
      {data.map(({ data, id, method }, logIndex, references) => {
        if (!data) return null;

        if (Array.isArray(data)) {
          return (
            <React.Fragment key={id}>
              {data.map((msg, msgIndex) => {
                const fixReferences = references.slice(
                  logIndex,
                  references.length,
                );

                return (
                  <div
                    key={`${id}-${msgIndex}`}
                    className={classNames("console-item", [
                      consoleItemClassName({ variant: getType(method) }),
                    ])}
                  >
                    <CodeEditor
                      code={
                        method === "clear"
                          ? (msg as string)
                          : fromConsoleToString(msg, fixReferences)
                      }
                      fileType="js"
                      initMode="user-visible"
                      showReadOnly={false}
                      readOnly
                      wrapContent
                    />
                  </div>
                );
              })}
            </React.Fragment>
          );
        }

        return null;
      })}
    </>
  );
};

