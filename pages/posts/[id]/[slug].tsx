import { Post, PostService } from "goodvandro-alganews-sdk"
import { ResourceNotFoundError } from "goodvandro-alganews-sdk/dist/errors"
import { GetServerSideProps } from "next"
import { ParsedUrlQuery } from "querystring"

interface PostProps extends NextPageProps {
  post?: Post.Detailed,
}

export default function PostPage(props: PostProps) {
  return (
    <div> {props.post?.title} </div>
  )
}

interface Params extends ParsedUrlQuery {
  id: string
  slug: string
}

export const getServerSideProps: GetServerSideProps<PostProps, Params> =
  async ({ params, res }) => {
    try {
      if (!params) return { notFound: true }

      const { id, slug } = params
      const postId = Number(id)

      if (isNaN(postId)) return { notFound: true }

      const post = await PostService.getExistingPost(postId)

      if (slug !== post.slug) {
        res.statusCode = 301 // redirecting status code
        res.setHeader('Location', `/posts/${post.id}/${post.slug}`)
        return { props: {} }
      }

      return {
        props: {
          post,
        },
      }
    } catch (error: any) {
      if (error instanceof ResourceNotFoundError) {
        return { notFound: true }
      }
      return {
        props: {
          error: {
            message: error.message,
            statusCode: error.data?.status || 500,
          }
        },
      }
    }
  }