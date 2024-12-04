import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, addPost } from "./postsSlice";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import z, { set } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// zod validation schema
const schema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(50, "Title must be at most 50 characters long"),
  body: z
    .string()
    .min(20, "Body must be at least 20 characters long")
    .max(300, "Body must be at most 300 characters long"),
});

const PostsList = () => {
  const [deleted, setDeleted] = useState([]);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postsData.posts).filter(
    (post) => !deleted.includes(post.id)
  );
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
  });
  //React Router
  const navigate = useNavigate();

  //React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  //watch title and body
  const watchTitle = watch("title", "");
  const watchBody = watch("body", "");

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const onSubmit = () => {
    // dispatch action
    dispatch(addPost(newPost)).then(() => {
      setNewPost({ title: "", body: "" });
      toast.success("Post added successfully");
    });
  };

  //handel detail
  const handleCardClick = (id) => {
    navigate(`/postDetail?id=${id}`);
  };

  //handle delete
  const handleDelete = (id) => {
    setDeleted([...deleted, id]);
    toast.error("Post deleted successfully");
  };
  return (
    <>
      <div className="posts-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {posts &&
                posts.map((post) => (
                  <div
                    id={post.id}
                    className="card post-item dimhover"
                    key={post.id}
                    onClick={() => handleCardClick(post.id)}
                  >
                    <div className="card-body">
                      <h5>
                        {post.id} - {post.title}
                      </h5>
                      <p className="card-text">{post.body}</p>
                      <div className="postControlButtons">
                        <button
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Update
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {/*form*/}
            <div className="col-lg-4">
              <div className="add-post-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {errors.title && (
                    <p className="text-danger">{errors.title.message}</p>
                  )}
                  <input
                    {...register("title")}
                    type="text"
                    className="form-control mb-2"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => {
                      setNewPost({ ...newPost, title: e.target.value });
                    }}
                  />
                  {errors.body && (
                    <p className="text-danger">{errors.body.message}</p>
                  )}
                  <textarea
                    {...register("body")}
                    className="form-control mb-2"
                    placeholder="Body"
                    rows="4"
                    value={newPost.body}
                    onChange={(e) => {
                      setNewPost({ ...newPost, body: e.target.value });
                    }}
                  />
                  <button
                    className="btn btn-success"
                    type="submit"
                    disabled={!watchTitle || !watchBody}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default PostsList;
