import Link from 'next/link';
import Nav from '@/components/Nav';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Nav base="/" />
      <main className="nf" id="top">
        <p className="mono">Error / wrong turn</p>
        <h1>404</h1>
        <p>This page does not exist, or it moved. Head back to the portfolio.</p>
        <Link className="btn" href="/">
          ← Back to home
        </Link>
      </main>
    </>
  );
}
