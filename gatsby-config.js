const config = require('./src/config');

module.exports = {

  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-196785734-1",
        head: true ,
        anonymize: true,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Farzad Golghasemi',
        short_name: 'farzadgo',
        start_url: '/',
        background_color: 'white',
        theme_color: config.colors.darkGray,
        display: 'standalone',
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
      'Farzad Golghasemi is an artist and architect who is working on developing projects regarding the critique of urban geography and everyday life, through employing digital technologies such as the Web and mobile devices.',
    siteUrl: 'https://farzadgo.xyz',
    image: '/demo.png',
    authorName: 'Farzad Golghasemi',
    twitterUsername: '@farzadgo_',
  }
}
