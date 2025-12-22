import type { IconProps } from '@/types/common';

function StompIcon({ size = 24, color = 'var(--color-stone-500)', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill={color} {...props}>
      <path
        d="M17,4l-2,12l-6.073,1.104C6.074,17.623,4,20.108,4,23.007V28h14l2-2v2h8V4H17z M17.172,26
	H6v-1h12.172L17.172,26z M26,26h-4v-1h4V26z M26,23H6.001c0.004-1.931,1.383-3.582,3.284-3.928L15.18,18H21v-2h-3.972l0.333-2H21v-2
	h-3.306l0.333-2H21V8h-2.639l0.333-2H26V23z"
      />
    </svg>
  );
}

export { StompIcon };
