const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {

  const { data } = await graphql(`
    query Works {
      allMarkdownRemark(
        filter: {fileAbsolutePath: {regex: "/works/"}}
      ) {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `)

  data.allMarkdownRemark.nodes.forEach(node => {
    // const slug = node.frontmatter.slug
    // const path = '/works/' + slug
    actions.createPage({
      path: '/works/' + node.frontmatter.slug,
      component: path.resolve('./src/templates/work-details.js'),
      context: { 
        slug: node.frontmatter.slug,
        dir: 'works/' + node.frontmatter.slug
      }
    })
  })

}