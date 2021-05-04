const config = require('./src/config');

module.exports = {

  plugins: [
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'FarzadGolghasemi',
        short_name: 'FarzadGolghasemi',
        start_url: '/',
        background_color: 'white',
        theme_color: config.colors.darkGray,
        display: 'minimal-ui',
        icon: './src/images/favicon.png',
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
        name: `developer`,
        path: `${__dirname}/content/about`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `developer`,
        path: `${__dirname}/content/developer`,
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
      'Farzad Golghasemi is anartist and designer who is working on developing projects regarding the critique of urban geography and everyday life, through employing digital technologies such as the Web and mobile devices.',
    siteUrl: 'https://fagose.me',
    image: '/demo.png',
    authorName: 'Farzad Golghasemi',
    twitterUsername: '@farzadgo_',
  }
}
