import Image from "next/image";

import { classes } from "../../styles/styled";
import content from "../../website.config.json";
import { List } from "../common";

import {
  communityLinkClassName,
  descriptionClassName,
  dividerClassName,
  innerClassName,
  listClassName,
  nameClassName,
  sectionClassName,
  titleClassName,
} from "./Community.css";

export const Community: React.FC = () => {
  const { community } = content;

  return (
    <section className={sectionClassName}>
      <div className={dividerClassName} />
      <div className={innerClassName}>
        <h3
          className={titleClassName}
          dangerouslySetInnerHTML={{ __html: community.title }}
        />
        <List className={classes(listClassName)}>
          {community.list.map((c) => (
            <li key={c.name}>
              <a
                className={communityLinkClassName}
                href={c.socialUrl}
                rel="noreferrer"
                target="_blank"
              >
                <Image alt="" height={32} src={c.logoUrl} width={32} />
                <p className={nameClassName}>{c.name}</p>
                <p className={descriptionClassName}>{c.description}</p>
              </a>
            </li>
          ))}
        </List>
      </div>
    </section>
  );
};
