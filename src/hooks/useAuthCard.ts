import { useEffect, useMemo, useState } from "react";
import validateHomeserver from "@/lib/matrix/validateHomeserver";

function useDebouncedValue<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useAuthCard() {
  const [homeserver, setHomeserver] = useState("");
  const debouncedHomeserver = useDebouncedValue(homeserver, 500);

  const [isHsLoading, setIsHsLoading] = useState(false);
  const [isHsError, setIsHsError] = useState(false);
  const [isHsValid, setIsHsValid] = useState<boolean | null>(null);
  const [hsErrorMessage, setHsErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!debouncedHomeserver) {
        if (!cancelled) {
          setIsHsLoading(false);
          setIsHsError(false);
          setIsHsValid(null);
          setHsErrorMessage(null);
        }
        return;
      }

      setIsHsLoading(true);
      setIsHsError(false);
      setHsErrorMessage(null);

      try {
        const ok = await validateHomeserver(debouncedHomeserver);
        if (cancelled) return;

        setIsHsValid(ok);
        if (!ok) {
          setIsHsError(true);
          setHsErrorMessage("Invalid homeserver URL");
        }
      } catch {
        if (cancelled) return;
        setIsHsValid(false);
        setIsHsError(true);
        setHsErrorMessage("Failed to validate homeserver");
      } finally {
        if (!cancelled) setIsHsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedHomeserver]);

  const canSubmit = useMemo(() => {
    if (!homeserver) return false;
    if (isHsLoading) return false;
    if (isHsError) return false;
    if (isHsValid === false) return false;
    return true;
  }, [homeserver, isHsLoading, isHsError, isHsValid]);

  return {
    homeserver,
    setHomeserver,
    debouncedHomeserver,
    isHsLoading,
    isHsError,
    isHsValid,
    hsErrorMessage,
    canSubmit,
  };
}

export default useAuthCard;
