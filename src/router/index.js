import {
  createRouter,
  createWebHistory,
} from 'vue-router'

const HomeView = () =>
  import('@/views/HomeView.vue')

const LandscapeView = () =>
  import('@/views/LandscapeView.vue')

const OldArchiveView = () =>
  import('@/views/OldArchiveView.vue')

const AboutView = () =>
  import('@/views/AboutView.vue')

const NotFoundView = () =>
  import('@/views/NotFoundView.vue')

const routes = [
  {
  path: '/',
  name: 'home',
  component: HomeView,
  meta: {
    title: 'HSWLD | Visual Archive',
    description:
      'A personal visual archive featuring landscape photography and old monochrome photographs.',
    transitionLabel: 'HSWLD',
    image: '/images/landscape/landscape-01.png',
  },
},
{
  path: '/landscape',
  name: 'landscape',
  component: LandscapeView,
  meta: {
    title: 'Landscape | HSWLD',
    description:
      'Landscape photography featuring mountains, light, quiet roads, and places across Indonesia.',
    transitionLabel: 'Landscape',
    image: '/images/landscape/landscape-01.png',
  },
},
{
  path: '/old-archive',
  name: 'old-archive',
  component: OldArchiveView,
  meta: {
    title: 'Old Archive | HSWLD',
    description:
      'A monochrome photography archive featuring grain, dust, noise, and fragments of memory.',
    transitionLabel: 'Old Archive',
    image: '/images/old-archive/archive-01.png',
  },
},
{
  path: '/about',
  name: 'about',
  component: AboutView,
  meta: {
    title: 'About | HSWLD',
    description:
      'About HSWLD, a personal visual archive by Husni Walad.',
    transitionLabel: 'About',
    image: '/images/landscape/landscape-01.png',
  },
},

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,

    meta: {
      title: 'Page Not Found | hswldarchive',

      description:
        'The requested page could not be found.',

      transitionLabel: 'Not Found',

      image:
        '/images/landscape/landscape-01.png',
    },
  },
]

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL,
  ),

  routes,

  scrollBehavior() {
    return {
      top: 0,
      left: 0,
    }
  },
})

const setMetaTag = ({
  attribute = 'name',
  key,
  content,
}) => {
  let element = document.head.querySelector(
    `meta[${attribute}="${key}"]`,
  )

  if (!element) {
    element = document.createElement('meta')

    element.setAttribute(
      attribute,
      key,
    )

    document.head.appendChild(element)
  }

  element.setAttribute(
    'content',
    content,
  )
}

router.afterEach((to) => {
  const defaultTitle =
    'HSWLD | Visual Archive'

  const defaultDescription =
    'A personal visual archive featuring landscape and old archive photography.'

  const title =
    to.meta.title || defaultTitle

  const description =
    to.meta.description ||
    defaultDescription

  const imagePath =
    to.meta.image ||
    '/images/landscape/landscape-01.png'

  const pageUrl =
    window.location.href

  const imageUrl = new URL(
    imagePath,
    window.location.origin,
  ).href

  document.title = title

  setMetaTag({
    key: 'description',
    content: description,
  })

  setMetaTag({
    attribute: 'property',
    key: 'og:title',
    content: title,
  })

  setMetaTag({
    attribute: 'property',
    key: 'og:description',
    content: description,
  })

  setMetaTag({
    attribute: 'property',
    key: 'og:image',
    content: imageUrl,
  })

  setMetaTag({
    attribute: 'property',
    key: 'og:url',
    content: pageUrl,
  })

  setMetaTag({
    attribute: 'property',
    key: 'og:type',
    content: 'website',
  })

  setMetaTag({
    key: 'twitter:card',
    content: 'summary_large_image',
  })

  setMetaTag({
    key: 'twitter:title',
    content: title,
  })

  setMetaTag({
    key: 'twitter:description',
    content: description,
  })

  setMetaTag({
    key: 'twitter:image',
    content: imageUrl,
  })
})

export default router