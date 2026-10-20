import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [note, setNote] = useState('')

  function onSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '').trim()
    if (!email) {
      setNote('Add an email address to preview the note.')
      return
    }
    setNote('Demo only. This address is not saved, and no letter is sent.')
    event.currentTarget.reset()
  }

  return (
    <footer className="site-footer">
      <div className="footer-letter">
        <p className="eyebrow light">The workshop note</p>
        <h2>Letters from Avela.</h2>
        <p>A short note when a new hide comes in, or when a shape is ready to leave the bench.</p>
        <form className="letter-form" onSubmit={onSubmit}>
          <label htmlFor="letter-email">Email address</label>
          <div className="letter-row">
            <input id="letter-email" name="email" type="email" placeholder="Email address" autoComplete="email" />
            <button type="submit">Join the list</button>
          </div>
          <p className="demo-note">
            <span>Demo</span>
            This form does not send mail.
          </p>
          {note ? <p className="form-status" role="status">{note}</p> : null}
        </form>
      </div>
      <div className="footer-base">
        <Link to="/" className="logo footer-logo">
          Avela
        </Link>
        <nav aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/collection">Collection</Link>
          <Link to="/arc">Arc</Link>
          <Link to="/story">Our Story</Link>
          <Link to="/care">Care</Link>
        </nav>
        <p className="footer-meta">Three shapes. Small runs. Soft form.</p>
      </div>
    </footer>
  )
}
