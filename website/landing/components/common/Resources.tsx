import { classes } from "../../styles/styled";
import content from "../../website.config.json";

import { listClassName, listItemClassName } from "./List.css";
import {
  resourceLinkClassName,
  resourcesItemClassName,
  resourcesListClassName,
  resourcesTextClassName,
} from "./Resources.css";

export const Resources: React.FC = () => {
  return (
    <ul className={classes(listClassName, resourcesListClassName)}>
      {content.resources.map((r) => (
        <li
          key={r.name}
          className={classes(listItemClassName, resourcesItemClassName)}
        >
          <a className={resourceLinkClassName} href={r.url}>
            <span className={resourcesTextClassName}>{r.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};
