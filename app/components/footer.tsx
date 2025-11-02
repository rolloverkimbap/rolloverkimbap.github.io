'use client';

import { useState } from 'react';

export default function Footer() {
  const [isThreadsHovered, setIsThreadsHovered] = useState(false);

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="social-links">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/rolloverkimbap/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link instagram"
            aria-label="Instagram"
            title="Instagram"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2m-.25 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5A3.75 3.75 0 0020 16.25v-8.5A3.75 3.75 0 0016.25 4h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" />
            </svg>
          </a>

          {/* Threads */}
          <a
            href="https://www.threads.com/@rolloverkimbap"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link threads"
            aria-label="Threads"
            title="Threads"
            onMouseEnter={() => setIsThreadsHovered(true)}
            onMouseLeave={() => setIsThreadsHovered(false)}
          >
            <img
              src={isThreadsHovered ? '/icons/threads-logo-black.png' : '/icons/threads-logo-white.png'}
              alt="Threads"
              className="threads-logo"
            />
          </a>
        </div>

        <div className="footer-copyright">
          <p>&copy; 2025 Roll Over Kimbap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
