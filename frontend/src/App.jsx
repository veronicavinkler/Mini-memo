import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Notes from './pages/Notes';
import Diary from './pages/Diary';
import Navbar from './components/navbar/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/notes" element={
          <SignedIn>
            <Notes />
          </SignedIn>
        } />

        <Route path="/diary" element={
          <>
            <SignedIn>
              <Diary />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}