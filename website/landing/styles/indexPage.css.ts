import { styleBlock } from "../styles/convert"

export const containerClassName = styleBlock({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "100vh",
  });

export const mainClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  });
