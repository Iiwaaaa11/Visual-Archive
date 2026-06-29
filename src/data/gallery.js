const formatNumber = (number) => {
  return String(number).padStart(2, '0')
}

const landscapeOrientations = [
  'landscape',
  'portrait',
  'landscape',
  'square',
  'portrait',
  'landscape',
  'landscape',
  'portrait',
  'square',
  'landscape',
  'portrait',
  'landscape',
  'square',
  'portrait',
  'landscape',
  'landscape',
  'portrait',
  'square',
  'landscape',
  'portrait',
  'landscape',
  'square',
  'portrait',
  'landscape',
  'landscape',
  'portrait',
  'landscape',
  'portrait',
]

const archiveOrientations = [
  'portrait',
  'landscape',
  'square',
  'portrait',
  'landscape',
  'portrait',
  'square',
  'landscape',
]

export const landscapePhotos =
  Array.from(
    {
      length: 28,
    },
    (_, index) => {
      const number = index + 1

      const formattedNumber =
        formatNumber(number)

      return {
        id: number,
        title:
          `Landscape ${formattedNumber}`,
        location:
          'Central Java, Indonesia',
        year: '2026',
        orientation:
          landscapeOrientations[index],
        image:
          `/images/landscape/landscape-${formattedNumber}.png`,
      }
    },
  )

export const oldArchivePhotos =
  Array.from(
    {
      length: 8,
    },
    (_, index) => {
      const number = index + 1

      const formattedNumber =
        formatNumber(number)

      return {
        id: number,
        title:
          `Archive ${formattedNumber}`,
        location:
          'Old Archive',
        year: '2026',
        orientation:
          archiveOrientations[index],
        image:
          `/images/old-archive/archive-${formattedNumber}.png`,
      }
    },
  )