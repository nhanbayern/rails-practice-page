import { useEffect, useId, useMemo, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  themeVariables: {
    primaryColor: '#fff1f2',
    primaryTextColor: '#0f172a',
    primaryBorderColor: '#b91c1c',
    lineColor: '#7f1d1d',
    secondaryColor: '#f8fafc',
    tertiaryColor: '#ffffff',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
});

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId();
  const renderId = useMemo(() => `mermaid-${id.replace(/:/g, '')}`, [id]);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    mermaid.render(renderId, chart)
      .then((result) => {
        if (!cancelled) {
          setSvg(result.svg);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSvg('');
          setError(err instanceof Error ? err.message : String(err));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, renderId]);

  if (error) {
    return (
      <pre className="overflow-auto rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        {error}
        {'\n\n'}
        {chart}
      </pre>
    );
  }

  return (
    <div
      className="overflow-auto rounded-2xl border border-red-100 bg-white p-4 [&_svg]:mx-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
