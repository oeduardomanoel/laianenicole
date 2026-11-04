<template>
  <div class="app">
    <a href="#conteudo" class="skip-link">Pular para o conteúdo</a>
    <AppHeader />
    <main id="conteudo">
      <slot />
    </main>
    <AppFooter />
    <StickyCta />
    <CursorFollower />
  </div>
</template>
