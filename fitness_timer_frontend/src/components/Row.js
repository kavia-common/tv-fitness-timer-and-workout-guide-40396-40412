import React, { useMemo, useRef } from 'react';
import ExerciseCard from './ExerciseCard';
import useDpadNavigation from '../hooks/useDpadNavigation';

/**
 * PUBLIC_INTERFACE
 * Row
 * A horizontally scrollable row of ExerciseCard components with TV D-pad navigation.
 *
 * Props:
 * - id: string - unique id for the row (used for focus ids)
 * - title: string - category title displayed above the row
 * - items: Array<{ id: string, name: string, subtitle?: string, thumbnail?: string }>
 * - onSelectItem?: (item) => void - called when OK/Enter/Space pressed on focused item
 * - initialIndex?: number - initial focused column index (default 0)
 */
export default function Row({ id = 'row', title, items = [], onSelectItem, initialIndex = 0 }) {
  const scrollerRef = useRef(null);
  const cellRefs = useRef(items.map(() => React.createRef()));

  // Keep refs count in sync when items length changes
  if (cellRefs.current.length !== items.length) {
    cellRefs.current = items.map((_, i) => cellRefs.current[i] || React.createRef());
  }

  const { focusedColIndex, setFocused } = useDpadNavigation({
    rowCount: 1,
    colCount: items.length,
    initialRow: 0,
    initialCol: initialIndex,
    loop: false,
    getRef: (_r, c) => cellRefs.current[c],
    onEnter: (_r, c) => {
      const item = items[c];
      if (item && typeof onSelectItem === 'function') {
        onSelectItem(item);
      }
    },
  });

  const handleCardSelect = (itemIndex) => {
    const item = items[itemIndex];
    if (item && typeof onSelectItem === 'function') {
      onSelectItem(item);
    }
  };

  const rowIdPrefix = useMemo(() => id || `row-${Math.random().toString(36).slice(2, 8)}`, [id]);

  return (
    <section className="px-container" aria-label={title} style={{ marginTop: 'var(--space-12)' }}>
      <div className="h2" style={{ marginBottom: 'var(--space-6)' }}>
        {title}
      </div>

      <div
        ref={scrollerRef}
        className="row-scroller"
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(296px, 320px)',
          gap: 'var(--space-6)',

          // Enable smooth horizontal scrolling and scroll snap
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 'var(--space-2)',
          // Hide native scrollbar visually but keep it accessible
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            ref={cellRefs.current[idx]}
            style={{
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always',
              outline: 'none',
              minWidth: 296,
              maxWidth: 320,
            }}
          >
            <ExerciseCard
              id={`${rowIdPrefix}-item-${idx}`}
              name={item.name}
              subtitle={item.subtitle}
              thumbnail={item.thumbnail}
              onSelect={() => handleCardSelect(idx)}
              className={focusedColIndex === idx ? 'row-card-focused' : ''}
              style={{
                minHeight: 260,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
