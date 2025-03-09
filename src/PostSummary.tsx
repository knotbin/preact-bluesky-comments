import { AppBskyFeedDefs } from 'npm:@atproto/api@0.14.9';

type PostSummaryProps = {
  postUrl: string;
  post: AppBskyFeedDefs.PostView;
};

export const PostSummary = ({ postUrl, post }: PostSummaryProps) => {
  const styles = `
    .container {
      max-width: 740px;
      margin: 0 auto;
    }

    .statsBar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .statsBar:hover {
      text-decoration: underline;
    }

    .statItem {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      white-space: nowrap;
    }

    .container a.link {
      text-decoration: underline;
    }

    .container a.link:hover {
      text-decoration: underline;
    }

    .icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .errorText, .loadingText {
      text-align: center;
    }

    .commentsTitle {
      margin-top: 1.5rem;
      font-size: 1.25rem;
      font-weight: bold;
    }

    .replyText {
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }

    .divider {
      margin-top: 0.5rem;
    }

    .commentsList {
      margin-top: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .container .showMoreButton {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      text-decoration: underline;
    }

    .container .showMoreButton:hover {
      text-decoration: underline;
    }

    .commentContainer {
      margin: 1rem 0;
      font-size: 0.875rem;
    }

    .commentContent {
      display: flex;
      max-width: 36rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .authorLink {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 0.5rem;
    }

    .authorLink:hover {
      text-decoration: underline;
    }

    .avatar {
      height: 1rem;
      width: 1rem;
      flex-shrink: 0;
      border-radius: 9999px;
      background-color: #d1d5db;
    }

    .authorName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .container a {
      text-decoration: none;
      color: inherit;
    }

    .container a:hover {
      text-decoration: none;
    }

    .commentContent .handle {
      color: #6b7280;
    }
    .repliesContainer {
      border-left: 2px solid #525252;
      padding-left: 0.5rem;
    }

    .actionsContainer {
      margin-top: 0.5rem;
      display: flex;
      width: 100%;
      max-width: 150px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      opacity: 0.6;
    }


    .actionsRow {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <a href={postUrl} target="_blank" rel="noreferrer noopener">
        <p className="statsBar">
          <span className="statItem">
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="pink"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="pink"
              flood-color="pink"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <span>{post.likeCount ?? 0} likes</span>
          </span>
          <span className="statItem">
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="green"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
              />
            </svg>
            <span>{post.repostCount ?? 0} reposts</span>
          </span>
          <span className="statItem">
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="#7FBADC"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#7FBADC"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
              />
            </svg>
            <span>{post.replyCount ?? 0} replies</span>
          </span>
        </p>
      </a>
      <h2 className="commentsTitle">Comments</h2>
      <p className="replyText">
        Join the conversation by{' '}
        <a
          className="link"
          href={postUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          replying on Bluesky
        </a>
        .
      </p>
    </>
  );
};
