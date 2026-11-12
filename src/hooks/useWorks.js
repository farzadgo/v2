import { useStaticQuery, graphql } from 'gatsby'

// all works, newest first, with the small 3:2 images used by WorkPreview
// (`previews` always starts with the thumb, see gatsby-node.js)
const useWorks = () => {
  const data = useStaticQuery(graphql`
    query Works {
      allMarkdownRemark(
        filter: {fileAbsolutePath: {regex: "/works/"}}
        sort: {frontmatter: {date: DESC}}
      ) {
        nodes {
          frontmatter {
            title
            subtitle
            slug
            date
            category
            parent
            previews {
              id
              childImageSharp {
                gatsbyImageData(
                  width: 800,
                  aspectRatio: 1.5,
                  quality: 70,
                  placeholder: BLURRED,
                  transformOptions: {cropFocus: CENTER},
                )
              }
            }
          }
        }
      }
    }
  `)

  return data.allMarkdownRemark.nodes.map(node => node.frontmatter)
}

export default useWorks
