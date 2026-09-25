import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-box">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The workout or page you’re looking for doesn’t exist or may have moved.</p>
        <Link href="/" className="not-found-link">
          Go to homepage
        </Link>
      </div>
    </main>
  );
}
