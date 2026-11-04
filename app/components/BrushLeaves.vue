<template>
  <!-- Pinceladas rosas nos cantos, como no fundo dos stories -->
  <svg class="leaves" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <filter id="leafBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2" /></filter>
    </defs>
    <g fill="var(--wine-500)" opacity=".38" filter="url(#leafBlur)">
      <g transform="translate(-40 40) rotate(-18)">
        <path d="M0 60 C80 40 170 20 260 0 C190 40 110 70 0 80Z" />
        <path d="M10 120 C110 95 200 90 300 90 C210 120 120 140 10 140Z" />
        <path d="M20 180 C100 170 180 175 250 190 C170 205 90 210 20 200Z" />
      </g>
      <g transform="translate(1480 760) rotate(165)">
        <path d="M0 60 C80 40 170 20 280 0 C190 40 110 70 0 80Z" />
        <path d="M10 120 C110 95 210 90 320 95 C210 120 120 140 10 140Z" />
        <path d="M20 180 C100 170 180 175 260 190 C170 205 90 210 20 200Z" />
        <path d="M30 240 C110 235 170 240 230 255 C160 265 90 268 30 260Z" />
      </g>
      <g transform="translate(1390 -20) rotate(120)" opacity=".7">
        <path d="M0 40 C70 25 140 15 220 10 C150 40 80 55 0 60Z" />
        <path d="M10 90 C90 75 160 75 240 80 C160 100 90 110 10 108Z" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.leaves { width: 100%; height: 100%; }
</style>
