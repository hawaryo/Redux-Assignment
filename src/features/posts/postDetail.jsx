// PostDetail.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
const PostDetail = () => {
  const query = useQuery();
  const id = query.get("id");
  const post = useSelector((state) =>
    state.postsData.posts.find((post) => post.id.toString() === id)
  );

  console.log(id);

  return (
    <div className="posts-container">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="card post-item ">
              <div className="card-body">
                <h5>
                  {post.id} - {post.title}
                </h5>
                <p className="card-text">{post.body}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
