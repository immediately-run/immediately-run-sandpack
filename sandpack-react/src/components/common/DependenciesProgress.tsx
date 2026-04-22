import { useSandpackPreviewProgress } from "../../hooks/useSandpackPreviewProgress";

import { progressClassName } from "./DependenciesProgress.css";

export const DependenciesProgress: React.FC<{ clientId?: string }> = ({
  clientId,
}) => {
  const progressMessage = useSandpackPreviewProgress({
    timeout: 3_000,
    clientId,
  });

  if (!progressMessage) {
    return null;
  }

  return (
    <div className={progressClassName}>
      <p>{progressMessage}</p>
    </div>
  );
};
