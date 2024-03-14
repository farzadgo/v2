const config = require('./src/config');

module.exports = {

  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-robots-txt',
    'gatsby-plugin-offline',
    'gatsby-plugin-netlify',
    'gatsby-plugin-image', // for images
    'gatsby-plugin-sharp', // to customize images (e.g. placeholder, formats) here
    'gatsby-transformer-sharp', // with this in GraphQL we can resize, crop, etc.
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Farzad Golghasemi',
        short_name: 'Farzad Golghasemi',
        start_url: '/',
        background_color: '#ededed',
        theme_color: '#383838',
        display: 'standalone',
        icon: './src/images/logo.png',
      },
    },
    {
      resolve: 'gatsby-source-filesystem', // for static images (assets)
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer',
            },
          },
        ],
      },
    },
  ],
  siteMetadata: {
    title: 'Farzad Golghasemi',
    description:
      'Farzad Golghasemi (he/they) is an interdisciplinary artist and researcher who focuses on architecture and spatial production through the agency of technology. By incorporating speculation, programming, and 3D modeling they explore the new modes of world-making through synthetic and temporal aspects of construction.',
    siteUrl: 'https://fagosemi.xyz',
    image: '/og.png',
    authorName: 'Farzad Golghasemi',
    twitterUsername: '@fagosemi',
  }
}
