import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { connect, useDispatch } from "react-redux";

function Snack(props) {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({
      type: "message",
      payload: {
        view: false,
        message: "",
        success: false,
      },
    });
  };

  if (!props.snackbar || !props.snackbar.view) {
    return null;
  }

  const isSuccess = Boolean(props.snackbar.success);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={Boolean(props.snackbar.view)}
      onClose={handleClose}
      autoHideDuration={6000}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.8rem 1.15rem",
          borderRadius: "14px",
          background: isSuccess
            ? "rgba(6, 78, 59, 0.92)"
            : "rgba(127, 29, 29, 0.92)",
          backdropFilter: "blur(16px)",
          border: isSuccess
            ? "1px solid rgba(52, 211, 153, 0.4)"
            : "1px solid rgba(248, 113, 113, 0.4)",
          color: "#ffffff",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.45)",
          fontFamily: '"Open Sans", "Montserrat", sans-serif',
          fontSize: "0.9rem",
          maxWidth: "460px",
        }}
      >
        <span
          className="material-icons"
          style={{
            fontSize: "1.25rem",
            color: isSuccess ? "#34d399" : "#f87171",
          }}
        >
          {isSuccess ? "check_circle" : "error_outline"}
        </span>

        <div style={{ flex: 1 }}>
          {typeof props.snackbar.message === "string" ? (
            <p style={{ margin: 0 }}>{props.snackbar.message}</p>
          ) : Array.isArray(props.snackbar.message) ? (
            <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
              {props.snackbar.message.map((msg, index) => (
                <li key={index}>{msg.message}</li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>{String(props.snackbar.message || "")}</p>
          )}
        </div>

        <IconButton
          size="small"
          aria-label="Close notification"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Snackbar>
  );
}

const mapStateToProps = (state) => ({
  snackbar: state.userReducer.snackbar,
});

export default connect(mapStateToProps, null)(Snack);
