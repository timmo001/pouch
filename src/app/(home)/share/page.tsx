"use client";
import { useEffect } from "react";
import { parseAsString, useQueryStates } from "nuqs";

export default function SharePage() {
  const [query] = useQueryStates({
    title: parseAsString.withDefault(""),
    text: parseAsString.withDefault(""),
    url: parseAsString.withDefault(""),
  });

  useEffect(() => {
    console.log("query:", query);
  }, [query]);

  return (
    <pre>
      {JSON.stringify(
        {
          href: window.location.href,
          params: new URLSearchParams(window.location.search),
          pathname: window.location.pathname,
          origin: window.location.origin,
          protocol: window.location.protocol,
          host: window.location.host,
          hostname: window.location.hostname,
          port: window.location.port,
          search: window.location.search,
        },
        null,
        2,
      )}
    </pre>
  );
}
