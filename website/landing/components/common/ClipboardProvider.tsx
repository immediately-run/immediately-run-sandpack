import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

import content from "../../website.config.json";

import {
  clipboardToastClassName,
  clipboardToastIconClassName,
} from "./ClipboardProvider.css";

const ClipboardContext = createContext({
  copyToClipboard: () => {
    return;
  },
});

const ClipboardProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [toastVisible, setToastVisible] = useState(false);

  const copyToClipboard = useCallback(() => {
    try {
      navigator.clipboard.writeText(content.commands.install);
      setToastVisible(true);
    } catch (err) {
      console.error("Failed to copy command to clipboard", err);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToastVisible(false);
    }, 2000);

    return (): void => clearTimeout(timeout);
  }, [toastVisible]);

  return (
    <ClipboardContext.Provider value={{ copyToClipboard }}>
      <div
        className={clipboardToastClassName({
          visible: toastVisible as never,
        })}
      >
        <div className={clipboardToastIconClassName}>
          <svg fill="none" height="100%" viewBox="0 0 24 24" width="100%">
            <path
              d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span>Copied to clipboard</span>
      </div>

      {children}
    </ClipboardContext.Provider>
  );
};

export const useClipboard = (): { copyToClipboard: () => void } =>
  useContext(ClipboardContext);

export { ClipboardProvider };
