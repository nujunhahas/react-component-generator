import { useEffect, useRef, useState } from 'react';
import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from 'react-live';

export type Viewport = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
};

interface LivePreviewProps {
  code: string;
  viewportSize?: Viewport;
}

export function LivePreview({ code, viewportSize = 'desktop' }: LivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!innerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setInnerHeight(entries[0].contentRect.height);
    });

    resizeObserver.observe(innerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const vpWidth = VIEWPORT_WIDTHS[viewportSize];
  const scale = containerWidth > 0 ? Math.min(1, containerWidth / vpWidth) : 1;
  const heightOffset = innerHeight > 0 ? innerHeight * scale - innerHeight : 0;

  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>미리보기</h3>
      </div>
      <div className="preview-content">
        <LiveProvider code={code} noInline>
          <div className="preview-render" ref={containerRef}>
            <div
              className="preview-scale-inner"
              ref={innerRef}
              style={{
                width: vpWidth,
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                marginBottom: heightOffset > 0 ? heightOffset : 0,
              }}
            >
              <ReactLivePreview />
            </div>
          </div>
          <LiveError className="preview-error" />
        </LiveProvider>
      </div>
    </div>
  );
}
