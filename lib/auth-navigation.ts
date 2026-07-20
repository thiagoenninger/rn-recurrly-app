import { router, type Href } from "expo-router";
import { Platform } from "react-native";

type NavigateAfterAuthParams = {
  session?: { currentTask?: unknown } | null;
  decorateUrl: (url: string) => string;
};

export const navigateAfterAuth = ({
  session,
  decorateUrl,
}: NavigateAfterAuthParams): void => {
  if (session?.currentTask) {
    console.warn("Unhandled Clerk session task:", session.currentTask);
    return;
  }

  const url = decorateUrl("/");

  if (Platform.OS === "web" && url.startsWith("http")) {
    window.location.href = url;
    return;
  }

  router.replace(url as Href);
};
