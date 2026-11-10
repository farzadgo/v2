const path = require(`path`)

// optional work frontmatter fields, declared so queries don't break while no file uses them
// cover: filename of an image in the work's folder, shown under the header and left out of the galleries
// captions: list of { file, text } adding a caption under individual images
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
    }
    type MarkdownRemarkFrontmatter {
      cover: String
      captions: [WorkImageCaption]
    }
    type WorkImageCaption {
      file: String
      text: String
    }
  `)
}

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
