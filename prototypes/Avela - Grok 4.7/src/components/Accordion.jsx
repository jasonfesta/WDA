import { useState } from 'react'

export default function Accordion({ items, name = 'Details' }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const expanded = open === index
        return (
          <div className={expanded ? 'acc-item open' : 'acc-item'} key={item.title}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`${name}-${index}`}
                id={`${name}-button-${index}`}
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span>{item.title}</span>
                <span className="acc-mark" aria-hidden="true">
                  {expanded ? '–' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={`${name}-${index}`}
              role="region"
              aria-labelledby={`${name}-button-${index}`}
              hidden={!expanded}
              className="acc-panel"
            >
              <p>{item.body}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
