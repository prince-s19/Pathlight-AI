/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FloatingNavbar } from './components/floating-navbar';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import React, { lazy, Suspense } from 'react';

// Lazy load pages for better performance
const Explore = lazy(() => import('./pages/explore'));
const Bookmarks = lazy(() => import('./pages/bookmarks'));
const Profile = lazy(() => import('./pages/profile'));
const About = lazy(() => import('./pages/about'));
const Auth = lazy(() => import('./pages/auth'));

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      {children}
    </motion.div>
  );
}

import { ThemeProvider } from './components/theme-provider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pathlight-theme">
      <Router>
        <div className="min-h-screen">
          <FloatingNavbar />
          <AnimatePresence mode="wait">
            <Suspense fallback={<div className="pt-32 text-center text-zinc-500">Loading...</div>}>
              <Routes>
                <Route path="/" element={<PageWrapper><Explore /></PageWrapper>} />
                <Route path="/bookmarks" element={<PageWrapper><Bookmarks /></PageWrapper>} />
                <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
                <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
          <Toaster position="bottom-center" theme="system" className="glass-panel" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

