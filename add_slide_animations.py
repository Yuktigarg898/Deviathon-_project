# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

slide_css = """
/* ========================================================================== */
/* MULTI-PATIENT FAMILY CAROUSEL / SLIDER ANIMATIONS                          */
/* ========================================================================== */
@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(40px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-40px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slidePulseBadge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-slide-in-right {
  animation: slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-in-left {
  animation: slideInLeft 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-pulse-badge {
  animation: slidePulseBadge 1.8s infinite ease-in-out;
}
"""

if 'slideInRight' not in css:
    with open('styles.css', 'a', encoding='utf-8') as f:
        f.write(slide_css)
    print("Added slide animations to styles.css successfully!")
else:
    print("slideInRight already in styles.css")

