Bluesky comments, ported to use deno and preact.

[Original Package](https://www.npmjs.com/package/bluesky-comments) on NPM by [@czue](https://github.com/czue) on Github.

# Bluesky Comments

Embed Bluesky comments on your website easily.

**[Write up and demo here](https://coryzue.com/writing/bluesky-comments).**

## Installation in a Deno or Node.js project as a Preact component

To use this library in a Preact project, first install the library:

```bash
npm install bluesky-comments
```

Then import it (and the CSS) in your Preact app/page/component:

```tsx
import 'bluesky-comments/bluesky-comments.css'
import { BlueskyComments } from 'bluesky-comments';
```

And use it in any Preact component like this:

```javascript
function App() {
  return (
    <>
      <div>Comments Will Display Below</div>
      <BlueskyComments author="you.bsky.social" />
    </>
  )
}
```

See the [Usage](#usage) section below for details on the options and API.

## Installation on any website via CDN

For this, use the [original project's](https://www.npmjs.com/package/bluesky-comments) instructions. This package is optimized for Preact projects.

## Usage

```javascript
<BlueskyComments
  author="you.bsky.social"
  uri="https://bsky.app/profile/coryzue.com/post/3lbrko5zsgk24"
/>
```

### Initializing the library based on the author


```javascript
<BlueskyComments author="you.bsky.social"  />
```

If you use this mode, the comments section will use the most popular post by that author that links
to the current page.

### Initializing the library based on a post URL

```javascript
<BlueskyComments uri="https://bsky.app/profile/coryzue.com/post/3lbrko5zsgk24" />
```

If you use this mode, the comments section will use the exact post you specify.
This usually means you have to add the comments section only *after* you've linked to the article.

### (Advanced) Providing custom default empty states

You can pass in a `onEmpty` callback to handle the case where there are no comments rendered
(for example, if no post matching the URL is found or there aren't any comments on it yet):

```javascript
<BlueskyComments
    uri="https://bsky.app/profile/coryzue.com/post/3lbrko5zsgk24"
    author="you.bsky.social"
    onEmpty={
      (details) => {
        console.error('Failed to load comments:', details);
        document.getElementById('bluesky-comments').innerHTML =
          'No comments on this post yet. Details: ' + details.message;
      }
    }
});
```

### (Advanced) Filtering comments

You can pass in an array of filters to the `commentFilters` option. These are functions that take a comment and return a boolean. If any of the filters return true, the comment will not be shown.

A few default filters utilities are provided:

- `BlueskyFilters.NoPins`: Hide comments that are just "📌"
- `BlueskyFilters.NoLikes`: Hide comments with no likes

You can also use the following utilities to create your own filters:

- `BlueskyFilters.MinLikeCountFilter`: Hide comments with less than a given number of likes
- `BlueskyFilters.MinCharacterCountFilter`: Hide comments with less than a given number of characters
- `BlueskyFilters.TextContainsFilter`: Hide comments that contain specific text (case insensitive)
- `BlueskyFilters.ExactMatchFilter`: Hide comments that match text exactly (case insensitive)

Pass filters using the `commentFilters` option:

```javascript
import {BlueskyComments, BlueskyFilters} from 'bluesky-comments';

<BlueskyComments
    // other options here
    commentFilters={[
      BlueskyFilters.NoPins,  // Hide pinned comments
      BlueskyFilters.MinCharacterCountFilter(10), // Hide comments with less than 10 characters
    ]}
/>
```

You can also write your own filters, by returning `true` for comments you want to hide:

```javascript
const NoTwitterLinksFilter = (comment) => {
  return (comment.post.record.text.includes('https://x.com/') || comment.post.record.text.includes('https://twitter.com/'));
}
<BlueskyComments
    // other options here
    commentFilters={[
      NoTwitterLinksFilter,
    ]
/>
```