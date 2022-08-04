import { Post, PostService } from "goodvandro-alganews-sdk"
import { ResourceNotFoundError } from "goodvandro-alganews-sdk/dist/errors"
import { GetServerSideProps } from "next"
import { ParsedUrlQuery } from "querystring"
import Head from 'next/head';
import PostHeader from "../../../components/PostHeader";
import Markdown from "../../../components/Markdown";

interface PostProps extends NextPageProps {
  post?: Post.Detailed
  host?: string
}

export default function PostPage(props: PostProps) {
  const { post } = props;

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`http://localhost:3000/posts/${props.post?.id}/${props.post?.slug}`}
        />
      </Head>
      {post && (
        <>
          <PostHeader
            thumbnail={post?.imageUrls.large}
            createdAt={post?.createdAt}
            editor={post?.editor}
            title={post?.title}
          />
          <Markdown>
            {post.body}
          </Markdown>
        </>
      )}
    </>
  )
}

interface Params extends ParsedUrlQuery {
  id: string
  slug: string
}

export const getServerSideProps: GetServerSideProps<PostProps, Params> =
  async ({ params, res, req }) => {
    try {
      if (!params) return { notFound: true }

      const { id, slug } = params
      const postId = Number(id)

      if (isNaN(postId)) return { notFound: true }

      const post = await PostService.getExistingPost(postId)

      return {
        props: {
          post,
          host: req.headers.host,
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