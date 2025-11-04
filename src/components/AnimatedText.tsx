'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type AnimatedTextProps = {
  text: string | { text: string; className?: string }[];
  el?: keyof React.JSX.IntrinsicElements;
  className?: string;
  stagger?: number;
  delay?: number;
};

export function AnimatedText({
  el: Wrapper = 'p',
  text,
  className,
  stagger = 0.05,
  delay = 0,
}: AnimatedTextProps) {
  const root = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (typeof text === 'string') {
        gsap.from(root.current, {
          y: '100%',
          opacity: 0,
          ease: 'power3.out',
          delay,
          duration: 1.5,
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom-=100', // start when the top of the element hits 100px from the bottom of the viewport
            scrub: true,
          },
        });
      } else {
        const words = root.current?.querySelectorAll('.word');
        if (words) {
          gsap.from(words, {
            y: '100%',
            opacity: 0,
            ease: 'power3.out',
            duration: 1,
            stagger,
            delay,
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom-=100',
              scrub: true,
            },
          });
        }
      }
    }, root);

    return () => ctx.revert();
  }, [text, stagger, delay]);

  if (typeof text === 'string') {
    return <Wrapper ref={root} className={cn('overflow-hidden', className)}>{text}</Wrapper>;
  }

  return (
    <Wrapper ref={root} className={cn('overflow-hidden', className)}>
      {text.map((item, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <span className={cn('inline-block word', item.className)}>{item.text}&nbsp;</span>
        </span>
      ))}
    </Wrapper>
  );
}
