const path = require(`path`)

// optional work frontmatter fields, declared so queries don't break while no file uses them
// cover: filename of an image in the work's folder, shown under the header and left out of the galleries
// captions: list of { file, text } adding a caption under individual images
// thumb: filename of an image in the work's folder (or a path relative to the markdown file),
//   defaults to the first image of the folder
// previews: filenames of images shown in the hover preview, after the thumb,
//   defaults to the next few images of the folder
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
    }
    type MarkdownRemarkFrontmatter {
      cover: String
      captions: [WorkImageCaption]
      thumb: File
      previews: [File]
    }
    type WorkImageCaption {
      file: String
      text: String
    }
  `)
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png']
const DEFAULT_PREVIEW_COUNT = 5

// the images in content/works/<slug>/, sorted by name like the work page
const workImages = async (context, slug) => {
  if (!slug) return []
  const { entries } = await context.nodeModel.findAll({
    type: 'File',
    query: { filter: { relativeDirectory: { eq: `works/${slug}` }, extension: { in: IMAGE_EXTENSIONS } } },
  })
  return Array.from(entries).sort((a, b) => (a.name < b.name ? -1 : 1))
}

// a plain filename is looked up in the work's folder, a path is resolved from the markdown file
const findImage = async (context, frontmatter, images, value) => {
  if (!value) return null
  if (value.includes('/')) {
    const markdownFile = context.nodeModel.findRootNodeAncestor(frontmatter, node => node.internal.type === 'File')
    if (!markdownFile) return null
    const absolutePath = path.resolve(markdownFile.dir, value)
    return context.nodeModel.findOne({ type: 'File', query: { filter: { absolutePath: { eq: absolutePath } } } })
  }
  return images.find(img => img.base === value || img.name === value) || null
}

const resolveThumb = async (context, frontmatter, images) =>
  (await findImage(context, frontmatter, images, frontmatter.thumb)) || images[0] || null

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    MarkdownRemarkFrontmatter: {
      thumb: {
        resolve: async (frontmatter, args, context) => {
          const images = await workImages(context, frontmatter.slug)
          return resolveThumb(context, frontmatter, images)
        },
      },
      previews: {
        resolve: async (frontmatter, args, context) => {
          const images = await workImages(context, frontmatter.slug)
          const thumb = await resolveThumb(context, frontmatter, images)
          const listed = frontmatter.previews
            ? await Promise.all(frontmatter.previews.map(value => findImage(context, frontmatter, images, value)))
            : images.filter(img => !thumb || img.id !== thumb.id).slice(0, DEFAULT_PREVIEW_COUNT - 1)
          // thumb first, without missing or repeated images
          return [thumb, ...listed].filter((img, i, all) => img && all.findIndex(other => other && other.id === img.id) === i)
        },
      },
    },
  })
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
