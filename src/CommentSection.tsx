/**
* This module defines the CommentSection component. 
* It fetches the comments for a post and displays them in a threaded format.
* @module
*/

import { useState, useEffect } from "npm:preact@10.26.4/hooks";
import { AppBskyFeedDefs, type AppBskyFeedGetPostThread } from 'npm:@atproto/api@0.14.9';
import { CommentOptions } from './types.tsx';
import { PostSummary } from './PostSummary.tsx';
import { Comment } from './Comment.tsx';

const getAtUri = (uri: string): string => {
  if (!uri.startsWith('at://') && uri.includes('bsky.app/profile/')) {
    const match = uri.match(/profile\/([\w:.]+)\/post\/([\w]+)/);
    if (match) {
      const [, did, postId] = match;
      return `at://${did}/app.bsky.feed.post/${postId}`;
    }
  }
  return uri;
};

/**
* This component displays a comment section for a post. 
* It fetches the comments for a post and displays them in a threaded format.
*/
export const CommentSection = ({
  uri: propUri,
  author,
  onEmpty,
  commentFilters,
}: CommentOptions): any => {
  const [uri, setUri] = useState<string | null>(null);
  const [thread, setThread] = useState<AppBskyFeedDefs.ThreadViewPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

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

  useEffect(() => {
    if (propUri) {
      setUri(propUri);
      return;
    }

    if (author) {
      const fetchPost = async () => {
        const currentUrl = window.location.href;
        // const currentUrl = "https://www.coryzue.com/writing/authenticity-and-engagement/"
        const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=*&url=${encodeURIComponent(
          currentUrl
        )}&author=${author}&sort=top`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.posts && data.posts.length > 0) {
            const post = data.posts[0];
            setUri(post.uri);
          } else {
            setError('No matching post found');
            onEmpty?.({ code: 'not_found', message: 'No matching post found' });
          }
        } catch (err) {
          setError('Error fetching post');
          onEmpty?.({ code: 'fetching_error', message: 'Error fetching post' });
        }
      };

      fetchPost();
    }
  }, [propUri, author, onEmpty]);

  useEffect(() => {
    if (uri) {
      const fetchThreadData = async () => {
        try {
          const thread = await getPostThread(uri);
          setThread(thread);
        } catch (err) {
          setError('Error loading comments');
          onEmpty?.({
            code: 'comment_loading_error',
            message: 'Error loading comments',
          });
        }
      };

      fetchThreadData();
    }
  }, [uri, onEmpty]);

  if (!uri) return null;

  if (error) {
    return <p className="errorText">{error}</p>;
  }

  if (!thread) {
    return <p className="loadingText">Loading comments...</p>;
  }

  const showMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  let postUrl: string = uri;
  if (uri.startsWith('at://')) {
    const [, , did, _, rkey] = uri.split('/');
    postUrl = `https://bsky.app/profile/${did}/post/${rkey}`;
  }

  if (!thread.replies || thread.replies.length === 0) {
    return (
      <div className="container">
        <PostSummary postUrl={postUrl} post={thread.post} />
      </div>
    );
  }
  const sortedReplies = thread.replies.sort(sortByLikes);

  return (
    <div className="container">
      <style>{styles}</style>
      <PostSummary postUrl={postUrl} post={thread.post} />
      <hr className="divider" />
      <div className="commentsList">
        {sortedReplies.slice(0, visibleCount).map((reply) => {
          if (!AppBskyFeedDefs.isThreadViewPost(reply)) return null;
          return (
            <Comment
              key={reply.post.uri}
              comment={reply}
              filters={commentFilters}
            />
          );
        })}
        {visibleCount < sortedReplies.length && (
          <a onClick={showMore} className="showMoreButton">
            Show more comments
          </a>
        )}
      </div>
    </div>
  );
};

const getPostThread = async (uri: string): Promise<AppBskyFeedDefs.ThreadViewPost> => {
  const atUri = getAtUri(uri);
  const params = new URLSearchParams({ uri: atUri });

  const res = await fetch(
    'https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?' +
      params.toString(),
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error('Failed to fetch post thread');
  }

  const data = (await res.json()) as AppBskyFeedGetPostThread.OutputSchema;

  if (!AppBskyFeedDefs.isThreadViewPost(data.thread)) {
    throw new Error('Could not find thread');
  }

  return data.thread;
};

const sortByLikes = (a: unknown, b: unknown) => {
  if (
    !AppBskyFeedDefs.isThreadViewPost(a) ||
    !AppBskyFeedDefs.isThreadViewPost(b) ||
    !('post' in a) ||
    !('post' in b)
  ) {
    return 0;
  }
  const aPost = a as AppBskyFeedDefs.ThreadViewPost;
  const bPost = b as AppBskyFeedDefs.ThreadViewPost;
  return (bPost.post.likeCount ?? 0) - (aPost.post.likeCount ?? 0);
};