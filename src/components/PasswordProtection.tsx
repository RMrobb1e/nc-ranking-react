import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface PasswordProtectionProps {
  onUnlock: () => void;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({
  onUnlock,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  const STORAGE_KEY = "nc_ranking_auth";
  const EXPIRATION_HOURS = 24;

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const storedAuth = localStorage.getItem(STORAGE_KEY);
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          const now = new Date().getTime();

          // Check if the stored auth is still valid (within 24 hours)
          if (authData.expiresAt && now < authData.expiresAt) {
            onUnlock();
            return;
          } else {
            // Remove expired auth
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Error checking stored auth:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
      setIsChecking(false);
    };

    checkExistingAuth();
  }, [onUnlock]);

  const storeAuthSuccess = () => {
    try {
      const now = new Date().getTime();
      const expiresAt = now + EXPIRATION_HOURS * 60 * 60 * 1000; // 24 hours in milliseconds

      const authData = {
        authenticated: true,
        expiresAt: expiresAt,
        timestamp: now,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      console.error("Error storing auth data:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get password from environment variable (Vite)
    const correctPassword = import.meta.env.VITE_PASSWORD;

    if (!correctPassword) {
      setError("Password configuration error. Please contact administrator.");
      return;
    }

    if (password === correctPassword) {
      storeAuthSuccess();
      onUnlock();
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  // Show loading state while checking existing auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 w-full max-w-md">
          <div className="text-center">
            <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <p className="text-gray-400">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Access Restricted
          </h1>
          <p className="text-gray-400">
            Enter password to view Night Crows rankings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!password.trim()}
          >
            Unlock
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Access will be remembered for 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
