import * as React from "react";

import { useClassNames } from "../../utils/classNames";

import { containerClassName, nameClassName } from "./Describes.css";
import type { Test } from "./Tests";
import { Tests } from "./Tests";
import { isEmpty } from "./utils";

export interface Describe {
  name: string;
  tests: Record<string, Test>;
  describes: Record<string, Describe>;
}

export const Describes: React.FC<{ describes: Describe[] }> = ({
  describes,
}) => {
  const classNames = useClassNames();
  return (
    <>
      {describes.map((describe) => {
        if (isEmpty(describe)) {
          return null;
        }

        const tests = Object.values(describe.tests ?? {});
        const describes = Object.values(describe.describes ?? {});

        return (
          <div
            key={describe.name}
            className={classNames("test-describe", [containerClassName])}
          >
            <div className={classNames("test-name", [nameClassName])}>
              {describe.name}
            </div>

            <Tests tests={tests} />

            <Describes describes={describes} />
          </div>
        );
      })}
    </>
  );
};
