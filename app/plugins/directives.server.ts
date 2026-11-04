export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('magnetic', { getSSRProps: () => ({}) })
  nuxtApp.vueApp.directive('tilt', { getSSRProps: () => ({}) })
})
