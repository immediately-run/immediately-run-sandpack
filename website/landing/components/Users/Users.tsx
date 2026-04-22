import Image from "next/image";
import { useInView } from "react-intersection-observer";

import { classes } from "../../styles/styled";
import config from "../../website.config.json";
import {
  List,
  ListItem,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionWrapper,
} from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

import {
  userLinkClassName,
  usersContainerClassName,
  usersHeaderClassName,
  usersItemClassName,
  usersListClassName,
} from "./Users.css";

export const Users: React.FC = () => {
  const content = config.users;
  const shouldAnimate = useBreakpoint("bp2");

  const { ref: listRef, inView } = useInView({
    threshold: [0, 1],
    triggerOnce: !shouldAnimate,
  });

  return (
    <SectionWrapper>
      <SectionContainer className={classes(usersContainerClassName)}>
        <SectionHeader className={classes(usersHeaderClassName)}>
          <SectionTitle
            as="h4"
            dangerouslySetInnerHTML={{ __html: content.title }}
            size="small"
          />
        </SectionHeader>
        <List ref={listRef} className={classes(usersListClassName)}>
          {content.list.map((user, userIndex) => {
            const { url, height, width } = user.logo;

            return (
              <ListItem
                key={user.name}
                className={classes(usersItemClassName)}
              >
                <a
                  className={userLinkClassName({
                    visible: !shouldAnimate || inView,
                  })}
                  href={user.socialUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{
                    transitionDelay: inView
                      ? "0s"
                      : `calc(0.1s * ${userIndex})`,
                    transitionDuration: `calc(0.2s * ${
                      inView ? userIndex : 1
                    })`,
                  }}
                >
                  <Image
                    alt={user.name}
                    height={height}
                    src={url}
                    width={width}
                  />
                </a>
              </ListItem>
            );
          })}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
