"use client";

export default function SharePage() {
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
