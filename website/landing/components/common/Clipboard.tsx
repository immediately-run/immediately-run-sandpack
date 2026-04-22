import content from "../../website.config.json";

import {
  clipboardButtonClassName,
  clipboardIconBoxClassName,
  clipboardTextClassName,
} from "./Clipboard.css";
import { useClipboard } from "./ClipboardProvider";

export const Clipboard: React.FC = () => {
  const { copyToClipboard } = useClipboard();

  return (
    <button
      aria-label="Copy to clipboard"
      className={clipboardButtonClassName}
      onClick={copyToClipboard}
    >
      <span className={clipboardTextClassName}>{content.commands.install}</span>
      <div className={clipboardIconBoxClassName}>
        <svg fill="none" height="100%" viewBox="0 0 12 13" width="100%">
          <g clipPath="url(#a)">
            <path
              d="M8.21 1.344H2.317c-.54 0-.983.463-.983 1.03v7.212h.983V2.374H8.21v-1.03Zm1.474 2.06H4.281c-.54 0-.983.464-.983 1.03v7.213c0 .566.442 1.03.983 1.03h5.403c.54 0 .983-.464.983-1.03V4.435c0-.567-.442-1.03-.983-1.03Zm0 8.243H4.281V4.435h5.403v7.212Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path
                d="M0 0h12v12H0z"
                fill="currentColor"
                transform="translate(0 .676)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
    </button>
  );
};
