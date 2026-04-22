import * as React from "react";

import Ansi from "../../utils/ansi-to-react";
import { useClassNames } from "../../utils/classNames";

import { consoleItemClassName } from "./StdoutList.css";

export const StdoutList: React.FC<{
  data: Array<{ data: string; id: string }>;
}> = ({ data }) => {
  const classNames = useClassNames();
  return (
    <>
      {data.map(({ data, id }) => {
        return (
          <div
            key={id}
            className={classNames("console-item", [consoleItemClassName])}
          >
            <Ansi>{data}</Ansi>
          </div>
        );
      })}
    </>
  );
};
