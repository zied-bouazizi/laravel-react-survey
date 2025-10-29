import { useEffect } from "react";
import { useMatches } from "react-router-dom";

export default function RouteTitleManager({ overrideTitle }) {
  const matches = useMatches();

  useEffect(() => {
    const appName = import.meta.env.VITE_APP_NAME || "React";

    if (overrideTitle) {
      document.title = `${overrideTitle} | ${appName}`;
      return;
    }

    const matchWithTitle = [...matches].reverse().find(m => m.handle?.title);
    const title = matchWithTitle?.handle?.title;

    document.title = title ? `${title} | ${appName}` : appName;
  }, [matches, overrideTitle]);

  return null;
}
