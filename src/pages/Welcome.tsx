import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Code2, Sparkles, TreePine, Moon, Cloud } from 'lucide-react';
import { Button } from '../components/Button';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing moon */}
        <div className="absolute right-10 top-10 animate-pulse">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-yellow-200/40 blur-xl"></div>
            <Moon className="relative h-20 w-20 text-yellow-200" />
          </div>
        </div>
        
        {/* Ethereal clouds */}
        <div className="absolute left-1/4 top-20 animate-float">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-slow rounded-full bg-blue-200/20 blur-lg"></div>
            <Cloud className="h-24 w-24 text-blue-200 opacity-60" />
          </div>
        </div>
        <div className="absolute right-1/3 top-32 animate-float-delayed">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-slow rounded-full bg-purple-200/20 blur-lg"></div>
            <Cloud className="h-20 w-20 text-purple-200 opacity-60" />
          </div>
        </div>
        
        {/* Mystical forest */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex justify-around">
            {[32, 40, 36, 44, 32].map((size, index) => (
              <div key={index} className="relative">
                <div className="absolute inset-0 animate-pulse-slow rounded-full bg-emerald-300/30 blur-xl"></div>
                <TreePine className={`h-${size} w-${size} animate-sway-${index % 2 ? 'delayed' : 'normal'} text-emerald-300 opacity-80`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 p-3 backdrop-blur-sm">
              <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-md"></div>
              <Code2 className="relative h-12 w-12 animate-pulse-slow text-blue-300" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Project</span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Partner Finder</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100/80">
            Where innovative ideas meet talented contributors. Build your dream team and create something extraordinary together.
          </p>
        </div>

        {/* Cards section */}
        <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row">
          {/* Project Owner Card */}
          <div className="group w-full max-w-sm overflow-hidden rounded-xl bg-gradient-to-br from-blue-950/40 to-blue-900/20 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:from-blue-900/40 hover:to-blue-800/20 hover:shadow-blue-500/20 sm:w-96">
            <div className="mb-6 flex justify-center">
              <div className="relative rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 p-4 transition-all group-hover:from-blue-400/40 group-hover:to-cyan-400/40">
                <div className="absolute inset-0 animate-pulse-slow rounded-full bg-blue-400/20 blur-md"></div>
                <Briefcase className="relative h-10 w-10 text-cyan-300" />
              </div>
            </div>
            <h2 className="mb-4 text-center text-2xl font-bold text-white">Project Owner</h2>
            <p className="mb-8 text-center text-blue-100/70">
              Share your vision and find talented contributors to bring your projects to life.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 animate-pulse text-yellow-300" />
              <span className="text-sm text-yellow-300">Create unlimited projects</span>
            </div>
            <Button
              onClick={() => navigate('/signup/project-owner')}
              className="mt-6 w-full border-cyan-400 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 backdrop-blur-sm transition-colors hover:bg-black hover:text-black"
              variant="outline"
              size="lg"
            >
              Get Started
            </Button>
          </div>

          {/* Contributor Card */}
          <div className="group w-full max-w-sm overflow-hidden rounded-xl bg-gradient-to-br from-purple-950/40 to-purple-900/20 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:from-purple-900/40 hover:to-purple-800/20 hover:shadow-purple-500/20 sm:w-96">
            <div className="mb-6 flex justify-center">
              <div className="relative rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 p-4 transition-all group-hover:from-purple-400/40 group-hover:to-pink-400/40">
                <div className="absolute inset-0 animate-pulse-slow rounded-full bg-purple-400/20 blur-md"></div>
                <Users className="relative h-10 w-10 text-pink-300" />
              </div>
            </div>
            <h2 className="mb-4 text-center text-2xl font-bold text-white">Contributor</h2>
            <p className="mb-8 text-center text-purple-100/70">
              Discover exciting projects and showcase your skills to make an impact.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 animate-pulse text-yellow-300" />
              <span className="text-sm text-yellow-300">Join multiple projects</span>
            </div>
            <Button
              onClick={() => navigate('/signup/contributor')}
              className="mt-6 w-full border-pink-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 backdrop-blur-sm transition-colors hover:bg-black hover:text-black"
              variant="outline"
              size="lg"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Login link */}
        <div className="mt-16 text-center">
          <p className="text-blue-100/60">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};