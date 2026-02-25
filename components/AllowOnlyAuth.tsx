// hoc/AllowOnlyAuth.tsx
"use client";

import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebaseconfig";

export function AllowOnlyAuth<P>(WrappedComponent: ComponentType<P>) {
  return (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
          router.push("/signin");
        } else {
          setUser(currentUser);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      );
    }

    if (!user) return null; // Redirecting

    return <WrappedComponent {...props} />;
  };
}
