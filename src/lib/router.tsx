import { useEffect, useState, useCallback } from 'react';

export type RouteState = {
  path: string;
  query: URLSearchParams;
};

function parse(): RouteState {
  const [path, search = ''] = window.location.hash.slice(1).split('?');
  return { path: path || '/', query: new URLSearchParams(search) };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(() =>
    typeof window !== 'undefined' ? parse() : { path: '/', query: new URLSearchParams() }
  );

  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    if (!window.location.hash) window.location.hash = '#/';
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to.startsWith('#')) window.location.hash = to;
    else window.location.hash = `#${to}`;
  }, []);

  return { route, navigate };
}

export function Link({
  to,
  children,
  className,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        window.location.hash = `#${to}`;
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
