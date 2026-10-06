// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        void:    '#0A0A0A',
        ink:     { DEFAULT: '#121110', raised: '#1A1917' },
        saffron: { DEFAULT: '#F2B01E', lift: '#FFD45E', deep: '#C98A0B' },
        bone:    { DEFAULT: '#F5F2EC', dim: '#A8A49B' },
        mute:    '#6E6A63',
      },
      borderColor: {
        hairline: 'rgba(245,242,236,0.10)',
        strong:   'rgba(245,242,236,0.24)',
        warm:     'rgba(242,176,30,0.22)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-ui)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 11vw, 11rem)',   { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-l':  ['clamp(2.75rem, 6vw, 5.5rem)',  { lineHeight: '1',    letterSpacing: '-0.02em' }],
        'display-m':  ['clamp(2rem, 3.6vw, 3.25rem)',  { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        'eyebrow':    ['0.75rem',   { lineHeight: '1.2',  letterSpacing: '0.14em' }],
        'data':       ['0.8125rem', { lineHeight: '1.4',  letterSpacing: '0.04em' }],
      },
      spacing: {
        section:    '12rem',   // 192
        'section-md':'8rem',   // 128
        'section-sm':'5.5rem', // 88
        gutter:     '4rem',    // 64
      },
      maxWidth: { shell: '1440px', prose: '62ch' },
      borderRadius: { card: '2px', btn: '2px' },
      transitionTimingFunction: {
        out:   'cubic-bezier(0.16, 1, 0.3, 1)',
        inout: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle, rgba(242,176,30,0.18) 0%, transparent 70%)',
      },
    },
  },
};
