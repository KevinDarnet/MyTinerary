import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as LinkRouter } from "react-router-dom";
import {
  cargarComentario,
  actualizarComentario,
  eliminarComentario,
} from "../Redux/actions/comentarioActions";
import UserAvatar from "../Common/UserAvatar";
import "../Styles/comentarios.css";

const Comments = (props) => {
  const dispatch = useDispatch();
  const usuario = props.user;
  const cambio = useSelector((state) => state.comentarioReducer.cambio);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [inputText, setInputText] = useState("");

  const commentsList = Array.isArray(props?.comments) ? props.comments : [];

  async function handleAddComment() {
    if (!inputText || !inputText.trim()) return;
    const comentarioUsuario = {
      itineraryID: props.itineraryID,
      comments: inputText.trim(),
    };

    await dispatch(cargarComentario(comentarioUsuario, cambio));
    setInputText("");
  }

  function startEditing(comment) {
    setEditingId(comment._id);
    setEditValue(comment.comment || "");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditValue("");
  }

  async function handleSaveEdit(commentId) {
    if (!editValue || !editValue.trim()) return;
    const comentarioUsuario = {
      _id: commentId,
      comments: editValue.trim(),
    };
    await dispatch(actualizarComentario(comentarioUsuario, cambio));
    setEditingId(null);
    setEditValue("");
  }

  async function handleDeleteComment(commentId) {
    await dispatch(eliminarComentario(commentId, cambio));
  }

  const loggedUserName =
    usuario?.fullName || usuario?.name || usuario?.username || "Traveler";
  const loggedUserPhoto =
    usuario?.photo ||
    usuario?.picture ||
    usuario?.userimage ||
    usuario?.userPhoto ||
    usuario?.image ||
    "";

  return (
    <div className="comments-section">
      <div className="comments-section__header">
        <div className="comments-section__title-group">
          <span
            className="material-icons"
            style={{ fontSize: "1.2rem", color: "#818cf8" }}
          >
            forum
          </span>
          <h3 className="comments-section__title">Traveler Comments</h3>
        </div>
        <span className="comments-section__badge">
          {commentsList.length}{" "}
          {commentsList.length === 1 ? "Comment" : "Comments"}
        </span>
      </div>

      {commentsList.length > 0 ? (
        <div className="comments-list">
          {commentsList.map((comment, index) => {
            const commentUserObj =
              comment?.userID && typeof comment.userID === "object"
                ? comment.userID
                : null;
            const commentUserId =
              commentUserObj?._id || commentUserObj?.id || comment?.userID;
            const isOwner =
              Boolean(usuario?.id) &&
              String(commentUserId) === String(usuario?.id);

            const authorName =
              commentUserObj?.fullName ||
              commentUserObj?.name ||
              commentUserObj?.username ||
              commentUserObj?.userName ||
              comment?.userName ||
              comment?.username ||
              comment?.userName ||
              (isOwner ? loggedUserName : "") ||
              "Traveler";

            const authorPic =
              commentUserObj?.photo ||
              commentUserObj?.picture ||
              commentUserObj?.userimage ||
              commentUserObj?.userPhoto ||
              commentUserObj?.image ||
              comment?.userPhoto ||
              comment?.userimage ||
              comment?.userImage ||
              (isOwner ? loggedUserPhoto : "") ||
              "";

            const isEditing = editingId === comment._id;

            return (
              <div className="comment-card" key={comment?._id || index}>
                <UserAvatar src={authorPic} name={authorName} size={42} />

                <div className="comment-card__content">
                  <div className="comment-card__top">
                    <div className="comment-card__user-meta">
                      <h4 className="comment-card__author">{authorName}</h4>
                      <span className="comment-card__time">
                        Verified Traveler
                      </span>
                    </div>

                    {isOwner && !isEditing && (
                      <div className="comment-card__actions">
                        <button
                          type="button"
                          className="comment-action-btn"
                          onClick={() => startEditing(comment)}
                          title="Edit comment"
                          aria-label="Edit comment"
                        >
                          <span
                            className="material-icons"
                            style={{ fontSize: "1rem" }}
                          >
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          className="comment-action-btn comment-action-btn--delete"
                          onClick={() => handleDeleteComment(comment._id)}
                          title="Delete comment"
                          aria-label="Delete comment"
                        >
                          <span
                            className="material-icons"
                            style={{ fontSize: "1rem" }}
                          >
                            delete_outline
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="comment-edit-box">
                      <input
                        className="comment-edit-input"
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveEdit(comment._id);
                          } else if (e.key === "Escape") {
                            cancelEditing();
                          }
                        }}
                        placeholder="Edit your comment..."
                        autoFocus
                      />
                      <div className="comment-edit-actions">
                        <button
                          type="button"
                          className="comment-btn-cancel"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="comment-btn-save"
                          onClick={() => handleSaveEdit(comment._id)}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="comment-card__text">{comment?.comment}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="comments-empty">
          No comments yet. Be the first traveler to share your experience!
        </div>
      )}

      {usuario ? (
        <div className="comment-composer">
          <textarea
            onChange={(event) => setInputText(event.target.value)}
            className="comment-composer__input"
            value={inputText}
            placeholder="Write a comment..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <div className="comment-composer__footer">
            <div className="comment-composer__user">
              <UserAvatar
                src={loggedUserPhoto}
                name={loggedUserName}
                size={32}
              />
              <span className="comment-composer__hint">
                Commenting as <strong>{loggedUserName}</strong> · Press Enter to
                post
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddComment}
              className="comment-composer__submit"
            >
              <span>Post Comment</span>
              <span className="material-icons" style={{ fontSize: "1rem" }}>
                send
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="comment-signin-prompt">
          <div className="comment-signin-prompt__text">
            <span
              className="material-icons"
              style={{ fontSize: "1.2rem", color: "#fbbf24" }}
            >
              lock_open
            </span>
            <span>Sign in to leave a comment and join the conversation.</span>
          </div>
          <LinkRouter to="/login" className="comment-signin-prompt__btn">
            Sign In
          </LinkRouter>
        </div>
      )}
    </div>
  );
};

export default Comments;
