// src/app/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Kiểm tra khi component mount
    window.addEventListener("resize", handleResize); // Theo dõi khi resize
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  useEffect(() => {
    if (isMobile) {
      router.push('/home-mobile');
    } else {
      router.push('/home');
    }
  }, [router, isMobile]);

  return null;
};

export default Home;