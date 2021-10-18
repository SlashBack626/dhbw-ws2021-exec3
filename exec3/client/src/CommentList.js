import React from "react";

// hs002 receive the list of comments
const CommentList = ({ comments }) => {

  // hs002 delete this stuff
  
  // hs003 put this in for handling comment status info
  const renderedComments = comments.map((comment) => {
    let content;
    if (comment.status === 'approved') {
      content = comment.content;
    }
    if (comment.status === 'pending') {
      content = 'This comment is wating for moderation';
    }
    if (comment.status === 'rejected') {
      content = 'This comment has been rejected rejected';
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
