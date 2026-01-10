import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface StatItemProps {
  endValue: number;
  label: string;
  suffix?: string;
  duration?: number;
}

const Counter: React.FC<StatItemProps> = ({ endValue, label, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(endValue * easeOut));

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, endValue, duration]);

  return (
    <div ref={elementRef} className="flex flex-col items-center justify-center p-4 text-center">
      <div className="text-4xl md:text-5xl font-black text-kmmr-blue dark:text-white mb-2 flex items-baseline transition-colors duration-300">
        {count}
        <span className="text-kmmr-pink ml-1">{suffix}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide text-xs md:text-sm transition-colors duration-300">
        {label}
      </p>
    </div>
  );
};

export const StatsBanner: React.FC = () => {
  const { t } = useLanguage();
  
  const stats = [
    { value: 100, label: t('stats.projects'), suffix: '+' },
    { value: 15, label: t('stats.organizations'), suffix: '+' },
    { value: 20, label: t('stats.partners'), suffix: '+' },
    { value: 50, label: t('stats.initiatives'), suffix: '+' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 border-y border-white/50 dark:border-gray-800 shadow-inner transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-200/50 dark:divide-gray-700">
          {stats.map((stat, index) => (
            <Counter 
              key={index}
              endValue={stat.value}
              label={stat.label}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </div>
  );
};