import { useEffect, useRef, type ReactNode } from 'react'

export function Icon({ name, size = 20 }: { name: 'arrow' | 'bag' | 'close' | 'menu' | 'search' | 'heart' | 'plus' | 'minus' | 'chevron' | 'camera' | 'mail' | 'repair' | 'check'; size?: number }) {
  const paths: Record<typeof name, ReactNode> = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
    bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    menu: <path d="M3 7h18M3 16h18" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    heart: <path d="M20.7 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.7 7.8L12 21l8.7-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    camera: <><path d="M3 7h4l2-3h6l2 3h4v13H3Z" /><circle cx="12" cy="13" r="4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>,
    repair: <path d="m14 6 4 4 3-3a6 6 0 0 1-8 8l-7 7-4-4 7-7a6 6 0 0 1 8-8l-3 3Z" />,
    check: <path d="m5 12 4 4L20 5" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export function Photo({ name, alt, className = '', eager = false }: { name: string; alt: string; className?: string; eager?: boolean }) {
  return <img className={`photo ${className}`} src={`${import.meta.env.BASE_URL}images/${name}.webp`} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
}
export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return <a className={`text-link ${className}`} href={href}>{children}<Icon name="arrow" size={17} /></a>
}
export function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <div className="section-title">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{children && <p>{children}</p>}</div>
}
export function Editorial({ image, alt, eyebrow, title, children, href, link, reverse = false, id, className = '' }: {
  image: string; alt: string; eyebrow?: string; title: string; children: ReactNode; href?: string; link?: string; reverse?: boolean; id?: string; className?: string
}) {
  return <section id={id} className={`editorial ${reverse ? 'reverse' : ''} ${className}`}>
    <div className="editorial-image"><Photo name={image} alt={alt} /></div>
    <div className="editorial-copy">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2><div className="body-copy">{children}</div>{href && <TextLink href={href}>{link || 'Discover more'}</TextLink>}</div>
  </section>
}
export function Accordion({ items }: { items: { title: string; body: string }[] }) {
  return <div className="accordion">{items.map(item => <details key={item.title}><summary>{item.title}<Icon name="plus" size={16} /></summary><p>{item.body}</p></details>)}</div>
}
export function Triptych({ cards }: { cards: { image: string; title: string; body: string; href?: string }[] }) {
  return <div className="triptych">{cards.map((card, index) => <article key={card.title}>
    {card.href ? <a href={card.href} className="image-link"><Photo name={card.image} alt={card.title} /></a> : <Photo name={card.image} alt={card.title} />}
    <div className="triptych-copy"><span className="eyebrow">{String(index + 1).padStart(2, '0')}</span><h3>{card.title}</h3><p>{card.body}</p>{card.href && <TextLink href={card.href}>Take a closer look</TextLink>}</div>
  </article>)}</div>
}
export function Modal({ open, onClose, title, children, className = '' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal()
    if (!open && ref.current?.open) ref.current.close()
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])
  return <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="modal-content"><header className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose}><Icon name="close" /></button></header>{children}</div>
  </dialog>
}
