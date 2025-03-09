/**
This module allows you to filter out comments based on likes, 
characters, text, pins, or exact matches.
@module
*/

import { AppBskyFeedPost, type AppBskyFeedDefs } from 'npm:@atproto/api@0.14.9';

const MinLikeCountFilter = (
  min: number
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return (comment.post.likeCount ?? 0) < min;
  };
};

const MinCharacterCountFilter = (
  min: number
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    if (!AppBskyFeedPost.isRecord(comment.post.record)) {
      return false;
    }
    const record = comment.post.record as AppBskyFeedPost.Record;
    return record.text.length < min;
  };
};

const TextContainsFilter = (
  text: string
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    if (!AppBskyFeedPost.isRecord(comment.post.record)) {
      return false;
    }
    const record = comment.post.record as AppBskyFeedPost.Record;
    return record.text.toLowerCase().includes(text.toLowerCase());
  };
};

const ExactMatchFilter = (
  text: string
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    if (!AppBskyFeedPost.isRecord(comment.post.record)) {
      return false;
    }
    const record = comment.post.record as AppBskyFeedPost.Record;
    return record.text.toLowerCase() === text.toLowerCase();
  };
};

/* 
  This function allows you to filter out comments based on likes,
  characters, text, pins, or exact matches.
*/
export const Filters: {
  MinLikeCountFilter: (min: number) => (comment: AppBskyFeedDefs.ThreadViewPost) => boolean;
  MinCharacterCountFilter: (min: number) => (comment: AppBskyFeedDefs.ThreadViewPost) => boolean;
  TextContainsFilter: (text: string) => (comment: AppBskyFeedDefs.ThreadViewPost) => boolean;
  ExactMatchFilter: (text: string) => (comment: AppBskyFeedDefs.ThreadViewPost) => boolean;
  NoLikes: (comment: AppBskyFeedDefs.ThreadViewPost) => boolean;
  NoPins: (comment: AppBskyFeedDefs.ThreadViewPost) => boolean;
} = {
  MinLikeCountFilter,
  MinCharacterCountFilter,
  TextContainsFilter,
  ExactMatchFilter,
  NoLikes: MinLikeCountFilter(0),
  NoPins: ExactMatchFilter('📌'),
};

export default Filters;
