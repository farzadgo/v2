const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {

  const { data } = await graphql(`
    query Works {
      allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/works/"} }) {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `)

  data.allMarkdownRemark.nodes.forEach(node => {
    const slug = node.frontmatter.slug
    actions.createPage({
      path: '/' + slug,
      component: path.resolve('./src/templates/work-details.js'),
      context: {
        slug,
        dir: 'works/' + slug
      }
    })
  })
}

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(glb|gltf)$/i,
          use: [
            {
              loader: "json-loader",
            },
          ],
        },
      ],
    },
  })
}
