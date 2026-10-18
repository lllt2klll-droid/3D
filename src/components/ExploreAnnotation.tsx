import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ComponentCatalogItem } from '../types';
import { ThreeViewer } from '../scene/ThreeViewer';
import { EXPLORE_PARTS } from '../scene/exploreParts';

interface ExploreAnnotationProps {
  item: ComponentCatalogItem;
  componentId: string;
  viewer: ThreeViewer | null;
  onOpenDetails: () => void;
}

export const ExploreAnnotation: React.FC<ExploreAnnotationProps> = ({
  item,
  componentId,
  viewer,
  onOpenDetails,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const parts = useMemo(() => EXPLORE_PARTS[item.type], [item.type]);
  const [selectedPartId, setSelectedPartId] = useState(parts[0].id);
  const selectedPart = parts.find((part) => part.id === selectedPartId) ?? parts[0];

  useEffect(() => {
    setSelectedPartId(parts[0].id);
  }, [componentId, parts]);

  useEffect(() => {
    if (!viewer) return;
    let frameId = 0;

    const updateArrow = () => {
      const overlay = overlayRef.current;
      const card = cardRef.current;
      const path = pathRef.current;
      const dot = dotRef.current;
      const anchor = viewer.projectComponentAnchor(componentId, selectedPart.position);

      if (overlay && card && path && dot && anchor) {
        const cardRect = card.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
        const startX = cardRect.left - overlayRect.left + cardRect.width / 2;
        const startY = cardRect.bottom - overlayRect.top;
        const elbowY = startY + (anchor.y - startY) * 0.45;

        overlay.setAttribute('viewBox', `0 0 ${anchor.width} ${anchor.height}`);
        const arrowPath = `M ${startX} ${startY} L ${startX} ${elbowY} L ${anchor.x} ${anchor.y}`;
        path.setAttribute('d', anchor.visible ? arrowPath : '');
        dot.setAttribute('cx', `${anchor.x}`);
        dot.setAttribute('cy', `${anchor.y}`);
        dot.setAttribute('visibility', anchor.visible ? 'visible' : 'hidden');
        path.setAttribute('visibility', anchor.visible ? 'visible' : 'hidden');
      }

      frameId = requestAnimationFrame(updateArrow);
    };

    frameId = requestAnimationFrame(updateArrow);
    return () => cancelAnimationFrame(frameId);
  }, [componentId, selectedPart, viewer]);

  return (
    <div className="explore-annotation-overlay" ref={overlayRef}>
      <svg
        className="explore-annotation-arrow"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <marker
            id="explore-annotation-arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
          </marker>
        </defs>
        <path
          ref={pathRef}
          fill="none"
          stroke="#0284c7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#explore-annotation-arrowhead)"
        />
        <circle ref={dotRef} r="6" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
      </svg>

      <div className="stem-card explore-annotation-card" ref={cardRef}>
        <span className="explore-annotation-eyebrow">ĐANG QUAN SÁT</span>
        <strong>{item.name}</strong>
        <span>{item.shortDesc}</span>
        <div className="explore-part-detail" aria-live="polite">
          <span className="explore-part-number">
            Bộ phận {parts.findIndex((part) => part.id === selectedPart.id) + 1}/{parts.length}
          </span>
          <strong>{selectedPart.name}</strong>
          <span>{selectedPart.function}</span>
        </div>
        <div className="explore-part-list" aria-label={`Các bộ phận của ${item.name}`}>
          {parts.map((part, index) => (
            <button
              key={part.id}
              type="button"
              className={part.id === selectedPart.id ? 'active' : ''}
              aria-pressed={part.id === selectedPart.id}
              onClick={() => setSelectedPartId(part.id)}
            >
              <span>{index + 1}</span>
              {part.name}
            </button>
          ))}
        </div>
        <button
          className="explore-full-info"
          type="button"
          onClick={onOpenDetails}
        >
          Xem thông tin đầy đủ
        </button>
        <span className="explore-annotation-hint">Kéo để xoay mô hình, cuộn để phóng to.</span>
      </div>
    </div>
  );
};
