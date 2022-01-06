const config = require('./src/config');

module.exports = {

  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-robots-txt',
    'gatsby-plugin-offline',
    'gatsby-plugin-netlify',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Farzad Golghasemi',
        short_name: 'Farzad Golghasemi',
        start_url: '/',
        background_color: 'white',
        theme_color: config.colors.darkGray,
        display: 'standalone',
        icon: './src/images/logo.png',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `about`,
        path: `${__dirname}/content/about`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `works`,
        path: `${__dirname}/content/works`,
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
      'Farzad Golghasemi is an intermedia artist and designer who is working on developing projects regarding the critique of urban geography and everyday life through employing digital technologies such as the 3D CGI, Web and mobile devices.',
    siteUrl: 'https://fagosemi.xyz',
    image: '/og.png',
    authorName: 'Farzad Golghasemi',
    twitterUsername: '@fagosemi',
  }
}
